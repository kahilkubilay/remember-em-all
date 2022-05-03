
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Playground\Cards\CardBack.svelte generated by Svelte v3.46.4 */

    const file$i = "src\\components\\Playground\\Cards\\CardBack.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "single-poke");
    			attr_dev(img, "alt", /*pokemonNumber*/ ctx[0]);
    			add_location(img, file$i, 5, 2, 74);
    			attr_dev(div, "class", "back svelte-awkf73");
    			add_location(div, file$i, 4, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pokemonNumber*/ 1) {
    				attr_dev(img, "alt", /*pokemonNumber*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardBack', slots, []);
    	let { pokemonNumber } = $$props;
    	const writable_props = ['pokemonNumber'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardBack> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pokemonNumber' in $$props) $$invalidate(0, pokemonNumber = $$props.pokemonNumber);
    	};

    	$$self.$capture_state = () => ({ pokemonNumber });

    	$$self.$inject_state = $$props => {
    		if ('pokemonNumber' in $$props) $$invalidate(0, pokemonNumber = $$props.pokemonNumber);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pokemonNumber];
    }

    class CardBack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { pokemonNumber: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardBack",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pokemonNumber*/ ctx[0] === undefined && !('pokemonNumber' in props)) {
    			console.warn("<CardBack> was created without expected prop 'pokemonNumber'");
    		}
    	}

    	get pokemonNumber() {
    		throw new Error("<CardBack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokemonNumber(value) {
    		throw new Error("<CardBack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Playground\Cards\CardFront.svelte generated by Svelte v3.46.4 */

    const file$h = "src\\components\\Playground\\Cards\\CardFront.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + /*pokemonNumber*/ ctx[0] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "card on the playing field");
    			attr_dev(img, "class", "single-poke");
    			attr_dev(img, "pokemondetail", /*pokemonNumber*/ ctx[0]);
    			add_location(img, file$h, 5, 2, 75);
    			attr_dev(div, "class", "front svelte-od8hra");
    			add_location(div, file$h, 4, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pokemonNumber*/ 1 && !src_url_equal(img.src, img_src_value = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + /*pokemonNumber*/ ctx[0] + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*pokemonNumber*/ 1) {
    				attr_dev(img, "pokemondetail", /*pokemonNumber*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardFront', slots, []);
    	let { pokemonNumber } = $$props;
    	const writable_props = ['pokemonNumber'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardFront> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pokemonNumber' in $$props) $$invalidate(0, pokemonNumber = $$props.pokemonNumber);
    	};

    	$$self.$capture_state = () => ({ pokemonNumber });

    	$$self.$inject_state = $$props => {
    		if ('pokemonNumber' in $$props) $$invalidate(0, pokemonNumber = $$props.pokemonNumber);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pokemonNumber];
    }

    class CardFront extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { pokemonNumber: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardFront",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pokemonNumber*/ ctx[0] === undefined && !('pokemonNumber' in props)) {
    			console.warn("<CardFront> was created without expected prop 'pokemonNumber'");
    		}
    	}

    	get pokemonNumber() {
    		throw new Error("<CardFront>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokemonNumber(value) {
    		throw new Error("<CardFront>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Playground\Cards\Card.svelte generated by Svelte v3.46.4 */
    const file$g = "src\\components\\Playground\\Cards\\Card.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let backcardface;
    	let t;
    	let frontcardface;
    	let current;

    	backcardface = new CardBack({
    			props: { pokemonNumber: /*pokemonNumber*/ ctx[0] },
    			$$inline: true
    		});

    	frontcardface = new CardFront({
    			props: { pokemonNumber: /*pokemonNumber*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(backcardface.$$.fragment);
    			t = space();
    			create_component(frontcardface.$$.fragment);
    			attr_dev(div, "class", "flipper svelte-d4nmyx");
    			add_location(div, file$g, 5, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(backcardface, div, null);
    			append_dev(div, t);
    			mount_component(frontcardface, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const backcardface_changes = {};
    			if (dirty & /*pokemonNumber*/ 1) backcardface_changes.pokemonNumber = /*pokemonNumber*/ ctx[0];
    			backcardface.$set(backcardface_changes);
    			const frontcardface_changes = {};
    			if (dirty & /*pokemonNumber*/ 1) frontcardface_changes.pokemonNumber = /*pokemonNumber*/ ctx[0];
    			frontcardface.$set(frontcardface_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(backcardface.$$.fragment, local);
    			transition_in(frontcardface.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(backcardface.$$.fragment, local);
    			transition_out(frontcardface.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(backcardface);
    			destroy_component(frontcardface);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { pokemonNumber } = $$props;
    	const writable_props = ['pokemonNumber'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pokemonNumber' in $$props) $$invalidate(0, pokemonNumber = $$props.pokemonNumber);
    	};

    	$$self.$capture_state = () => ({
    		pokemonNumber,
    		BackCardFace: CardBack,
    		FrontCardFace: CardFront
    	});

    	$$self.$inject_state = $$props => {
    		if ('pokemonNumber' in $$props) $$invalidate(0, pokemonNumber = $$props.pokemonNumber);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pokemonNumber];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { pokemonNumber: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pokemonNumber*/ ctx[0] === undefined && !('pokemonNumber' in props)) {
    			console.warn("<Card> was created without expected prop 'pokemonNumber'");
    		}
    	}

    	get pokemonNumber() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokemonNumber(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     *
     * list: [],
        level: Number,
        levelCounter: Number,
        shakePokeList: [],
     */
    class Pokemons {
        constructor(level) {
            this.level = level;
        }
        list() {
            const list = [];
            const range = 5;
            const levelRange = this.level * range;
            let levelCounter = (levelRange - 5) + 1;
            for (levelCounter; levelCounter <= levelRange; levelCounter++) {
                list.push(levelCounter);
            }
            return list;
        }
        shakeList(list) {
            const shakeList = [];
            const duplicateList = list.concat(list);
            const levelLength = duplicateList.length - 1;
            for (let counter = 0; counter < levelLength + 1; counter++) {
                const randomNumberForList = Math.trunc(Math.random() *
                    duplicateList.length);
                shakeList.push(duplicateList[randomNumberForList]);
                duplicateList.splice(duplicateList
                    .indexOf(duplicateList[randomNumberForList]), 1);
            }
            return shakeList;
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    class UserInfo {
        constructor(name = writable(''), avatar = writable(''), level = writable(1), score = writable(0), isStart = writable(false)) {
            this.name = name;
            this.avatar = avatar;
            this.level = level;
            this.score = score;
            this.isStart = isStart;
        }
    }
    const userInfo = new UserInfo();

    /* src\components\User\name\UserName.svelte generated by Svelte v3.46.4 */
    const file$f = "src\\components\\User\\name\\UserName.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "name");
    			attr_dev(input, "placeholder", "pika pika");
    			attr_dev(input, "class", "name svelte-fbtkw3");
    			add_location(input, file$f, 5, 2, 130);
    			attr_dev(div, "class", "user");
    			add_location(div, file$f, 4, 0, 108);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*$name*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$name*/ 1 && input.value !== /*$name*/ ctx[0]) {
    				set_input_value(input, /*$name*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $name;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserName', slots, []);
    	const { name } = userInfo;
    	validate_store(name, 'name');
    	component_subscribe($$self, name, value => $$invalidate(0, $name = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserName> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$name = this.value;
    		name.set($name);
    	}

    	$$self.$capture_state = () => ({ userInfo, name, $name });
    	return [$name, name, input_input_handler];
    }

    class UserName extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserName",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\User\Header.svelte generated by Svelte v3.46.4 */

    const file$e = "src\\components\\User\\Header.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "select your pokemon and start the battle!";
    			add_location(h2, file$e, 1, 2, 24);
    			attr_dev(div, "class", "header svelte-1tuqxk");
    			add_location(div, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\User\Avatar\ImageAvatar.svelte generated by Svelte v3.46.4 */
    const file$d = "src\\components\\User\\Avatar\\ImageAvatar.svelte";

    function create_fragment$e(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*userSelectAvatar*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "avatar");
    			attr_dev(img, "class", "avatar unpicked svelte-186co7w");
    			add_location(img, file$d, 16, 0, 537);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*selectAvatar*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*userSelectAvatar*/ 1 && !src_url_equal(img.src, img_src_value = /*userSelectAvatar*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $avatar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ImageAvatar', slots, []);
    	const { avatar } = userInfo;
    	validate_store(avatar, 'avatar');
    	component_subscribe($$self, avatar, value => $$invalidate(3, $avatar = value));
    	let { userSelectAvatar } = $$props;

    	const selectAvatar = e => {
    		const isPicked = document.querySelector(".picked");

    		if (isPicked !== null) {
    			isPicked.classList.add("unpicked");
    			isPicked.classList.remove("picked");
    		}

    		e.target.classList.add("picked");
    		e.target.classList.remove("unpicked");
    		const avatarName = userSelectAvatar.match(/\w*(?=.\w+$)/)[0];
    		set_store_value(avatar, $avatar = avatarName, $avatar);
    	};

    	const writable_props = ['userSelectAvatar'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ImageAvatar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('userSelectAvatar' in $$props) $$invalidate(0, userSelectAvatar = $$props.userSelectAvatar);
    	};

    	$$self.$capture_state = () => ({
    		userInfo,
    		avatar,
    		userSelectAvatar,
    		selectAvatar,
    		$avatar
    	});

    	$$self.$inject_state = $$props => {
    		if ('userSelectAvatar' in $$props) $$invalidate(0, userSelectAvatar = $$props.userSelectAvatar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [userSelectAvatar, avatar, selectAvatar];
    }

    class ImageAvatar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { userSelectAvatar: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageAvatar",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*userSelectAvatar*/ ctx[0] === undefined && !('userSelectAvatar' in props)) {
    			console.warn("<ImageAvatar> was created without expected prop 'userSelectAvatar'");
    		}
    	}

    	get userSelectAvatar() {
    		throw new Error("<ImageAvatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userSelectAvatar(value) {
    		throw new Error("<ImageAvatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\User\Avatar\Avatars.svelte generated by Svelte v3.46.4 */
    const file$c = "src\\components\\User\\Avatar\\Avatars.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (12:2) {#each avatars as userSelectAvatar}
    function create_each_block$3(ctx) {
    	let imageavatar;
    	let current;

    	imageavatar = new ImageAvatar({
    			props: {
    				userSelectAvatar: /*userSelectAvatar*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(imageavatar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(imageavatar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imageavatar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imageavatar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(imageavatar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(12:2) {#each avatars as userSelectAvatar}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let current;
    	let each_value = /*avatars*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "avatars svelte-se4ogx");
    			add_location(div, file$c, 10, 0, 320);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*avatars*/ 1) {
    				each_value = /*avatars*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Avatars', slots, []);
    	let sabuha = "/images/sabuha.jpg";
    	let mohito = "/images/mohito.jpg";
    	let pasa = "/images/pasa.jpg";
    	let susi = "/images/susi.jpg";
    	let limon = "/images/limon.jpg";
    	const avatars = [pasa, mohito, sabuha, limon, susi];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Avatars> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		sabuha,
    		mohito,
    		pasa,
    		susi,
    		limon,
    		ImageAvatar,
    		avatars
    	});

    	$$self.$inject_state = $$props => {
    		if ('sabuha' in $$props) sabuha = $$props.sabuha;
    		if ('mohito' in $$props) mohito = $$props.mohito;
    		if ('pasa' in $$props) pasa = $$props.pasa;
    		if ('susi' in $$props) susi = $$props.susi;
    		if ('limon' in $$props) limon = $$props.limon;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [avatars];
    }

    class Avatars extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avatars",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\User\Start.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$b = "src\\components\\User\\Start.svelte";

    function create_fragment$c(ctx) {
    	let div2;
    	let button;
    	let t1;
    	let div0;
    	let span0;
    	let t3;
    	let div1;
    	let span1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Start";
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "please, select a avatar..";
    			t3 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span1.textContent = "enter a name..";
    			attr_dev(button, "class", "svelte-182xn3u");
    			add_location(button, file$b, 18, 2, 531);
    			attr_dev(span0, "class", "unvisible svelte-182xn3u");
    			add_location(span0, file$b, 20, 4, 617);
    			attr_dev(div0, "class", "avatarError visible svelte-182xn3u");
    			add_location(div0, file$b, 19, 2, 578);
    			attr_dev(span1, "class", "unvisible svelte-182xn3u");
    			add_location(span1, file$b, 23, 4, 724);
    			attr_dev(div1, "class", "nameError visible svelte-182xn3u");
    			add_location(div1, file$b, 22, 2, 687);
    			attr_dev(div2, "class", "start svelte-182xn3u");
    			add_location(div2, file$b, 17, 0, 508);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, span0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, span1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*startGame*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $isStart;
    	let $name;
    	let $avatar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Start', slots, []);
    	const { name, avatar, isStart } = userInfo;
    	validate_store(name, 'name');
    	component_subscribe($$self, name, value => $$invalidate(5, $name = value));
    	validate_store(avatar, 'avatar');
    	component_subscribe($$self, avatar, value => $$invalidate(6, $avatar = value));
    	validate_store(isStart, 'isStart');
    	component_subscribe($$self, isStart, value => $$invalidate(4, $isStart = value));

    	const startGame = () => {
    		if ($avatar === "") {
    			document.querySelector(".avatarError span").classList.remove("unvisible");
    			return;
    		}

    		if ($name === "") {
    			document.querySelector(".nameError span").classList.remove("unvisible");
    			return;
    		}

    		set_store_value(isStart, $isStart = true, $isStart);
    		console.log("::: start game :::");
    		console.log("enjoy");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Start> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		userInfo,
    		name,
    		avatar,
    		isStart,
    		startGame,
    		$isStart,
    		$name,
    		$avatar
    	});

    	return [name, avatar, isStart, startGame];
    }

    class Start extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Start",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\User\UserGround.svelte generated by Svelte v3.46.4 */
    const file$a = "src\\components\\User\\UserGround.svelte";

    function create_fragment$b(ctx) {
    	let main;
    	let header;
    	let t0;
    	let avatars;
    	let t1;
    	let username;
    	let t2;
    	let start;
    	let current;
    	header = new Header({ $$inline: true });
    	avatars = new Avatars({ $$inline: true });
    	username = new UserName({ $$inline: true });
    	start = new Start({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(avatars.$$.fragment);
    			t1 = space();
    			create_component(username.$$.fragment);
    			t2 = space();
    			create_component(start.$$.fragment);
    			attr_dev(main, "class", "svelte-15vmz98");
    			add_location(main, file$a, 6, 0, 203);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(avatars, main, null);
    			append_dev(main, t1);
    			mount_component(username, main, null);
    			append_dev(main, t2);
    			mount_component(start, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(avatars.$$.fragment, local);
    			transition_in(username.$$.fragment, local);
    			transition_in(start.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(avatars.$$.fragment, local);
    			transition_out(username.$$.fragment, local);
    			transition_out(start.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(avatars);
    			destroy_component(username);
    			destroy_component(start);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserGround', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserGround> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ UserName, Header, Avatars, Start });
    	return [];
    }

    class UserGround extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserGround",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const catchEmAll = writable([]);
    const openCardsCapsule = writable([]);

    const score = writable(0);

    /* src\components\Trigger\OpenCard.svelte generated by Svelte v3.46.4 */

    function create_fragment$a(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $openCardsCapsule;
    	let $level;
    	let $catchEmAll;
    	let $score;
    	validate_store(openCardsCapsule, 'openCardsCapsule');
    	component_subscribe($$self, openCardsCapsule, $$value => $$invalidate(2, $openCardsCapsule = $$value));
    	validate_store(catchEmAll, 'catchEmAll');
    	component_subscribe($$self, catchEmAll, $$value => $$invalidate(4, $catchEmAll = $$value));
    	validate_store(score, 'score');
    	component_subscribe($$self, score, $$value => $$invalidate(5, $score = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpenCard', slots, []);
    	const { level } = userInfo;
    	validate_store(level, 'level');
    	component_subscribe($$self, level, value => $$invalidate(3, $level = value));

    	const removeAllHovers = (time, callback) => {
    		document.querySelectorAll(".hover").forEach(domData => {
    			domData.classList.remove("hover");
    		});
    	};

    	const levelUp = () => {
    		set_store_value(level, $level++, $level);
    	};

    	const openCard = event => {
    		const element = event.currentTarget;
    		const childElement = event.target;
    		const key = childElement.getAttribute("alt");

    		if (key !== null) {
    			element.classList.add("hover");
    			$openCardsCapsule.push(parseInt(key));

    			if ($openCardsCapsule.length === 2) {
    				const firstSelect = $openCardsCapsule[0];
    				const secondSelect = $openCardsCapsule[1];

    				if (firstSelect === secondSelect) {
    					$catchEmAll.push(firstSelect);
    					set_store_value(score, $score++, $score);

    					if ($catchEmAll.length === $level * 5) {
    						setTimeout(removeAllHovers, 500);
    						setTimeout(levelUp, 750);
    					}
    				} else {
    					setTimeout(
    						() => {
    							document.querySelector(`.flip-container.hover [pokemonDetail="${firstSelect}"]`).closest(".flip-container").classList.remove("hover");
    							document.querySelector(`.flip-container.hover [pokemonDetail="${secondSelect}"]`).closest(".flip-container").classList.remove("hover");
    						},
    						750
    					);
    				}

    				set_store_value(openCardsCapsule, $openCardsCapsule = [], $openCardsCapsule);
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpenCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		userInfo,
    		openCardsCapsule,
    		catchEmAll,
    		score,
    		level,
    		removeAllHovers,
    		levelUp,
    		openCard,
    		$openCardsCapsule,
    		$level,
    		$catchEmAll,
    		$score
    	});

    	return [level, openCard];
    }

    class OpenCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { openCard: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpenCard",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get openCard() {
    		return this.$$.ctx[1];
    	}

    	set openCard(value) {
    		throw new Error("<OpenCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\GameElements\Score.svelte generated by Svelte v3.46.4 */
    const file$9 = "src\\components\\GameElements\\Score.svelte";

    function create_fragment$9(ctx) {
    	let h3;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Score: ");
    			t1 = text(/*$score*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-12o01yi");
    			add_location(h3, file$9, 3, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$score*/ 1) set_data_dev(t1, /*$score*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $score;
    	validate_store(score, 'score');
    	component_subscribe($$self, score, $$value => $$invalidate(0, $score = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Score', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Score> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ score, $score });
    	return [$score];
    }

    class Score extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Score",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\User\name\UserSelectName.svelte generated by Svelte v3.46.4 */
    const file$8 = "src\\components\\User\\name\\UserSelectName.svelte";

    function create_fragment$8(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*$name*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-5vegqh");
    			add_location(h3, file$8, 4, 0, 108);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$name*/ 1) set_data_dev(t, /*$name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $name;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserSelectName', slots, []);
    	const { name } = userInfo;
    	validate_store(name, 'name');
    	component_subscribe($$self, name, value => $$invalidate(0, $name = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserSelectName> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ userInfo, name, $name });
    	return [$name, name];
    }

    class UserSelectName extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSelectName",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\User\Avatar\UserSelectAvatar.svelte generated by Svelte v3.46.4 */
    const file$7 = "src\\components\\User\\Avatar\\UserSelectAvatar.svelte";

    function create_fragment$7(ctx) {
    	let svg;
    	let defs;
    	let pattern;
    	let image;
    	let circle;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			pattern = svg_element("pattern");
    			image = svg_element("image");
    			circle = svg_element("circle");
    			attr_dev(image, "x", "0");
    			attr_dev(image, "y", "0");
    			attr_dev(image, "height", "150");
    			attr_dev(image, "width", "150");
    			xlink_attr(image, "xlink:href", /*setAvatar*/ ctx[2]);
    			add_location(image, file$7, 20, 6, 832);
    			attr_dev(pattern, "id", "image");
    			attr_dev(pattern, "patternUnits", "userSpaceOnUse");
    			attr_dev(pattern, "height", "150");
    			attr_dev(pattern, "width", "150");
    			add_location(pattern, file$7, 19, 4, 749);
    			add_location(defs, file$7, 18, 2, 737);
    			attr_dev(circle, "id", "top");
    			attr_dev(circle, "cx", "75");
    			attr_dev(circle, "cy", "60");
    			attr_dev(circle, "r", "50");
    			attr_dev(circle, "fill", "url(#image)");
    			attr_dev(circle, "stroke", "#112B3C");
    			attr_dev(circle, "stroke-width", "8");
    			add_location(circle, file$7, 23, 2, 932);
    			attr_dev(svg, "width", "150");
    			attr_dev(svg, "height", "120");
    			attr_dev(svg, "stroke-dashoffset", /*scoreDegree*/ ctx[0]);
    			attr_dev(svg, "class", "svelte-1cs56u2");
    			add_location(svg, file$7, 17, 0, 671);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);
    			append_dev(defs, pattern);
    			append_dev(pattern, image);
    			append_dev(svg, circle);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scoreDegree*/ 1) {
    				attr_dev(svg, "stroke-dashoffset", /*scoreDegree*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let degreeOfScore;
    	let scoreDegree;
    	let $score;
    	let $avatar;
    	validate_store(score, 'score');
    	component_subscribe($$self, score, $$value => $$invalidate(4, $score = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserSelectAvatar', slots, []);
    	const { avatar } = userInfo;
    	validate_store(avatar, 'avatar');
    	component_subscribe($$self, avatar, value => $$invalidate(5, $avatar = value));
    	const setAvatar = `images/${$avatar}.jpg`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserSelectAvatar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		userInfo,
    		score,
    		avatar,
    		setAvatar,
    		degreeOfScore,
    		scoreDegree,
    		$score,
    		$avatar
    	});

    	$$self.$inject_state = $$props => {
    		if ('degreeOfScore' in $$props) $$invalidate(3, degreeOfScore = $$props.degreeOfScore);
    		if ('scoreDegree' in $$props) $$invalidate(0, scoreDegree = $$props.scoreDegree);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*degreeOfScore, $score*/ 24) {
    			$$invalidate(0, scoreDegree = degreeOfScore($score));
    		}
    	};

    	$$invalidate(3, degreeOfScore = userScore => {
    		const dashOffsetDegree = 314; //  (2PI * stroke-dash array)
    		const totalCardsOnPlayground = 5;
    		const pieceOfDegree = dashOffsetDegree / totalCardsOnPlayground;
    		const isAllCardsOpen = userScore % totalCardsOnPlayground === 0;

    		let degree = isAllCardsOpen
    		? dashOffsetDegree
    		: dashOffsetDegree - pieceOfDegree * (userScore % 5);

    		return degree;
    	});

    	return [scoreDegree, avatar, setAvatar, degreeOfScore, $score];
    }

    class UserSelectAvatar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSelectAvatar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\User\UserDetail.svelte generated by Svelte v3.46.4 */
    const file$6 = "src\\components\\User\\UserDetail.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let userselectavatar;
    	let t0;
    	let name;
    	let t1;
    	let score;
    	let current;
    	userselectavatar = new UserSelectAvatar({ $$inline: true });
    	name = new UserSelectName({ $$inline: true });
    	score = new Score({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(userselectavatar.$$.fragment);
    			t0 = space();
    			create_component(name.$$.fragment);
    			t1 = space();
    			create_component(score.$$.fragment);
    			attr_dev(main, "class", "svelte-1jkt6zl");
    			add_location(main, file$6, 5, 0, 198);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(userselectavatar, main, null);
    			append_dev(main, t0);
    			mount_component(name, main, null);
    			append_dev(main, t1);
    			mount_component(score, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userselectavatar.$$.fragment, local);
    			transition_in(name.$$.fragment, local);
    			transition_in(score.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userselectavatar.$$.fragment, local);
    			transition_out(name.$$.fragment, local);
    			transition_out(score.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(userselectavatar);
    			destroy_component(name);
    			destroy_component(score);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserDetail', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Score, Name: UserSelectName, UserSelectAvatar });
    	return [];
    }

    class UserDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserDetail",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Playground\Wrapper\Playground.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\components\\Playground\\Wrapper\\Playground.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (29:2) {:else}
    function create_else_block$1(ctx) {
    	let userground;
    	let current;
    	userground = new UserGround({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(userground.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(userground, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userground.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userground.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(userground, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(29:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#if $isStart}
    function create_if_block$2(ctx) {
    	let t;
    	let userdetail;
    	let current;
    	let each_value = /*mixedListOfPokemon*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	userdetail = new UserDetail({ $$inline: true });

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(userdetail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(userdetail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$catchEmAll, mixedListOfPokemon, handler*/ 11) {
    				each_value = /*mixedListOfPokemon*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(userdetail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(userdetail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(userdetail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(15:2) {#if $isStart}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#each mixedListOfPokemon as pokemonNumber}
    function create_each_block$2(ctx) {
    	let opencard;
    	let t;
    	let div;
    	let card;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let opencard_props = {};
    	opencard = new OpenCard({ props: opencard_props, $$inline: true });
    	/*opencard_binding*/ ctx[8](opencard);

    	card = new Card({
    			props: { pokemonNumber: /*pokemonNumber*/ ctx[11] },
    			$$inline: true
    		});

    	function func(...args) {
    		return /*func*/ ctx[9](/*pokemonNumber*/ ctx[11], ...args);
    	}

    	const block = {
    		c: function create() {
    			create_component(opencard.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(card.$$.fragment);
    			attr_dev(div, "class", div_class_value = "flip-container " + ((/*$catchEmAll*/ ctx[3] || []).some(func) && 'hover') + " svelte-1wzhztw");
    			add_location(div, file$5, 17, 6, 694);
    		},
    		m: function mount(target, anchor) {
    			mount_component(opencard, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const opencard_changes = {};
    			opencard.$set(opencard_changes);
    			const card_changes = {};
    			if (dirty & /*mixedListOfPokemon*/ 2) card_changes.pokemonNumber = /*pokemonNumber*/ ctx[11];
    			card.$set(card_changes);

    			if (!current || dirty & /*$catchEmAll, mixedListOfPokemon*/ 10 && div_class_value !== (div_class_value = "flip-container " + ((/*$catchEmAll*/ ctx[3] || []).some(func) && 'hover') + " svelte-1wzhztw")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opencard.$$.fragment, local);
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opencard.$$.fragment, local);
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*opencard_binding*/ ctx[8](null);
    			destroy_component(opencard, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(16:4) {#each mixedListOfPokemon as pokemonNumber}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isStart*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "pokemon-cards svelte-1wzhztw");
    			add_location(main, file$5, 13, 0, 551);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let pokemons;
    	let mixedListOfPokemon;
    	let $level;
    	let $isStart;
    	let $catchEmAll;
    	validate_store(catchEmAll, 'catchEmAll');
    	component_subscribe($$self, catchEmAll, $$value => $$invalidate(3, $catchEmAll = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Playground', slots, []);
    	let handler;
    	const { isStart, level } = userInfo;
    	validate_store(isStart, 'isStart');
    	component_subscribe($$self, isStart, value => $$invalidate(2, $isStart = value));
    	validate_store(level, 'level');
    	component_subscribe($$self, level, value => $$invalidate(7, $level = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Playground> was created with unknown prop '${key}'`);
    	});

    	function opencard_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			handler = $$value;
    			$$invalidate(0, handler);
    		});
    	}

    	const func = (pokemonNumber, catchedPokemon) => catchedPokemon === pokemonNumber;
    	const click_handler = cardEvent => handler.openCard(cardEvent);

    	$$self.$capture_state = () => ({
    		Card,
    		Pokemons,
    		UserGround,
    		userInfo,
    		OpenCard,
    		catchEmAll,
    		UserDetail,
    		handler,
    		isStart,
    		level,
    		pokemons,
    		mixedListOfPokemon,
    		$level,
    		$isStart,
    		$catchEmAll
    	});

    	$$self.$inject_state = $$props => {
    		if ('handler' in $$props) $$invalidate(0, handler = $$props.handler);
    		if ('pokemons' in $$props) $$invalidate(6, pokemons = $$props.pokemons);
    		if ('mixedListOfPokemon' in $$props) $$invalidate(1, mixedListOfPokemon = $$props.mixedListOfPokemon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$level*/ 128) {
    			$$invalidate(6, pokemons = new Pokemons($level));
    		}

    		if ($$self.$$.dirty & /*pokemons*/ 64) {
    			$$invalidate(1, mixedListOfPokemon = pokemons.shakeList(pokemons.list()));
    		}
    	};

    	return [
    		handler,
    		mixedListOfPokemon,
    		$isStart,
    		$catchEmAll,
    		isStart,
    		level,
    		pokemons,
    		$level,
    		opencard_binding,
    		func,
    		click_handler
    	];
    }

    class Playground extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playground",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* README.md generated by Svelte v3.46.4 */

    const file$4 = "README.md";

    function create_fragment$4(ctx) {
    	let span0;
    	let t0;
    	let h20;
    	let t2;
    	let p0;
    	let t3;
    	let a0;
    	let t5;
    	let t6;
    	let p1;
    	let img0;
    	let img0_src_value;
    	let t7;
    	let span1;
    	let t8;
    	let h21;
    	let t10;
    	let p2;
    	let t12;
    	let p3;
    	let img1;
    	let img1_src_value;
    	let t13;
    	let p4;
    	let t15;
    	let p5;
    	let t17;
    	let span2;
    	let t18;
    	let h22;
    	let t20;
    	let p6;
    	let t22;
    	let span3;
    	let t23;
    	let h23;
    	let t25;
    	let p7;
    	let t26;
    	let code0;
    	let t28;
    	let code1;
    	let t30;
    	let t31;
    	let p8;
    	let img2;
    	let img2_src_value;
    	let t32;
    	let p9;
    	let t34;
    	let span4;
    	let t35;
    	let h24;
    	let t37;
    	let p10;
    	let t39;
    	let pre0;
    	let code2;
    	let t41;
    	let p11;
    	let t43;
    	let pre1;
    	let code3;
    	let t45;
    	let span5;
    	let t46;
    	let h25;
    	let t48;
    	let ul0;
    	let li0;
    	let h40;
    	let t50;
    	let code4;
    	let t52;
    	let code5;
    	let t54;
    	let t55;
    	let li1;
    	let h41;
    	let t57;
    	let t58;
    	let span6;
    	let t59;
    	let h26;
    	let t61;
    	let span7;
    	let t62;
    	let h27;
    	let t64;
    	let h28;
    	let t66;
    	let ul3;
    	let li3;
    	let p12;
    	let t68;
    	let ul1;
    	let li2;
    	let a1;
    	let t70;
    	let li9;
    	let p13;
    	let t72;
    	let ul2;
    	let li4;
    	let a2;
    	let t74;
    	let li5;
    	let a3;
    	let t76;
    	let li6;
    	let a4;
    	let t78;
    	let li7;
    	let a5;
    	let t80;
    	let li8;
    	let a6;
    	let t82;
    	let ul5;
    	let li11;
    	let p14;
    	let t84;
    	let ul4;
    	let li10;
    	let a7;
    	let t86;
    	let ul7;
    	let li13;
    	let t87;
    	let ul6;
    	let li12;
    	let a8;
    	let t89;
    	let ul9;
    	let li15;
    	let p15;
    	let t91;
    	let ul8;
    	let li14;
    	let a9;
    	let t93;
    	let li16;
    	let p16;
    	let t95;
    	let ul10;
    	let li17;
    	let a10;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = space();
    			h20 = element("h2");
    			h20.textContent = "Hi :wave:";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte'in\nyapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu\ndökümanı oluşturdum. Döküman içerisinde adım adım 'Game' bağlantısında\ngörebileğiniz oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsanız aynı\nadımları takip ederek benzer veya farklı bir uygulama oluşturabilirsiniz.\nSvelte içeriği iyi ayrıntılanmış\n");
    			a0 = element("a");
    			a0.textContent = "dökümantasyona";
    			t5 = text(" sahip,\ndökümantasyonları inceledikten sonra uygulamayı takip etmeniz daha faydalı\nolabilir. İçeriğin özelliklerini sol tarafta bulunan haritalandırma ile takip\nedebilirsiniz.");
    			t6 = space();
    			p1 = element("p");
    			img0 = element("img");
    			t7 = space();
    			span1 = element("span");
    			t8 = space();
    			h21 = element("h2");
    			h21.textContent = "Proje Hakkında";
    			t10 = space();
    			p2 = element("p");
    			p2.textContent = "Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre\narayüz üzerinde kartlar bulunacak. Kartların üzerlerine click yapıldığında\nkartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar.\nEşleşen kartlar açık bir şekilde arayüz üzerinde dururken bu başarılı eşleşme\nkullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar bulundukları\nyerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, bir sonraki\nseviyede yer alan kartar arayüze kapalı olarak yeniden gelecektir.";
    			t12 = space();
    			p3 = element("p");
    			img1 = element("img");
    			t13 = space();
    			p4 = element("p");
    			p4.textContent = "Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde\nyer alan görsellerden birini seçmesi beklenecektir. Bu seçilen değerler oyunun\narayüzünde kartların yer aldığı bölümün altında score ile birlikte\ngösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak\nkalacaktır, score değeri dinamik olarak kullanıcı davranışına göre\ngüncellenecektir.";
    			t15 = space();
    			p5 = element("p");
    			p5.textContent = "image 1.2 ---> kullanıcı bilgileri ve score tutulduğu alan";
    			t17 = space();
    			span2 = element("span");
    			t18 = space();
    			h22 = element("h2");
    			h22.textContent = "Svelte nedir?";
    			t20 = space();
    			p6 = element("p");
    			p6.textContent = "Svelte günümüz modern library ve framework habitatının komplex yapılarını azaltarak\ndaha basit şekilde yüksek verimliliğe sahip uygulamalar geliştirilmesini sağlamayı\namaçlayan bir araçtır. Svelte Javascript dünyasında fikir olarak benzer\nframework/library önlerine geçiyor. Modern framework/library ile birlikte geride\nbıraktığımız her süreçte farklı ihtiyaçlar için yeni bir öğrenme süreci ortaya\nçıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin karşısına çıkması bir\nsüre sonrasında bir bezginlik halinin doğmasına sebep oluyor.\nSvelte'in bu döngünün dışına çıkarak modern framework bağımlılıklarını\nazalttı.";
    			t22 = space();
    			span3 = element("span");
    			t23 = space();
    			h23 = element("h2");
    			h23.textContent = "Svelte nasıl çalışır?";
    			t25 = space();
    			p7 = element("p");
    			t26 = text("Svelte bileşenleri ");
    			code0 = element("code");
    			code0.textContent = ".svelte";
    			t28 = text(" uzantılı dosyalar ile oluşturulur. HTML'de benzer\nolarak ");
    			code1 = element("code");
    			code1.textContent = "script, style, html";
    			t30 = text(" kod yapılarını oluşturabilirdiğiniz üç farklı bölüm\nbulunuyor. Uygulamanızı oluşturduğunuzda bu bileşenler derlenerek, pure\nJavascript kodlarına dönüştürülür.");
    			t31 = space();
    			p8 = element("p");
    			img2 = element("img");
    			t32 = space();
    			p9 = element("p");
    			p9.textContent = "Svelte'in derleme işlemini runtime üzerinde sağlayarak benzer framework/library\ndaha hızlı çalışıyor. Bu derleme işlemiyle birlikte Virtual DOM bağımlılığı\nortadan kalkıyor.";
    			t34 = space();
    			span4 = element("span");
    			t35 = space();
    			h24 = element("h2");
    			h24.textContent = "Svelte projesi oluşturma";
    			t37 = space();
    			p10 = element("p");
    			p10.textContent = "Npx ile yeni bir proje oluşturma:";
    			t39 = space();
    			pre0 = element("pre");
    			code2 = element("code");
    			code2.textContent = "npx degit sveltejs/template svelte-typescript-app\n";
    			t41 = space();
    			p11 = element("p");
    			p11.textContent = "Yazdığımız kodun tiplemesini TypeScript ile kontrol edeceğiz.";
    			t43 = space();
    			pre1 = element("pre");
    			code3 = element("code");
    			code3.textContent = "cd svelte-typescript-app\nnode scripts/setupTypeScript.js\n";
    			t45 = space();
    			span5 = element("span");
    			t46 = space();
    			h25 = element("h2");
    			h25.textContent = "Proje bağımlılıkları";
    			t48 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			h40 = element("h4");
    			h40.textContent = "Typescript";
    			t50 = text("\nTypescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı\nhataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Svelte\n");
    			code4 = element("code");
    			code4.textContent = ".svelte";
    			t52 = text(" uzantılı dosyaların yanısıra ");
    			code5 = element("code");
    			code5.textContent = ".ts";
    			t54 = text(" dosyaları da destekler.");
    			t55 = space();
    			li1 = element("li");
    			h41 = element("h4");
    			h41.textContent = "Rollup";
    			t57 = text("\nSvelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası\noluşturulacaktır. Rollup javascript uygulamalar için kullanılan bir modül\npaketleyicidir. Rollup uygulamamızda yer alan kodları tarayıcının\nanlayabileceği şekilde ayrıştırır.");
    			t58 = space();
    			span6 = element("span");
    			t59 = space();
    			h26 = element("h2");
    			h26.textContent = "Dizin ve Component Yapısı";
    			t61 = space();
    			span7 = element("span");
    			t62 = space();
    			h27 = element("h2");
    			h27.textContent = "GitHub Pages ile Deploy";
    			t64 = space();
    			h28 = element("h2");
    			h28.textContent = "Kaynak";
    			t66 = space();
    			ul3 = element("ul");
    			li3 = element("li");
    			p12 = element("p");
    			p12.textContent = "Svelte nedir?";
    			t68 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			a1 = element("a");
    			a1.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t70 = space();
    			li9 = element("li");
    			p13 = element("p");
    			p13.textContent = "Svelte Documentation:";
    			t72 = space();
    			ul2 = element("ul");
    			li4 = element("li");
    			a2 = element("a");
    			a2.textContent = "https://svelte.dev/examples/hello-world";
    			t74 = space();
    			li5 = element("li");
    			a3 = element("a");
    			a3.textContent = "https://svelte.dev/tutorial/basics";
    			t76 = space();
    			li6 = element("li");
    			a4 = element("a");
    			a4.textContent = "https://svelte.dev/docs";
    			t78 = space();
    			li7 = element("li");
    			a5 = element("a");
    			a5.textContent = "https://svelte.dev/blog";
    			t80 = space();
    			li8 = element("li");
    			a6 = element("a");
    			a6.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t82 = space();
    			ul5 = element("ul");
    			li11 = element("li");
    			p14 = element("p");
    			p14.textContent = "Svelte Projesi Oluşturma";
    			t84 = space();
    			ul4 = element("ul");
    			li10 = element("li");
    			a7 = element("a");
    			a7.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript";
    			t86 = space();
    			ul7 = element("ul");
    			li13 = element("li");
    			t87 = text("Bağımlılıklar");
    			ul6 = element("ul");
    			li12 = element("li");
    			a8 = element("a");
    			a8.textContent = "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/";
    			t89 = space();
    			ul9 = element("ul");
    			li15 = element("li");
    			p15 = element("p");
    			p15.textContent = "Deploy:";
    			t91 = space();
    			ul8 = element("ul");
    			li14 = element("li");
    			a9 = element("a");
    			a9.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next";
    			t93 = space();
    			li16 = element("li");
    			p16 = element("p");
    			p16.textContent = "md files importing";
    			t95 = space();
    			ul10 = element("ul");
    			li17 = element("li");
    			a10 = element("a");
    			a10.textContent = "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project";
    			attr_dev(span0, "id", "hi-to-you");
    			add_location(span0, file$4, 0, 0, 0);
    			add_location(h20, file$4, 1, 0, 29);
    			attr_dev(a0, "href", "https://svelte.dev/docs");
    			attr_dev(a0, "title", "Svelte Documentation");
    			add_location(a0, file$4, 8, 0, 457);
    			add_location(p0, file$4, 2, 0, 48);
    			if (!src_url_equal(img0.src, img0_src_value = "./assets/svelte-logo.PNG")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Svelte logo");
    			set_style(img0, "width", "400px");
    			add_location(img0, file$4, 12, 18, 736);
    			attr_dev(p1, "align", "center");
    			add_location(p1, file$4, 12, 0, 718);
    			attr_dev(span1, "id", "about-the-project");
    			add_location(span1, file$4, 13, 0, 816);
    			add_location(h21, file$4, 14, 0, 853);
    			add_location(p2, file$4, 15, 0, 877);
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/cards.PNG")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "view of cards on the playground");
    			attr_dev(img1, "style", "");
    			add_location(img1, file$4, 22, 18, 1422);
    			attr_dev(p3, "align", "center");
    			add_location(p3, file$4, 22, 0, 1404);
    			add_location(p4, file$4, 23, 0, 1505);
    			add_location(p5, file$4, 29, 0, 1892);
    			attr_dev(span2, "id", "#what-is-svelte");
    			add_location(span2, file$4, 30, 0, 1961);
    			add_location(h22, file$4, 31, 0, 1996);
    			add_location(p6, file$4, 32, 0, 2019);
    			attr_dev(span3, "id", "how-does-svelte-work");
    			add_location(span3, file$4, 41, 0, 2651);
    			add_location(h23, file$4, 42, 0, 2691);
    			add_location(code0, file$4, 43, 22, 2744);
    			add_location(code1, file$4, 44, 7, 2826);
    			add_location(p7, file$4, 43, 0, 2722);
    			if (!src_url_equal(img2.src, img2_src_value = "./assets/build-map.PNG")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Svelte Build map");
    			set_style(img2, "width", "800px");
    			add_location(img2, file$4, 47, 18, 3040);
    			attr_dev(p8, "align", "center");
    			add_location(p8, file$4, 47, 0, 3022);
    			add_location(p9, file$4, 48, 0, 3124);
    			attr_dev(span4, "id", "create-a-svelte-project");
    			add_location(span4, file$4, 51, 0, 3309);
    			add_location(h24, file$4, 52, 0, 3352);
    			add_location(p10, file$4, 53, 0, 3386);
    			add_location(code2, file$4, 54, 5, 3432);
    			add_location(pre0, file$4, 54, 0, 3427);
    			add_location(p11, file$4, 56, 0, 3502);
    			add_location(code3, file$4, 57, 5, 3576);
    			add_location(pre1, file$4, 57, 0, 3571);
    			attr_dev(span5, "id", "dependencies");
    			add_location(span5, file$4, 60, 0, 3653);
    			add_location(h25, file$4, 61, 0, 3685);
    			add_location(h40, file$4, 63, 4, 3724);
    			add_location(code4, file$4, 66, 0, 3887);
    			add_location(code5, file$4, 66, 50, 3937);
    			add_location(li0, file$4, 63, 0, 3720);
    			add_location(h41, file$4, 67, 4, 3987);
    			add_location(li1, file$4, 67, 0, 3983);
    			add_location(ul0, file$4, 62, 0, 3715);
    			attr_dev(span6, "id", "directory-and-component-structure");
    			add_location(span6, file$4, 73, 0, 4265);
    			add_location(h26, file$4, 74, 0, 4318);
    			attr_dev(span7, "id", "deploy-with-github-pages");
    			add_location(span7, file$4, 75, 0, 4353);
    			add_location(h27, file$4, 76, 0, 4397);
    			add_location(h28, file$4, 77, 0, 4430);
    			add_location(p12, file$4, 79, 4, 4455);
    			attr_dev(a1, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a1, file$4, 81, 4, 4485);
    			add_location(li2, file$4, 81, 0, 4481);
    			add_location(ul1, file$4, 80, 0, 4476);
    			add_location(li3, file$4, 79, 0, 4451);
    			add_location(p13, file$4, 84, 4, 4630);
    			attr_dev(a2, "href", "https://svelte.dev/examples/hello-world");
    			add_location(a2, file$4, 86, 4, 4668);
    			add_location(li4, file$4, 86, 0, 4664);
    			attr_dev(a3, "href", "https://svelte.dev/tutorial/basics");
    			add_location(a3, file$4, 87, 4, 4771);
    			add_location(li5, file$4, 87, 0, 4767);
    			attr_dev(a4, "href", "https://svelte.dev/docs");
    			add_location(a4, file$4, 88, 4, 4864);
    			add_location(li6, file$4, 88, 0, 4860);
    			attr_dev(a5, "href", "https://svelte.dev/blog");
    			add_location(a5, file$4, 89, 4, 4935);
    			add_location(li7, file$4, 89, 0, 4931);
    			attr_dev(a6, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a6, file$4, 90, 4, 5006);
    			add_location(li8, file$4, 90, 0, 5002);
    			add_location(ul2, file$4, 85, 0, 4659);
    			add_location(li9, file$4, 84, 0, 4626);
    			add_location(ul3, file$4, 78, 0, 4446);
    			add_location(p14, file$4, 95, 4, 5162);
    			attr_dev(a7, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript");
    			add_location(a7, file$4, 97, 4, 5203);
    			add_location(li10, file$4, 97, 0, 5199);
    			add_location(ul4, file$4, 96, 0, 5194);
    			add_location(li11, file$4, 95, 0, 5158);
    			add_location(ul5, file$4, 94, 0, 5153);
    			attr_dev(a8, "href", "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/");
    			add_location(a8, file$4, 103, 4, 5505);
    			add_location(li12, file$4, 103, 0, 5501);
    			add_location(ul6, file$4, 102, 17, 5496);
    			add_location(li13, file$4, 102, 0, 5479);
    			add_location(ul7, file$4, 101, 0, 5474);
    			add_location(p15, file$4, 108, 4, 5675);
    			attr_dev(a9, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next");
    			add_location(a9, file$4, 110, 4, 5699);
    			add_location(li14, file$4, 110, 0, 5695);
    			add_location(ul8, file$4, 109, 0, 5690);
    			add_location(li15, file$4, 108, 0, 5671);
    			add_location(p16, file$4, 113, 4, 5978);
    			add_location(li16, file$4, 113, 0, 5974);
    			add_location(ul9, file$4, 107, 0, 5666);
    			attr_dev(a10, "href", "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project");
    			add_location(a10, file$4, 117, 4, 6025);
    			add_location(li17, file$4, 117, 0, 6021);
    			add_location(ul10, file$4, 116, 0, 6016);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t3);
    			append_dev(p0, a0);
    			append_dev(p0, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img0);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, img1);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p5, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, p6, anchor);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, t26);
    			append_dev(p7, code0);
    			append_dev(p7, t28);
    			append_dev(p7, code1);
    			append_dev(p7, t30);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, p8, anchor);
    			append_dev(p8, img2);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, p9, anchor);
    			insert_dev(target, t34, anchor);
    			insert_dev(target, span4, anchor);
    			insert_dev(target, t35, anchor);
    			insert_dev(target, h24, anchor);
    			insert_dev(target, t37, anchor);
    			insert_dev(target, p10, anchor);
    			insert_dev(target, t39, anchor);
    			insert_dev(target, pre0, anchor);
    			append_dev(pre0, code2);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, p11, anchor);
    			insert_dev(target, t43, anchor);
    			insert_dev(target, pre1, anchor);
    			append_dev(pre1, code3);
    			insert_dev(target, t45, anchor);
    			insert_dev(target, span5, anchor);
    			insert_dev(target, t46, anchor);
    			insert_dev(target, h25, anchor);
    			insert_dev(target, t48, anchor);
    			insert_dev(target, ul0, anchor);
    			append_dev(ul0, li0);
    			append_dev(li0, h40);
    			append_dev(li0, t50);
    			append_dev(li0, code4);
    			append_dev(li0, t52);
    			append_dev(li0, code5);
    			append_dev(li0, t54);
    			append_dev(ul0, t55);
    			append_dev(ul0, li1);
    			append_dev(li1, h41);
    			append_dev(li1, t57);
    			insert_dev(target, t58, anchor);
    			insert_dev(target, span6, anchor);
    			insert_dev(target, t59, anchor);
    			insert_dev(target, h26, anchor);
    			insert_dev(target, t61, anchor);
    			insert_dev(target, span7, anchor);
    			insert_dev(target, t62, anchor);
    			insert_dev(target, h27, anchor);
    			insert_dev(target, t64, anchor);
    			insert_dev(target, h28, anchor);
    			insert_dev(target, t66, anchor);
    			insert_dev(target, ul3, anchor);
    			append_dev(ul3, li3);
    			append_dev(li3, p12);
    			append_dev(li3, t68);
    			append_dev(li3, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, a1);
    			append_dev(ul3, t70);
    			append_dev(ul3, li9);
    			append_dev(li9, p13);
    			append_dev(li9, t72);
    			append_dev(li9, ul2);
    			append_dev(ul2, li4);
    			append_dev(li4, a2);
    			append_dev(ul2, t74);
    			append_dev(ul2, li5);
    			append_dev(li5, a3);
    			append_dev(ul2, t76);
    			append_dev(ul2, li6);
    			append_dev(li6, a4);
    			append_dev(ul2, t78);
    			append_dev(ul2, li7);
    			append_dev(li7, a5);
    			append_dev(ul2, t80);
    			append_dev(ul2, li8);
    			append_dev(li8, a6);
    			insert_dev(target, t82, anchor);
    			insert_dev(target, ul5, anchor);
    			append_dev(ul5, li11);
    			append_dev(li11, p14);
    			append_dev(li11, t84);
    			append_dev(li11, ul4);
    			append_dev(ul4, li10);
    			append_dev(li10, a7);
    			insert_dev(target, t86, anchor);
    			insert_dev(target, ul7, anchor);
    			append_dev(ul7, li13);
    			append_dev(li13, t87);
    			append_dev(li13, ul6);
    			append_dev(ul6, li12);
    			append_dev(li12, a8);
    			insert_dev(target, t89, anchor);
    			insert_dev(target, ul9, anchor);
    			append_dev(ul9, li15);
    			append_dev(li15, p15);
    			append_dev(li15, t91);
    			append_dev(li15, ul8);
    			append_dev(ul8, li14);
    			append_dev(li14, a9);
    			append_dev(ul9, t93);
    			append_dev(ul9, li16);
    			append_dev(li16, p16);
    			insert_dev(target, t95, anchor);
    			insert_dev(target, ul10, anchor);
    			append_dev(ul10, li17);
    			append_dev(li17, a10);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t35);
    			if (detaching) detach_dev(h24);
    			if (detaching) detach_dev(t37);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t39);
    			if (detaching) detach_dev(pre0);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(p11);
    			if (detaching) detach_dev(t43);
    			if (detaching) detach_dev(pre1);
    			if (detaching) detach_dev(t45);
    			if (detaching) detach_dev(span5);
    			if (detaching) detach_dev(t46);
    			if (detaching) detach_dev(h25);
    			if (detaching) detach_dev(t48);
    			if (detaching) detach_dev(ul0);
    			if (detaching) detach_dev(t58);
    			if (detaching) detach_dev(span6);
    			if (detaching) detach_dev(t59);
    			if (detaching) detach_dev(h26);
    			if (detaching) detach_dev(t61);
    			if (detaching) detach_dev(span7);
    			if (detaching) detach_dev(t62);
    			if (detaching) detach_dev(h27);
    			if (detaching) detach_dev(t64);
    			if (detaching) detach_dev(h28);
    			if (detaching) detach_dev(t66);
    			if (detaching) detach_dev(ul3);
    			if (detaching) detach_dev(t82);
    			if (detaching) detach_dev(ul5);
    			if (detaching) detach_dev(t86);
    			if (detaching) detach_dev(ul7);
    			if (detaching) detach_dev(t89);
    			if (detaching) detach_dev(ul9);
    			if (detaching) detach_dev(t95);
    			if (detaching) detach_dev(ul10);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$1 = {};

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('README', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<README> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$1 });
    	return [];
    }

    class README extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "README",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Info\READMETR.md generated by Svelte v3.46.4 */

    const file$3 = "src\\components\\Info\\READMETR.md";

    function create_fragment$3(ctx) {
    	let span0;
    	let t0;
    	let h20;
    	let t2;
    	let p0;
    	let t3;
    	let a0;
    	let t5;
    	let t6;
    	let p1;
    	let img0;
    	let img0_src_value;
    	let t7;
    	let span1;
    	let t8;
    	let h21;
    	let t10;
    	let p2;
    	let t12;
    	let p3;
    	let img1;
    	let img1_src_value;
    	let t13;
    	let p4;
    	let t15;
    	let p5;
    	let t17;
    	let span2;
    	let t18;
    	let h22;
    	let t20;
    	let p6;
    	let t22;
    	let span3;
    	let t23;
    	let h23;
    	let t25;
    	let p7;
    	let t26;
    	let code0;
    	let t28;
    	let code1;
    	let t30;
    	let t31;
    	let p8;
    	let img2;
    	let img2_src_value;
    	let t32;
    	let p9;
    	let t34;
    	let span4;
    	let t35;
    	let h24;
    	let t37;
    	let p10;
    	let t39;
    	let pre0;
    	let code2;
    	let t41;
    	let p11;
    	let t43;
    	let pre1;
    	let code3;
    	let t45;
    	let span5;
    	let t46;
    	let h25;
    	let t48;
    	let ul0;
    	let li0;
    	let h40;
    	let t50;
    	let code4;
    	let t52;
    	let code5;
    	let t54;
    	let t55;
    	let li1;
    	let h41;
    	let t57;
    	let t58;
    	let span6;
    	let t59;
    	let h26;
    	let t61;
    	let span7;
    	let t62;
    	let h27;
    	let t64;
    	let h28;
    	let t66;
    	let ul3;
    	let li3;
    	let p12;
    	let t68;
    	let ul1;
    	let li2;
    	let a1;
    	let t70;
    	let li9;
    	let p13;
    	let t72;
    	let ul2;
    	let li4;
    	let a2;
    	let t74;
    	let li5;
    	let a3;
    	let t76;
    	let li6;
    	let a4;
    	let t78;
    	let li7;
    	let a5;
    	let t80;
    	let li8;
    	let a6;
    	let t82;
    	let ul5;
    	let li11;
    	let p14;
    	let t84;
    	let ul4;
    	let li10;
    	let a7;
    	let t86;
    	let ul7;
    	let li13;
    	let t87;
    	let ul6;
    	let li12;
    	let a8;
    	let t89;
    	let ul9;
    	let li15;
    	let p15;
    	let t91;
    	let ul8;
    	let li14;
    	let a9;
    	let t93;
    	let li16;
    	let p16;
    	let t95;
    	let ul10;
    	let li17;
    	let a10;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = space();
    			h20 = element("h2");
    			h20.textContent = "Selam :wave:";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte'in\nyapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu\ndökümanı oluşturdum. Döküman içerisinde adım adım 'Game' bağlantısında\ngörebileğiniz oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsanız aynı\nadımları takip ederek benzer veya farklı bir uygulama oluşturabilirsiniz.\nSvelte içeriği iyi ayrıntılanmış\n");
    			a0 = element("a");
    			a0.textContent = "dökümantasyona";
    			t5 = text(" sahip,\ndökümantasyonları inceledikten sonra uygulamayı takip etmeniz daha faydalı\nolabilir. İçeriğin özelliklerini sol tarafta bulunan haritalandırma ile takip\nedebilirsiniz.");
    			t6 = space();
    			p1 = element("p");
    			img0 = element("img");
    			t7 = space();
    			span1 = element("span");
    			t8 = space();
    			h21 = element("h2");
    			h21.textContent = "Proje Hakkında";
    			t10 = space();
    			p2 = element("p");
    			p2.textContent = "Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre\narayüz üzerinde kartlar bulunacak. Kartların üzerlerine click yapıldığında\nkartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar.\nEşleşen kartlar açık bir şekilde arayüz üzerinde dururken bu başarılı eşleşme\nkullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar bulundukları\nyerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, bir sonraki\nseviyede yer alan kartar arayüze kapalı olarak yeniden gelecektir.";
    			t12 = space();
    			p3 = element("p");
    			img1 = element("img");
    			t13 = space();
    			p4 = element("p");
    			p4.textContent = "Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde\nyer alan görsellerden birini seçmesi beklenecektir. Bu seçilen değerler oyunun\narayüzünde kartların yer aldığı bölümün altında score ile birlikte\ngösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak\nkalacaktır, score değeri dinamik olarak kullanıcı davranışına göre\ngüncellenecektir.";
    			t15 = space();
    			p5 = element("p");
    			p5.textContent = "image 1.2 ---> kullanıcı bilgileri ve score tutulduğu alan";
    			t17 = space();
    			span2 = element("span");
    			t18 = space();
    			h22 = element("h2");
    			h22.textContent = "Svelte nedir?";
    			t20 = space();
    			p6 = element("p");
    			p6.textContent = "Svelte günümüz modern library ve framework habitatının komplex yapılarını azaltarak\ndaha basit şekilde yüksek verimliliğe sahip uygulamalar geliştirilmesini sağlamayı\namaçlayan bir araçtır. Svelte Javascript dünyasında fikir olarak benzer\nframework/library önlerine geçiyor. Modern framework/library ile birlikte geride\nbıraktığımız her süreçte farklı ihtiyaçlar için yeni bir öğrenme süreci ortaya\nçıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin karşısına çıkması bir\nsüre sonrasında bir bezginlik halinin doğmasına sebep oluyor.\nSvelte'in bu döngünün dışına çıkarak modern framework bağımlılıklarını\nazalttı.";
    			t22 = space();
    			span3 = element("span");
    			t23 = space();
    			h23 = element("h2");
    			h23.textContent = "Svelte nasıl çalışır?";
    			t25 = space();
    			p7 = element("p");
    			t26 = text("Svelte bileşenleri ");
    			code0 = element("code");
    			code0.textContent = ".svelte";
    			t28 = text(" uzantılı dosyalar ile oluşturulur. HTML'de benzer\nolarak ");
    			code1 = element("code");
    			code1.textContent = "script, style, html";
    			t30 = text(" kod yapılarını oluşturabilirdiğiniz üç farklı bölüm\nbulunuyor. Uygulamanızı oluşturduğunuzda bu bileşenler derlenerek, pure\nJavascript kodlarına dönüştürülür.");
    			t31 = space();
    			p8 = element("p");
    			img2 = element("img");
    			t32 = space();
    			p9 = element("p");
    			p9.textContent = "Svelte'in derleme işlemini runtime üzerinde sağlayarak benzer framework/library\ndaha hızlı çalışıyor. Bu derleme işlemiyle birlikte Virtual DOM bağımlılığı\nortadan kalkıyor.";
    			t34 = space();
    			span4 = element("span");
    			t35 = space();
    			h24 = element("h2");
    			h24.textContent = "Svelte projesi oluşturma";
    			t37 = space();
    			p10 = element("p");
    			p10.textContent = "Npx ile yeni bir proje oluşturma:";
    			t39 = space();
    			pre0 = element("pre");
    			code2 = element("code");
    			code2.textContent = "npx degit sveltejs/template svelte-typescript-app\n";
    			t41 = space();
    			p11 = element("p");
    			p11.textContent = "Yazdığımız kodun tiplemesini TypeScript ile kontrol edeceğiz.";
    			t43 = space();
    			pre1 = element("pre");
    			code3 = element("code");
    			code3.textContent = "cd svelte-typescript-app\nnode scripts/setupTypeScript.js\n";
    			t45 = space();
    			span5 = element("span");
    			t46 = space();
    			h25 = element("h2");
    			h25.textContent = "Proje bağımlılıkları";
    			t48 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			h40 = element("h4");
    			h40.textContent = "Typescript";
    			t50 = text("\nTypescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı\nhataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Svelte\n");
    			code4 = element("code");
    			code4.textContent = ".svelte";
    			t52 = text(" uzantılı dosyaların yanısıra ");
    			code5 = element("code");
    			code5.textContent = ".ts";
    			t54 = text(" dosyaları da destekler.");
    			t55 = space();
    			li1 = element("li");
    			h41 = element("h4");
    			h41.textContent = "Rollup";
    			t57 = text("\nSvelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası\noluşturulacaktır. Rollup javascript uygulamalar için kullanılan bir modül\npaketleyicidir. Rollup uygulamamızda yer alan kodları tarayıcının\nanlayabileceği şekilde ayrıştırır.");
    			t58 = space();
    			span6 = element("span");
    			t59 = space();
    			h26 = element("h2");
    			h26.textContent = "Dizin ve Component Yapısı";
    			t61 = space();
    			span7 = element("span");
    			t62 = space();
    			h27 = element("h2");
    			h27.textContent = "GitHub Pages ile Deploy";
    			t64 = space();
    			h28 = element("h2");
    			h28.textContent = "Kaynak";
    			t66 = space();
    			ul3 = element("ul");
    			li3 = element("li");
    			p12 = element("p");
    			p12.textContent = "Svelte nedir?";
    			t68 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			a1 = element("a");
    			a1.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t70 = space();
    			li9 = element("li");
    			p13 = element("p");
    			p13.textContent = "Svelte Documentation:";
    			t72 = space();
    			ul2 = element("ul");
    			li4 = element("li");
    			a2 = element("a");
    			a2.textContent = "https://svelte.dev/examples/hello-world";
    			t74 = space();
    			li5 = element("li");
    			a3 = element("a");
    			a3.textContent = "https://svelte.dev/tutorial/basics";
    			t76 = space();
    			li6 = element("li");
    			a4 = element("a");
    			a4.textContent = "https://svelte.dev/docs";
    			t78 = space();
    			li7 = element("li");
    			a5 = element("a");
    			a5.textContent = "https://svelte.dev/blog";
    			t80 = space();
    			li8 = element("li");
    			a6 = element("a");
    			a6.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t82 = space();
    			ul5 = element("ul");
    			li11 = element("li");
    			p14 = element("p");
    			p14.textContent = "Svelte Projesi Oluşturma";
    			t84 = space();
    			ul4 = element("ul");
    			li10 = element("li");
    			a7 = element("a");
    			a7.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript";
    			t86 = space();
    			ul7 = element("ul");
    			li13 = element("li");
    			t87 = text("Bağımlılıklar");
    			ul6 = element("ul");
    			li12 = element("li");
    			a8 = element("a");
    			a8.textContent = "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/";
    			t89 = space();
    			ul9 = element("ul");
    			li15 = element("li");
    			p15 = element("p");
    			p15.textContent = "Deploy:";
    			t91 = space();
    			ul8 = element("ul");
    			li14 = element("li");
    			a9 = element("a");
    			a9.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next";
    			t93 = space();
    			li16 = element("li");
    			p16 = element("p");
    			p16.textContent = "md files importing";
    			t95 = space();
    			ul10 = element("ul");
    			li17 = element("li");
    			a10 = element("a");
    			a10.textContent = "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project";
    			attr_dev(span0, "id", "selam-sana");
    			add_location(span0, file$3, 0, 0, 0);
    			add_location(h20, file$3, 1, 0, 30);
    			attr_dev(a0, "href", "https://svelte.dev/docs");
    			attr_dev(a0, "title", "Svelte Documentation");
    			add_location(a0, file$3, 8, 0, 461);
    			add_location(p0, file$3, 2, 0, 52);
    			if (!src_url_equal(img0.src, img0_src_value = "./assets/svelte-logo.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Svelte logo");
    			set_style(img0, "width", "400px");
    			add_location(img0, file$3, 12, 18, 740);
    			attr_dev(p1, "align", "center");
    			add_location(p1, file$3, 12, 0, 722);
    			attr_dev(span1, "id", "proje-hakkinda");
    			add_location(span1, file$3, 13, 0, 820);
    			add_location(h21, file$3, 14, 0, 854);
    			add_location(p2, file$3, 15, 0, 878);
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/cards.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "view of cards on the playground");
    			attr_dev(img1, "style", "");
    			add_location(img1, file$3, 22, 18, 1423);
    			attr_dev(p3, "align", "center");
    			add_location(p3, file$3, 22, 0, 1405);
    			add_location(p4, file$3, 23, 0, 1506);
    			add_location(p5, file$3, 29, 0, 1893);
    			attr_dev(span2, "id", "svelte-nedir");
    			add_location(span2, file$3, 30, 0, 1962);
    			add_location(h22, file$3, 31, 0, 1994);
    			add_location(p6, file$3, 32, 0, 2017);
    			attr_dev(span3, "id", "svelte-nasil-calisir");
    			add_location(span3, file$3, 41, 0, 2649);
    			add_location(h23, file$3, 42, 0, 2689);
    			add_location(code0, file$3, 43, 22, 2742);
    			add_location(code1, file$3, 44, 7, 2824);
    			add_location(p7, file$3, 43, 0, 2720);
    			if (!src_url_equal(img2.src, img2_src_value = "./assets/build-map.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Svelte Build map");
    			set_style(img2, "width", "800px");
    			add_location(img2, file$3, 47, 18, 3038);
    			attr_dev(p8, "align", "center");
    			add_location(p8, file$3, 47, 0, 3020);
    			add_location(p9, file$3, 48, 0, 3122);
    			attr_dev(span4, "id", "svelte-projesi-olusturma");
    			add_location(span4, file$3, 51, 0, 3307);
    			add_location(h24, file$3, 52, 0, 3351);
    			add_location(p10, file$3, 53, 0, 3385);
    			add_location(code2, file$3, 54, 5, 3431);
    			add_location(pre0, file$3, 54, 0, 3426);
    			add_location(p11, file$3, 56, 0, 3501);
    			add_location(code3, file$3, 57, 5, 3575);
    			add_location(pre1, file$3, 57, 0, 3570);
    			attr_dev(span5, "id", "bagimliliklar");
    			add_location(span5, file$3, 60, 0, 3652);
    			add_location(h25, file$3, 61, 0, 3685);
    			add_location(h40, file$3, 63, 4, 3724);
    			add_location(code4, file$3, 66, 0, 3887);
    			add_location(code5, file$3, 66, 50, 3937);
    			add_location(li0, file$3, 63, 0, 3720);
    			add_location(h41, file$3, 67, 4, 3987);
    			add_location(li1, file$3, 67, 0, 3983);
    			add_location(ul0, file$3, 62, 0, 3715);
    			attr_dev(span6, "id", "dizin-ve-component-yapisi");
    			add_location(span6, file$3, 73, 0, 4265);
    			add_location(h26, file$3, 74, 0, 4310);
    			attr_dev(span7, "id", "github-page-ile-deploy");
    			add_location(span7, file$3, 75, 0, 4345);
    			add_location(h27, file$3, 76, 0, 4387);
    			add_location(h28, file$3, 77, 0, 4420);
    			add_location(p12, file$3, 79, 4, 4445);
    			attr_dev(a1, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a1, file$3, 81, 4, 4475);
    			add_location(li2, file$3, 81, 0, 4471);
    			add_location(ul1, file$3, 80, 0, 4466);
    			add_location(li3, file$3, 79, 0, 4441);
    			add_location(p13, file$3, 84, 4, 4620);
    			attr_dev(a2, "href", "https://svelte.dev/examples/hello-world");
    			add_location(a2, file$3, 86, 4, 4658);
    			add_location(li4, file$3, 86, 0, 4654);
    			attr_dev(a3, "href", "https://svelte.dev/tutorial/basics");
    			add_location(a3, file$3, 87, 4, 4761);
    			add_location(li5, file$3, 87, 0, 4757);
    			attr_dev(a4, "href", "https://svelte.dev/docs");
    			add_location(a4, file$3, 88, 4, 4854);
    			add_location(li6, file$3, 88, 0, 4850);
    			attr_dev(a5, "href", "https://svelte.dev/blog");
    			add_location(a5, file$3, 89, 4, 4925);
    			add_location(li7, file$3, 89, 0, 4921);
    			attr_dev(a6, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a6, file$3, 90, 4, 4996);
    			add_location(li8, file$3, 90, 0, 4992);
    			add_location(ul2, file$3, 85, 0, 4649);
    			add_location(li9, file$3, 84, 0, 4616);
    			add_location(ul3, file$3, 78, 0, 4436);
    			add_location(p14, file$3, 95, 4, 5152);
    			attr_dev(a7, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript");
    			add_location(a7, file$3, 97, 4, 5193);
    			add_location(li10, file$3, 97, 0, 5189);
    			add_location(ul4, file$3, 96, 0, 5184);
    			add_location(li11, file$3, 95, 0, 5148);
    			add_location(ul5, file$3, 94, 0, 5143);
    			attr_dev(a8, "href", "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/");
    			add_location(a8, file$3, 103, 4, 5495);
    			add_location(li12, file$3, 103, 0, 5491);
    			add_location(ul6, file$3, 102, 17, 5486);
    			add_location(li13, file$3, 102, 0, 5469);
    			add_location(ul7, file$3, 101, 0, 5464);
    			add_location(p15, file$3, 108, 4, 5665);
    			attr_dev(a9, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next");
    			add_location(a9, file$3, 110, 4, 5689);
    			add_location(li14, file$3, 110, 0, 5685);
    			add_location(ul8, file$3, 109, 0, 5680);
    			add_location(li15, file$3, 108, 0, 5661);
    			add_location(p16, file$3, 113, 4, 5968);
    			add_location(li16, file$3, 113, 0, 5964);
    			add_location(ul9, file$3, 107, 0, 5656);
    			attr_dev(a10, "href", "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project");
    			add_location(a10, file$3, 117, 4, 6015);
    			add_location(li17, file$3, 117, 0, 6011);
    			add_location(ul10, file$3, 116, 0, 6006);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t3);
    			append_dev(p0, a0);
    			append_dev(p0, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img0);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, img1);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p5, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, p6, anchor);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, t26);
    			append_dev(p7, code0);
    			append_dev(p7, t28);
    			append_dev(p7, code1);
    			append_dev(p7, t30);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, p8, anchor);
    			append_dev(p8, img2);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, p9, anchor);
    			insert_dev(target, t34, anchor);
    			insert_dev(target, span4, anchor);
    			insert_dev(target, t35, anchor);
    			insert_dev(target, h24, anchor);
    			insert_dev(target, t37, anchor);
    			insert_dev(target, p10, anchor);
    			insert_dev(target, t39, anchor);
    			insert_dev(target, pre0, anchor);
    			append_dev(pre0, code2);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, p11, anchor);
    			insert_dev(target, t43, anchor);
    			insert_dev(target, pre1, anchor);
    			append_dev(pre1, code3);
    			insert_dev(target, t45, anchor);
    			insert_dev(target, span5, anchor);
    			insert_dev(target, t46, anchor);
    			insert_dev(target, h25, anchor);
    			insert_dev(target, t48, anchor);
    			insert_dev(target, ul0, anchor);
    			append_dev(ul0, li0);
    			append_dev(li0, h40);
    			append_dev(li0, t50);
    			append_dev(li0, code4);
    			append_dev(li0, t52);
    			append_dev(li0, code5);
    			append_dev(li0, t54);
    			append_dev(ul0, t55);
    			append_dev(ul0, li1);
    			append_dev(li1, h41);
    			append_dev(li1, t57);
    			insert_dev(target, t58, anchor);
    			insert_dev(target, span6, anchor);
    			insert_dev(target, t59, anchor);
    			insert_dev(target, h26, anchor);
    			insert_dev(target, t61, anchor);
    			insert_dev(target, span7, anchor);
    			insert_dev(target, t62, anchor);
    			insert_dev(target, h27, anchor);
    			insert_dev(target, t64, anchor);
    			insert_dev(target, h28, anchor);
    			insert_dev(target, t66, anchor);
    			insert_dev(target, ul3, anchor);
    			append_dev(ul3, li3);
    			append_dev(li3, p12);
    			append_dev(li3, t68);
    			append_dev(li3, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, a1);
    			append_dev(ul3, t70);
    			append_dev(ul3, li9);
    			append_dev(li9, p13);
    			append_dev(li9, t72);
    			append_dev(li9, ul2);
    			append_dev(ul2, li4);
    			append_dev(li4, a2);
    			append_dev(ul2, t74);
    			append_dev(ul2, li5);
    			append_dev(li5, a3);
    			append_dev(ul2, t76);
    			append_dev(ul2, li6);
    			append_dev(li6, a4);
    			append_dev(ul2, t78);
    			append_dev(ul2, li7);
    			append_dev(li7, a5);
    			append_dev(ul2, t80);
    			append_dev(ul2, li8);
    			append_dev(li8, a6);
    			insert_dev(target, t82, anchor);
    			insert_dev(target, ul5, anchor);
    			append_dev(ul5, li11);
    			append_dev(li11, p14);
    			append_dev(li11, t84);
    			append_dev(li11, ul4);
    			append_dev(ul4, li10);
    			append_dev(li10, a7);
    			insert_dev(target, t86, anchor);
    			insert_dev(target, ul7, anchor);
    			append_dev(ul7, li13);
    			append_dev(li13, t87);
    			append_dev(li13, ul6);
    			append_dev(ul6, li12);
    			append_dev(li12, a8);
    			insert_dev(target, t89, anchor);
    			insert_dev(target, ul9, anchor);
    			append_dev(ul9, li15);
    			append_dev(li15, p15);
    			append_dev(li15, t91);
    			append_dev(li15, ul8);
    			append_dev(ul8, li14);
    			append_dev(li14, a9);
    			append_dev(ul9, t93);
    			append_dev(ul9, li16);
    			append_dev(li16, p16);
    			insert_dev(target, t95, anchor);
    			insert_dev(target, ul10, anchor);
    			append_dev(ul10, li17);
    			append_dev(li17, a10);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t35);
    			if (detaching) detach_dev(h24);
    			if (detaching) detach_dev(t37);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t39);
    			if (detaching) detach_dev(pre0);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(p11);
    			if (detaching) detach_dev(t43);
    			if (detaching) detach_dev(pre1);
    			if (detaching) detach_dev(t45);
    			if (detaching) detach_dev(span5);
    			if (detaching) detach_dev(t46);
    			if (detaching) detach_dev(h25);
    			if (detaching) detach_dev(t48);
    			if (detaching) detach_dev(ul0);
    			if (detaching) detach_dev(t58);
    			if (detaching) detach_dev(span6);
    			if (detaching) detach_dev(t59);
    			if (detaching) detach_dev(h26);
    			if (detaching) detach_dev(t61);
    			if (detaching) detach_dev(span7);
    			if (detaching) detach_dev(t62);
    			if (detaching) detach_dev(h27);
    			if (detaching) detach_dev(t64);
    			if (detaching) detach_dev(h28);
    			if (detaching) detach_dev(t66);
    			if (detaching) detach_dev(ul3);
    			if (detaching) detach_dev(t82);
    			if (detaching) detach_dev(ul5);
    			if (detaching) detach_dev(t86);
    			if (detaching) detach_dev(ul7);
    			if (detaching) detach_dev(t89);
    			if (detaching) detach_dev(ul9);
    			if (detaching) detach_dev(t95);
    			if (detaching) detach_dev(ul10);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META = {};

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('READMETR', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<READMETR> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META });
    	return [];
    }

    class READMETR extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "READMETR",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /**
     * language of the About Page
     *
     */
    const lang = writable('TR');

    var Title="Content";var Description="content headers of description files";var SupportedLanguages=["TR","ENG"];var Headers={Turkish:[{title:"selam",target:"#selam-sana"},{title:"proje hakkında",target:"#proje-hakkinda"},{title:"svelte nedir?",target:"#svelte-nedir"},{title:"svelte nasıl çalışır?",target:"#svelte-nasil-calisir"},{title:"Svelte projesi oluşturma",target:"#svelte-projesi-olusturma"},{title:"bağımlılıklar",target:"#bagimliliklar"},{title:"dizin ve component yapısı",target:"#dizin-ve-component-yapisi"},{title:"github page ile deploy",target:"#github-page-ile-deploy"}],English:[{title:"hi",target:"#hi-to-you"},{title:"about the project",target:"#about-the-project"},{title:"what is svelte?",target:"#what-is-svelte"},{title:"how does Svelte work?",target:"#how-does-svelte-work"},{title:"create a Svelte project",target:"#create-a-svelte-project"},{title:"dependencies",target:"#dependencies"},{title:"directory and component structure",target:"directory-and-component-structure"},{title:"deploy with github page",target:"deploy-with-github-pages"}]};var content = {Title:Title,Description:Description,SupportedLanguages:SupportedLanguages,Headers:Headers};

    var content$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Title: Title,
        Description: Description,
        SupportedLanguages: SupportedLanguages,
        Headers: Headers,
        'default': content
    });

    /* src\components\Info\about.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\components\\Info\\about.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (14:2) {:else}
    function create_else_block(ctx) {
    	let detailtr;
    	let current;
    	detailtr = new READMETR({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(detailtr.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(detailtr, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(detailtr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(detailtr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(detailtr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(14:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:2) {#if $lang === "EN"}
    function create_if_block$1(ctx) {
    	let detailen;
    	let current;
    	detailen = new README({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(detailen.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(detailen, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(detailen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(detailen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(detailen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(12:2) {#if $lang === \\\"EN\\\"}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#each $lang === "EN" ? English : Turkish as content}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let t_value = /*content*/ ctx[4].title + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*content*/ ctx[4].target);
    			attr_dev(a, "class", "svelte-1gtod6n");
    			add_location(a, file$2, 20, 8, 547);
    			attr_dev(li, "class", "svelte-1gtod6n");
    			add_location(li, file$2, 19, 6, 533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$lang*/ 2 && t_value !== (t_value = /*content*/ ctx[4].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*$lang*/ 2 && a_href_value !== (a_href_value = /*content*/ ctx[4].target)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(19:4) {#each $lang === \\\"EN\\\" ? English : Turkish as content}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let ul;
    	let t1;
    	let li;
    	let div;
    	let img0;
    	let img0_hidden_value;
    	let img0_src_value;
    	let t2;
    	let img1;
    	let img1_hidden_value;
    	let img1_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$lang*/ ctx[1] === "EN") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let each_value = /*$lang*/ ctx[1] === "EN"
    	? /*English*/ ctx[3]
    	: /*Turkish*/ ctx[2];

    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			t0 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			li = element("li");
    			div = element("div");
    			img0 = element("img");
    			t2 = space();
    			img1 = element("img");
    			img0.hidden = img0_hidden_value = /*$lang*/ ctx[1] === "TR";
    			if (!src_url_equal(img0.src, img0_src_value = "./assets/tr.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "TR Flag");
    			attr_dev(img0, "class", "flag svelte-1gtod6n");
    			add_location(img0, file$2, 25, 8, 670);
    			img1.hidden = img1_hidden_value = /*$lang*/ ctx[1] === "EN";
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/gb.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "EN Flag");
    			attr_dev(img1, "class", "flag svelte-1gtod6n");
    			add_location(img1, file$2, 32, 8, 851);
    			attr_dev(div, "class", "switch-lang svelte-1gtod6n");
    			add_location(div, file$2, 24, 6, 635);
    			attr_dev(li, "class", "svelte-1gtod6n");
    			add_location(li, file$2, 23, 4, 623);
    			attr_dev(ul, "class", "content-map svelte-1gtod6n");
    			add_location(ul, file$2, 17, 2, 442);
    			attr_dev(main, "class", "container svelte-1gtod6n");
    			add_location(main, file$2, 10, 0, 332);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			append_dev(main, t0);
    			append_dev(main, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t1);
    			append_dev(ul, li);
    			append_dev(li, div);
    			append_dev(div, img0);
    			append_dev(div, t2);
    			append_dev(div, img1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(img0, "click", /*switchLanguages*/ ctx[0], false, false, false),
    					listen_dev(img1, "click", /*switchLanguages*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, t0);
    			}

    			if (dirty & /*$lang, English, Turkish*/ 14) {
    				each_value = /*$lang*/ ctx[1] === "EN"
    				? /*English*/ ctx[3]
    				: /*Turkish*/ ctx[2];

    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*$lang*/ 2 && img0_hidden_value !== (img0_hidden_value = /*$lang*/ ctx[1] === "TR")) {
    				prop_dev(img0, "hidden", img0_hidden_value);
    			}

    			if (!current || dirty & /*$lang*/ 2 && img1_hidden_value !== (img1_hidden_value = /*$lang*/ ctx[1] === "EN")) {
    				prop_dev(img1, "hidden", img1_hidden_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $lang;
    	validate_store(lang, 'lang');
    	component_subscribe($$self, lang, $$value => $$invalidate(1, $lang = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);

    	const switchLanguages = () => {
    		set_store_value(lang, $lang = $lang === "EN" ? "TR" : "EN", $lang);
    	};

    	let { Turkish, English } = Headers;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		DetailEN: README,
    		DetailTR: READMETR,
    		lang,
    		content: content$1,
    		switchLanguages,
    		Turkish,
    		English,
    		$lang
    	});

    	$$self.$inject_state = $$props => {
    		if ('Turkish' in $$props) $$invalidate(2, Turkish = $$props.Turkish);
    		if ('English' in $$props) $$invalidate(3, English = $$props.English);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [switchLanguages, $lang, Turkish, English];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { switchLanguages: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get switchLanguages() {
    		return this.$$.ctx[0];
    	}

    	set switchLanguages(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\shared\Pages.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\components\\shared\\Pages.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (11:4) {#each pages as page}
    function create_each_block(ctx) {
    	let li;
    	let div;
    	let t0_value = /*page*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*page*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			toggle_class(div, "active", /*page*/ ctx[4] === /*activePage*/ ctx[1]);
    			add_location(div, file$1, 12, 8, 281);
    			attr_dev(li, "class", "svelte-135x94x");
    			add_location(li, file$1, 11, 6, 221);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*pages*/ 1 && t0_value !== (t0_value = /*page*/ ctx[4] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*pages, activePage*/ 3) {
    				toggle_class(div, "active", /*page*/ ctx[4] === /*activePage*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:4) {#each pages as page}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let ul;
    	let each_value = /*pages*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-135x94x");
    			add_location(ul, file$1, 9, 2, 182);
    			attr_dev(div, "class", "contents svelte-135x94x");
    			add_location(div, file$1, 8, 0, 156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatch, pages, activePage*/ 7) {
    				each_value = /*pages*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pages', slots, []);
    	const dispatch = createEventDispatcher();
    	let { pages, activePage } = $$props;
    	const writable_props = ['pages', 'activePage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pages> was created with unknown prop '${key}'`);
    	});

    	const click_handler = page => dispatch("switchPage", page);

    	$$self.$$set = $$props => {
    		if ('pages' in $$props) $$invalidate(0, pages = $$props.pages);
    		if ('activePage' in $$props) $$invalidate(1, activePage = $$props.activePage);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		pages,
    		activePage
    	});

    	$$self.$inject_state = $$props => {
    		if ('pages' in $$props) $$invalidate(0, pages = $$props.pages);
    		if ('activePage' in $$props) $$invalidate(1, activePage = $$props.activePage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pages, activePage, dispatch, click_handler];
    }

    class Pages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { pages: 0, activePage: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pages",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pages*/ ctx[0] === undefined && !('pages' in props)) {
    			console.warn("<Pages> was created without expected prop 'pages'");
    		}

    		if (/*activePage*/ ctx[1] === undefined && !('activePage' in props)) {
    			console.warn("<Pages> was created without expected prop 'activePage'");
    		}
    	}

    	get pages() {
    		throw new Error("<Pages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pages(value) {
    		throw new Error("<Pages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activePage() {
    		throw new Error("<Pages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activePage(value) {
    		throw new Error("<Pages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (16:34) 
    function create_if_block_1(ctx) {
    	let playground;
    	let current;
    	playground = new Playground({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(playground.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(playground, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playground.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playground.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(playground, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(16:34) ",
    		ctx
    	});

    	return block;
    }

    // (14:2) {#if activePage === "about"}
    function create_if_block(ctx) {
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(14:2) {#if activePage === \\\"about\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let pages_1;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	pages_1 = new Pages({
    			props: {
    				pages: /*pages*/ ctx[1],
    				activePage: /*activePage*/ ctx[0]
    			},
    			$$inline: true
    		});

    	pages_1.$on("switchPage", /*switchPage*/ ctx[2]);
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activePage*/ ctx[0] === "about") return 0;
    		if (/*activePage*/ ctx[0] === "game") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(pages_1.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			add_location(main, file, 10, 0, 344);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(pages_1, main, null);
    			append_dev(main, t);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const pages_1_changes = {};
    			if (dirty & /*activePage*/ 1) pages_1_changes.activePage = /*activePage*/ ctx[0];
    			pages_1.$set(pages_1_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pages_1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pages_1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(pages_1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let pages = ["about", "game"];
    	let activePage = "about";

    	const switchPage = event => {
    		$$invalidate(0, activePage = event.detail);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Playground,
    		About,
    		Pages,
    		pages,
    		activePage,
    		switchPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('pages' in $$props) $$invalidate(1, pages = $$props.pages);
    		if ('activePage' in $$props) $$invalidate(0, activePage = $$props.activePage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activePage, pages, switchPage];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
