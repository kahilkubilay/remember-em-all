
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
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
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
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
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

    /* src\components\Playground\Cards\CardBack.svelte generated by Svelte v3.48.0 */
    const file$j = "src\\components\\Playground\\Cards\\CardBack.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "single-poke svelte-jfwwdt");
    			attr_dev(img, "alt", "tester");
    			add_location(img, file$j, 9, 2, 215);
    			attr_dev(div, "class", "back svelte-jfwwdt");
    			add_location(div, file$j, 8, 0, 146);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
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
    	const dispatch = createEventDispatcher();
    	let { pokemon } = $$props;
    	const writable_props = ['pokemon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardBack> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("openCard", pokemon);

    	$$self.$$set = $$props => {
    		if ('pokemon' in $$props) $$invalidate(0, pokemon = $$props.pokemon);
    	};

    	$$self.$capture_state = () => ({ createEventDispatcher, dispatch, pokemon });

    	$$self.$inject_state = $$props => {
    		if ('pokemon' in $$props) $$invalidate(0, pokemon = $$props.pokemon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pokemon, dispatch, click_handler];
    }

    class CardBack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { pokemon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardBack",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pokemon*/ ctx[0] === undefined && !('pokemon' in props)) {
    			console.warn("<CardBack> was created without expected prop 'pokemon'");
    		}
    	}

    	get pokemon() {
    		throw new Error("<CardBack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokemon(value) {
    		throw new Error("<CardBack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Playground\Cards\CardFront.svelte generated by Svelte v3.48.0 */

    const file$i = "src\\components\\Playground\\Cards\\CardFront.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + /*pokemonId*/ ctx[0] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "card on the playing field");
    			attr_dev(img, "class", "single-poke svelte-1k72kgg");
    			attr_dev(img, "pokemondetail", /*pokemonId*/ ctx[0]);
    			add_location(img, file$i, 7, 2, 101);
    			attr_dev(div, "class", "front svelte-1k72kgg");
    			add_location(div, file$i, 6, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pokemonId*/ 1 && !src_url_equal(img.src, img_src_value = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + /*pokemonId*/ ctx[0] + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*pokemonId*/ 1) {
    				attr_dev(img, "pokemondetail", /*pokemonId*/ ctx[0]);
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
    	let pokemonId;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardFront', slots, []);
    	let { pokemon } = $$props;
    	const writable_props = ['pokemon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardFront> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pokemon' in $$props) $$invalidate(1, pokemon = $$props.pokemon);
    	};

    	$$self.$capture_state = () => ({ pokemon, pokemonId });

    	$$self.$inject_state = $$props => {
    		if ('pokemon' in $$props) $$invalidate(1, pokemon = $$props.pokemon);
    		if ('pokemonId' in $$props) $$invalidate(0, pokemonId = $$props.pokemonId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*pokemon*/ 2) {
    			$$invalidate(0, pokemonId = pokemon.id);
    		}
    	};

    	return [pokemonId, pokemon];
    }

    class CardFront extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { pokemon: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardFront",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pokemon*/ ctx[1] === undefined && !('pokemon' in props)) {
    			console.warn("<CardFront> was created without expected prop 'pokemon'");
    		}
    	}

    	get pokemon() {
    		throw new Error("<CardFront>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokemon(value) {
    		throw new Error("<CardFront>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    const catchEmAll = writable([]);
    const openCardsCapsule = writable([]);
    const cardFlipperCapsule = writable([]);

    const score = writable(0);

    /* src\components\GameAction\ScoreUpdate.svelte generated by Svelte v3.48.0 */

    const scoreUp = () => {
    	let getScore;

    	score.subscribe(callScore => {
    		getScore = callScore;
    	});

    	let up = getScore + 1;
    	score.set(up);
    };

    const level = writable(1);

    /* src\components\GameAction\LevelUpdate.svelte generated by Svelte v3.48.0 */

    const levelUp = () => {
    	let getLevel;

    	level.subscribe(callLevel => {
    		getLevel = callLevel;
    	});

    	let up = getLevel + 1;
    	setTimeout(level.set(up));
    };

    /* src\components\GameAction\CloseOpenCards.svelte generated by Svelte v3.48.0 */

    const mismatchedCards = flipTime => {
    	setTimeout(
    		() => {
    			cardFlipperCapsule.set([]);
    			openCardsCapsule.set([]);
    		},
    		flipTime
    	);
    };

    const closeAllCards = (flipTime, callback) => {
    	setTimeout(
    		() => {
    			catchEmAll.set([]);
    			cardFlipperCapsule.set([]);
    			openCardsCapsule.set([]);
    			callback();
    		},
    		flipTime
    	);
    };

    /* src\components\Playground\Cards\Card.svelte generated by Svelte v3.48.0 */

    const file$h = "src\\components\\Playground\\Cards\\Card.svelte";

    function create_fragment$h(ctx) {
    	let main;
    	let div;
    	let backcardface;
    	let t;
    	let frontcardface;
    	let current;

    	backcardface = new CardBack({
    			props: { pokemon: /*pokemon*/ ctx[0] },
    			$$inline: true
    		});

    	backcardface.$on("openCard", /*openCard*/ ctx[5]);

    	frontcardface = new CardFront({
    			props: { pokemon: /*pokemon*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(backcardface.$$.fragment);
    			t = space();
    			create_component(frontcardface.$$.fragment);
    			attr_dev(div, "class", "flipper svelte-1xolnxl");
    			toggle_class(div, "hover", /*$cardFlipperCapsule*/ ctx[4].includes(/*pokemonNo*/ ctx[1]) || /*$catchEmAll*/ ctx[3].includes(/*pokemonId*/ ctx[2]));
    			add_location(div, file$h, 47, 2, 1266);
    			attr_dev(main, "class", "flip-container svelte-1xolnxl");
    			add_location(main, file$h, 46, 0, 1233);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(backcardface, div, null);
    			append_dev(div, t);
    			mount_component(frontcardface, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const backcardface_changes = {};
    			if (dirty & /*pokemon*/ 1) backcardface_changes.pokemon = /*pokemon*/ ctx[0];
    			backcardface.$set(backcardface_changes);
    			const frontcardface_changes = {};
    			if (dirty & /*pokemon*/ 1) frontcardface_changes.pokemon = /*pokemon*/ ctx[0];
    			frontcardface.$set(frontcardface_changes);

    			if (dirty & /*$cardFlipperCapsule, pokemonNo, $catchEmAll, pokemonId*/ 30) {
    				toggle_class(div, "hover", /*$cardFlipperCapsule*/ ctx[4].includes(/*pokemonNo*/ ctx[1]) || /*$catchEmAll*/ ctx[3].includes(/*pokemonId*/ ctx[2]));
    			}
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
    			if (detaching) detach_dev(main);
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
    	let pokemonId;
    	let pokemonNo;
    	let $catchEmAll;
    	let $openCardsCapsule;
    	let $cardFlipperCapsule;
    	validate_store(catchEmAll, 'catchEmAll');
    	component_subscribe($$self, catchEmAll, $$value => $$invalidate(3, $catchEmAll = $$value));
    	validate_store(openCardsCapsule, 'openCardsCapsule');
    	component_subscribe($$self, openCardsCapsule, $$value => $$invalidate(6, $openCardsCapsule = $$value));
    	validate_store(cardFlipperCapsule, 'cardFlipperCapsule');
    	component_subscribe($$self, cardFlipperCapsule, $$value => $$invalidate(4, $cardFlipperCapsule = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { pokemon } = $$props;

    	const openCard = card => {
    		let getPokemonNo = card.detail.no;
    		let getPokemonId = card.detail.id;
    		set_store_value(openCardsCapsule, $openCardsCapsule = [getPokemonId, ...$openCardsCapsule], $openCardsCapsule);
    		set_store_value(cardFlipperCapsule, $cardFlipperCapsule = [getPokemonNo, ...$cardFlipperCapsule], $cardFlipperCapsule);

    		if ($openCardsCapsule.length >= 2) {
    			const firstOpenCard = $openCardsCapsule[0];
    			const secondOpenCard = $openCardsCapsule[1];

    			if (firstOpenCard === secondOpenCard) {
    				set_store_value(catchEmAll, $catchEmAll = [firstOpenCard, ...$catchEmAll], $catchEmAll);
    				scoreUp();

    				if ($catchEmAll.length === 5) {
    					closeAllCards(1000, levelUp);
    				}
    			}

    			mismatchedCards(500);
    		}
    	};

    	const writable_props = ['pokemon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pokemon' in $$props) $$invalidate(0, pokemon = $$props.pokemon);
    	};

    	$$self.$capture_state = () => ({
    		BackCardFace: CardBack,
    		FrontCardFace: CardFront,
    		openCardsCapsule,
    		cardFlipperCapsule,
    		catchEmAll,
    		scoreUp,
    		levelUp,
    		closeAllCards,
    		mismatchedCards,
    		pokemon,
    		openCard,
    		pokemonNo,
    		pokemonId,
    		$catchEmAll,
    		$openCardsCapsule,
    		$cardFlipperCapsule
    	});

    	$$self.$inject_state = $$props => {
    		if ('pokemon' in $$props) $$invalidate(0, pokemon = $$props.pokemon);
    		if ('pokemonNo' in $$props) $$invalidate(1, pokemonNo = $$props.pokemonNo);
    		if ('pokemonId' in $$props) $$invalidate(2, pokemonId = $$props.pokemonId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*pokemon*/ 1) {
    			$$invalidate(2, pokemonId = pokemon.id);
    		}

    		if ($$self.$$.dirty & /*pokemon*/ 1) {
    			$$invalidate(1, pokemonNo = pokemon.no);
    		}
    	};

    	return [pokemon, pokemonNo, pokemonId, $catchEmAll, $cardFlipperCapsule, openCard];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { pokemon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pokemon*/ ctx[0] === undefined && !('pokemon' in props)) {
    			console.warn("<Card> was created without expected prop 'pokemon'");
    		}
    	}

    	get pokemon() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pokemon(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class UserInfo {
        constructor(name = writable(''), avatar = writable(''), score = writable(0), isStart = writable(false)) {
            this.name = name;
            this.avatar = avatar;
            this.score = score;
            this.isStart = isStart;
        }
    }
    const userInfo = new UserInfo();

    /* src\components\User\name\UserName.svelte generated by Svelte v3.48.0 */
    const file$g = "src\\components\\User\\name\\UserName.svelte";

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
    			add_location(input, file$g, 7, 2, 128);
    			attr_dev(div, "class", "user");
    			add_location(div, file$g, 6, 0, 106);
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

    /* src\components\User\Header.svelte generated by Svelte v3.48.0 */

    const file$f = "src\\components\\User\\Header.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "select your best pokemon and start catching!";
    			add_location(h2, file$f, 1, 2, 24);
    			attr_dev(div, "class", "header svelte-1tuqxk");
    			add_location(div, file$f, 0, 0, 0);
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

    /* src\components\User\Avatar\ImageAvatar.svelte generated by Svelte v3.48.0 */
    const file$e = "src\\components\\User\\Avatar\\ImageAvatar.svelte";

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
    			attr_dev(img, "class", "avatar unpicked svelte-33qba");
    			toggle_class(img, "picked", /*avatarName*/ ctx[3] === /*$avatar*/ ctx[1]);
    			add_location(img, file$e, 10, 0, 209);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*userSelectAvatar*/ 1 && !src_url_equal(img.src, img_src_value = /*userSelectAvatar*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*avatarName, $avatar*/ 10) {
    				toggle_class(img, "picked", /*avatarName*/ ctx[3] === /*$avatar*/ ctx[1]);
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
    	component_subscribe($$self, avatar, value => $$invalidate(1, $avatar = value));
    	let { userSelectAvatar } = $$props;
    	const avatarName = userSelectAvatar.match(/\w*(?=.\w+$)/)[0];
    	const writable_props = ['userSelectAvatar'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ImageAvatar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(avatar, $avatar = avatarName, $avatar);

    	$$self.$$set = $$props => {
    		if ('userSelectAvatar' in $$props) $$invalidate(0, userSelectAvatar = $$props.userSelectAvatar);
    	};

    	$$self.$capture_state = () => ({
    		userInfo,
    		avatar,
    		userSelectAvatar,
    		avatarName,
    		$avatar
    	});

    	$$self.$inject_state = $$props => {
    		if ('userSelectAvatar' in $$props) $$invalidate(0, userSelectAvatar = $$props.userSelectAvatar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [userSelectAvatar, $avatar, avatar, avatarName, click_handler];
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

    /* src\components\User\Avatar\Avatars.svelte generated by Svelte v3.48.0 */
    const file$d = "src\\components\\User\\Avatar\\Avatars.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (15:2) {#each avatars as userSelectAvatar}
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
    		source: "(15:2) {#each avatars as userSelectAvatar}",
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
    			add_location(div, file$d, 13, 0, 332);
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
    		ImageAvatar,
    		sabuha,
    		mohito,
    		pasa,
    		susi,
    		limon,
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

    /* src\components\User\Start.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$c = "src\\components\\User\\Start.svelte";

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
    			span1.textContent = "please, enter a name..";
    			attr_dev(button, "class", "svelte-j6c731");
    			add_location(button, file$c, 26, 2, 502);
    			attr_dev(span0, "class", "unvisible svelte-j6c731");
    			toggle_class(span0, "visible", /*$avatar*/ ctx[3] === "" && /*isAvatarEmpty*/ ctx[0]);
    			add_location(span0, file$c, 28, 4, 588);
    			attr_dev(div0, "class", "avatarError visible svelte-j6c731");
    			add_location(div0, file$c, 27, 2, 549);
    			attr_dev(span1, "class", "unvisible svelte-j6c731");
    			toggle_class(span1, "visible", /*$name*/ ctx[2] === "" && /*isNameEmpty*/ ctx[1]);
    			add_location(span1, file$c, 33, 4, 757);
    			attr_dev(div1, "class", "nameError visible svelte-j6c731");
    			add_location(div1, file$c, 32, 2, 720);
    			attr_dev(div2, "class", "start svelte-j6c731");
    			add_location(div2, file$c, 25, 0, 479);
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
    				dispose = listen_dev(button, "click", /*startGame*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$avatar, isAvatarEmpty*/ 9) {
    				toggle_class(span0, "visible", /*$avatar*/ ctx[3] === "" && /*isAvatarEmpty*/ ctx[0]);
    			}

    			if (dirty & /*$name, isNameEmpty*/ 6) {
    				toggle_class(span1, "visible", /*$name*/ ctx[2] === "" && /*isNameEmpty*/ ctx[1]);
    			}
    		},
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
    	let $name;
    	let $isStart;
    	let $avatar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Start', slots, []);
    	const { name, avatar, isStart } = userInfo;
    	validate_store(name, 'name');
    	component_subscribe($$self, name, value => $$invalidate(2, $name = value));
    	validate_store(avatar, 'avatar');
    	component_subscribe($$self, avatar, value => $$invalidate(3, $avatar = value));
    	validate_store(isStart, 'isStart');
    	component_subscribe($$self, isStart, value => $$invalidate(8, $isStart = value));
    	let isAvatarEmpty = false;
    	let isNameEmpty = false;

    	const startGame = () => {
    		if ($avatar === "") {
    			$$invalidate(0, isAvatarEmpty = true);
    			return;
    		}

    		if ($name === "") {
    			$$invalidate(1, isNameEmpty = true);
    			return;
    		}

    		set_store_value(isStart, $isStart = true, $isStart);
    		console.log(":::: start game ::::");
    		console.log(`:: enjoy ${$name} ::`);
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
    		isAvatarEmpty,
    		isNameEmpty,
    		startGame,
    		$name,
    		$isStart,
    		$avatar
    	});

    	$$self.$inject_state = $$props => {
    		if ('isAvatarEmpty' in $$props) $$invalidate(0, isAvatarEmpty = $$props.isAvatarEmpty);
    		if ('isNameEmpty' in $$props) $$invalidate(1, isNameEmpty = $$props.isNameEmpty);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isAvatarEmpty, isNameEmpty, $name, $avatar, name, avatar, isStart, startGame];
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

    /* src\components\User\UserGround.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\components\\User\\UserGround.svelte";

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
    			add_location(main, file$b, 6, 0, 203);
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

    /* src\components\GameElements\Score.svelte generated by Svelte v3.48.0 */
    const file$a = "src\\components\\GameElements\\Score.svelte";

    function create_fragment$a(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("score: ");
    			t1 = text(/*$score*/ ctx[0]);
    			attr_dev(p, "class", "svelte-15spofw");
    			add_location(p, file$a, 3, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$score*/ 1) set_data_dev(t1, /*$score*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Score",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\GameElements\Level.svelte generated by Svelte v3.48.0 */
    const file$9 = "src\\components\\GameElements\\Level.svelte";

    function create_fragment$9(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("level: ");
    			t1 = text(/*$level*/ ctx[0]);
    			attr_dev(p, "class", "svelte-15spofw");
    			add_location(p, file$9, 3, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$level*/ 1) set_data_dev(t1, /*$level*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
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
    	let $level;
    	validate_store(level, 'level');
    	component_subscribe($$self, level, $$value => $$invalidate(0, $level = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Level', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Level> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ level, $level });
    	return [$level];
    }

    class Level extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\User\name\UserSelectName.svelte generated by Svelte v3.48.0 */
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

    /* src\components\User\Avatar\UserSelectAvatar.svelte generated by Svelte v3.48.0 */
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
    			attr_dev(circle, "stroke", "#6a0dad");
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

    /* src\components\User\UserDetail.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\components\\User\\UserDetail.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let userselectavatar;
    	let t0;
    	let name;
    	let t1;
    	let score;
    	let t2;
    	let level;
    	let current;
    	userselectavatar = new UserSelectAvatar({ $$inline: true });
    	name = new UserSelectName({ $$inline: true });
    	score = new Score({ $$inline: true });
    	level = new Level({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(userselectavatar.$$.fragment);
    			t0 = space();
    			create_component(name.$$.fragment);
    			t1 = space();
    			create_component(score.$$.fragment);
    			t2 = space();
    			create_component(level.$$.fragment);
    			attr_dev(main, "class", "svelte-1jkt6zl");
    			add_location(main, file$6, 6, 0, 249);
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
    			append_dev(main, t2);
    			mount_component(level, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userselectavatar.$$.fragment, local);
    			transition_in(name.$$.fragment, local);
    			transition_in(score.$$.fragment, local);
    			transition_in(level.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userselectavatar.$$.fragment, local);
    			transition_out(name.$$.fragment, local);
    			transition_out(score.$$.fragment, local);
    			transition_out(level.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(userselectavatar);
    			destroy_component(name);
    			destroy_component(score);
    			destroy_component(level);
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

    	$$self.$capture_state = () => ({ Score, Level, Name: UserSelectName, UserSelectAvatar });
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

    /* src\components\GameAction\MixCards.svelte generated by Svelte v3.48.0 */

    const shuffle = pokemonList => {
    	let shakeList = [];
    	const duplicateList = pokemonList.concat(pokemonList);
    	const levelLength = duplicateList.length - 1;
    	let pokemonNo;

    	for (let counter = 0; counter < levelLength + 1; counter++) {
    		pokemonNo = counter;
    		const randomNumberForList = Math.trunc(Math.random() * duplicateList.length);

    		shakeList = [
    			{
    				no: pokemonNo,
    				id: duplicateList[randomNumberForList]
    			},
    			...shakeList
    		];

    		duplicateList.splice(duplicateList.indexOf(duplicateList[randomNumberForList]), 1);
    	}

    	return shakeList;
    };

    /* src\components\GameAction\ListCards.svelte generated by Svelte v3.48.0 */

    const list = level => {
    	let getLevel = level;
    	const list = [];
    	const range = 5;
    	const levelRange = getLevel * range;
    	let levelCounter = levelRange - 5 + 1;

    	for (levelCounter; levelCounter <= levelRange; levelCounter++) {
    		list.push(levelCounter);
    	}

    	return list;
    };

    /* src\components\Playground\Wrapper\Playground.svelte generated by Svelte v3.48.0 */
    const file$5 = "src\\components\\Playground\\Wrapper\\Playground.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (22:2) {:else}
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
    		source: "(22:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if $isStart}
    function create_if_block$2(ctx) {
    	let t;
    	let userdetail;
    	let current;
    	let each_value = /*mixedListOfPokemon*/ ctx[0];
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
    			if (dirty & /*mixedListOfPokemon*/ 1) {
    				each_value = /*mixedListOfPokemon*/ ctx[0];
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
    		source: "(16:2) {#if $isStart}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#each mixedListOfPokemon as pokemon}
    function create_each_block$2(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: { pokemon: /*pokemon*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*mixedListOfPokemon*/ 1) card_changes.pokemon = /*pokemon*/ ctx[5];
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(17:4) {#each mixedListOfPokemon as pokemon}",
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
    		if (/*$isStart*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "playground svelte-u98seh");
    			add_location(main, file$5, 14, 0, 525);
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
    	let pokemonList;
    	let mixedListOfPokemon;
    	let $level;
    	let $isStart;
    	validate_store(level, 'level');
    	component_subscribe($$self, level, $$value => $$invalidate(4, $level = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Playground', slots, []);
    	const { isStart } = userInfo;
    	validate_store(isStart, 'isStart');
    	component_subscribe($$self, isStart, value => $$invalidate(1, $isStart = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Playground> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Card,
    		UserGround,
    		userInfo,
    		UserDetail,
    		shuffle,
    		list,
    		level,
    		isStart,
    		pokemonList,
    		mixedListOfPokemon,
    		$level,
    		$isStart
    	});

    	$$self.$inject_state = $$props => {
    		if ('pokemonList' in $$props) $$invalidate(3, pokemonList = $$props.pokemonList);
    		if ('mixedListOfPokemon' in $$props) $$invalidate(0, mixedListOfPokemon = $$props.mixedListOfPokemon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$level*/ 16) {
    			$$invalidate(3, pokemonList = list($level));
    		}

    		if ($$self.$$.dirty & /*pokemonList*/ 8) {
    			$$invalidate(0, mixedListOfPokemon = shuffle(pokemonList));
    		}
    	};

    	return [mixedListOfPokemon, $isStart, isStart, pokemonList, $level];
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

    /* README.md generated by Svelte v3.48.0 */

    const file$4 = "README.md";

    function create_fragment$4(ctx) {
    	let span0;
    	let t0;
    	let h20;
    	let t2;
    	let p0;
    	let t3;
    	let em0;
    	let t5;
    	let a0;
    	let t7;
    	let a1;
    	let t9;
    	let t10;
    	let p1;
    	let img0;
    	let img0_src_value;
    	let t11;
    	let p2;
    	let t13;
    	let span1;
    	let t14;
    	let h21;
    	let t16;
    	let p3;
    	let t18;
    	let p4;
    	let img1;
    	let img1_src_value;
    	let t19;
    	let p5;
    	let t20;
    	let em1;
    	let t22;
    	let em2;
    	let t24;
    	let t25;
    	let span2;
    	let t26;
    	let h22;
    	let t28;
    	let p6;
    	let t29;
    	let em3;
    	let t31;
    	let t32;
    	let p7;
    	let a2;
    	let t34;
    	let t35;
    	let h23;
    	let t37;
    	let p8;
    	let t39;
    	let ul6;
    	let li1;
    	let code0;
    	let ul0;
    	let li0;
    	let t42;
    	let li3;
    	let code1;
    	let ul1;
    	let li2;
    	let em4;
    	let t45;
    	let t46;
    	let li5;
    	let code2;
    	let ul2;
    	let li4;
    	let em5;
    	let t49;
    	let t50;
    	let li7;
    	let code3;
    	let ul3;
    	let li6;
    	let em6;
    	let t53;
    	let t54;
    	let li9;
    	let code4;
    	let ul4;
    	let li8;
    	let em7;
    	let t57;
    	let em8;
    	let t59;
    	let t60;
    	let li11;
    	let code5;
    	let ul5;
    	let li10;
    	let em9;
    	let t63;
    	let em10;
    	let t65;
    	let em11;
    	let t67;
    	let t68;
    	let span3;
    	let t69;
    	let h24;
    	let t71;
    	let p9;
    	let t73;
    	let html_tag;
    	let t74;
    	let p10;
    	let t76;
    	let html_tag_1;
    	let t77;
    	let p11;
    	let t79;
    	let html_tag_2;
    	let t80;
    	let p12;
    	let t82;
    	let p13;
    	let img2;
    	let img2_src_value;
    	let t83;
    	let span4;
    	let t84;
    	let h25;
    	let t86;
    	let p14;
    	let t87;
    	let em12;
    	let t89;
    	let em13;
    	let t91;
    	let t92;
    	let p15;
    	let t94;
    	let p16;
    	let img3;
    	let img3_src_value;
    	let t95;
    	let span5;
    	let t96;
    	let h26;
    	let t98;
    	let ul7;
    	let li12;
    	let h40;
    	let t100;
    	let em14;
    	let t102;
    	let em15;
    	let t104;
    	let t105;
    	let li13;
    	let h41;
    	let t107;
    	let t108;
    	let span6;
    	let t109;
    	let h27;
    	let t111;
    	let p17;
    	let t112;
    	let em16;
    	let t114;
    	let em17;
    	let t116;
    	let em18;
    	let t118;
    	let em19;
    	let t120;
    	let em20;
    	let t122;
    	let em21;
    	let t124;
    	let t125;
    	let p18;
    	let t126;
    	let em22;
    	let t128;
    	let em23;
    	let t130;
    	let em24;
    	let t132;
    	let em25;
    	let t134;
    	let em26;
    	let t136;
    	let em27;
    	let t138;
    	let t139;
    	let p19;
    	let t140;
    	let em28;
    	let t142;
    	let em29;
    	let t144;
    	let em30;
    	let t146;
    	let em31;
    	let t148;
    	let t149;
    	let p20;
    	let t150;
    	let em32;
    	let t152;
    	let em33;
    	let t154;
    	let code6;
    	let t156;
    	let t157;
    	let p21;
    	let t158;
    	let code7;
    	let t160;
    	let em34;
    	let t162;
    	let t163;
    	let h28;
    	let t165;
    	let p22;
    	let t167;
    	let p23;
    	let em35;
    	let t169;
    	let em36;
    	let t171;
    	let em37;
    	let t173;
    	let a3;
    	let t175;
    	let t176;
    	let h30;
    	let t178;
    	let p24;
    	let t180;
    	let p25;
    	let em38;
    	let t182;
    	let div0;
    	let pre0;
    	let t184;
    	let pre1;
    	let t186;
    	let pre2;
    	let t188;
    	let p26;
    	let t189;
    	let em39;
    	let t191;
    	let em40;
    	let t193;
    	let em41;
    	let t195;
    	let em42;
    	let t197;
    	let t198;
    	let p27;
    	let em43;
    	let t200;
    	let div1;
    	let pre3;
    	let t202;
    	let pre4;
    	let t204;
    	let pre5;
    	let t206;
    	let p28;
    	let em44;
    	let t208;
    	let t209;
    	let h31;
    	let t211;
    	let p29;
    	let t213;
    	let p30;
    	let em45;
    	let t215;
    	let div2;
    	let pre6;
    	let t217;
    	let pre7;
    	let t219;
    	let pre8;
    	let t221;
    	let p31;
    	let t222;
    	let em46;
    	let t224;
    	let t225;
    	let p32;
    	let img4;
    	let img4_src_value;
    	let t226;
    	let h32;
    	let t228;
    	let p33;
    	let t230;
    	let p34;
    	let img5;
    	let img5_src_value;
    	let t231;
    	let p35;
    	let t233;
    	let p36;
    	let code8;
    	let t235;
    	let code9;
    	let t237;
    	let code10;
    	let t239;
    	let t240;
    	let p37;
    	let em47;
    	let t242;
    	let div3;
    	let pre9;
    	let t244;
    	let pre10;
    	let t246;
    	let pre11;
    	let t248;
    	let p38;
    	let code11;
    	let t250;
    	let t251;
    	let p39;
    	let em48;
    	let t253;
    	let div4;
    	let pre12;
    	let t255;
    	let pre13;
    	let t257;
    	let pre14;
    	let t259;
    	let p40;
    	let img6;
    	let img6_src_value;
    	let t260;
    	let h33;
    	let t262;
    	let p41;
    	let img7;
    	let img7_src_value;
    	let t263;
    	let p42;
    	let t265;
    	let h42;
    	let t267;
    	let p43;
    	let t269;
    	let h43;
    	let t271;
    	let p44;
    	let t273;
    	let h44;
    	let t275;
    	let p45;
    	let t277;
    	let h45;
    	let t279;
    	let p46;
    	let t281;
    	let h46;
    	let t283;
    	let p47;
    	let t285;
    	let h29;
    	let t287;
    	let h210;
    	let t289;
    	let p48;
    	let t290;
    	let a4;
    	let t292;
    	let em49;
    	let t294;
    	let em50;
    	let t296;
    	let t297;
    	let p49;
    	let img8;
    	let img8_src_value;
    	let t298;
    	let h34;
    	let t300;
    	let p50;
    	let em51;
    	let t302;
    	let em52;
    	let t304;
    	let em53;
    	let t306;
    	let em54;
    	let t308;
    	let em55;
    	let t310;
    	let t311;
    	let p51;
    	let em56;
    	let t313;
    	let em57;
    	let t315;
    	let em58;
    	let t317;
    	let t318;
    	let p52;
    	let t319;
    	let em59;
    	let t321;
    	let t322;
    	let p53;
    	let em60;
    	let t324;
    	let div5;
    	let pre15;
    	let t326;
    	let pre16;
    	let t328;
    	let pre17;
    	let t330;
    	let p54;
    	let em61;
    	let t332;
    	let div6;
    	let pre18;
    	let t334;
    	let pre19;
    	let t336;
    	let pre20;
    	let t338;
    	let p55;
    	let em62;
    	let t340;
    	let t341;
    	let p56;
    	let img9;
    	let img9_src_value;
    	let t342;
    	let p57;
    	let t344;
    	let ul8;
    	let li14;
    	let t346;
    	let li15;
    	let t348;
    	let li16;
    	let t350;
    	let li17;
    	let t352;
    	let p58;
    	let img10;
    	let img10_src_value;
    	let t353;
    	let h35;
    	let t355;
    	let p59;
    	let t356;
    	let em63;
    	let t358;
    	let em64;
    	let t360;
    	let em65;
    	let t362;
    	let em66;
    	let t364;
    	let t365;
    	let p60;
    	let em67;
    	let t367;
    	let div7;
    	let pre21;
    	let t369;
    	let pre22;
    	let t371;
    	let pre23;
    	let t373;
    	let p61;
    	let em68;
    	let t375;
    	let div8;
    	let pre24;
    	let t377;
    	let pre25;
    	let t379;
    	let pre26;
    	let t381;
    	let p62;
    	let img11;
    	let img11_src_value;
    	let t382;
    	let p63;
    	let t384;
    	let p64;
    	let em69;
    	let t386;
    	let div9;
    	let pre27;
    	let t388;
    	let pre28;
    	let t390;
    	let pre29;
    	let t392;
    	let p65;
    	let t394;
    	let h36;
    	let t396;
    	let p66;
    	let t398;
    	let ul9;
    	let li18;
    	let code12;
    	let t400;
    	let li19;
    	let code13;
    	let t402;
    	let li20;
    	let code14;
    	let t404;
    	let li21;
    	let a5;
    	let t406;
    	let p67;
    	let em70;
    	let t408;
    	let em71;
    	let t410;
    	let em72;
    	let t412;
    	let em73;
    	let t414;
    	let em74;
    	let t416;
    	let t417;
    	let p68;
    	let em75;
    	let t419;
    	let div10;
    	let pre30;
    	let t421;
    	let pre31;
    	let t423;
    	let pre32;
    	let t425;
    	let p69;
    	let em76;
    	let t427;
    	let em77;
    	let t429;
    	let t430;
    	let p70;
    	let img12;
    	let img12_src_value;
    	let t431;
    	let p71;
    	let em78;
    	let t433;
    	let t434;
    	let p72;
    	let em79;
    	let t436;
    	let div11;
    	let pre33;
    	let t438;
    	let pre34;
    	let t440;
    	let pre35;
    	let t442;
    	let p73;
    	let t443;
    	let code15;
    	let t445;
    	let em80;
    	let t447;
    	let em81;
    	let t449;
    	let t450;
    	let p74;
    	let em82;
    	let t452;
    	let div12;
    	let pre36;
    	let t454;
    	let pre37;
    	let t456;
    	let pre38;
    	let t458;
    	let p75;
    	let t460;
    	let p76;
    	let img13;
    	let img13_src_value;
    	let t461;
    	let h37;
    	let t463;
    	let p77;
    	let t465;
    	let p78;
    	let code16;
    	let t467;
    	let p79;
    	let code17;
    	let t469;
    	let p80;
    	let em83;
    	let t471;
    	let div13;
    	let pre39;
    	let t473;
    	let pre40;
    	let t475;
    	let pre41;
    	let t477;
    	let p81;
    	let t478;
    	let em84;
    	let t480;
    	let em85;
    	let t482;
    	let t483;
    	let p82;
    	let t484;
    	let em86;
    	let t486;
    	let em87;
    	let t488;
    	let em88;
    	let t490;
    	let t491;
    	let p83;
    	let t493;
    	let p84;
    	let img14;
    	let img14_src_value;
    	let t494;
    	let h211;
    	let t496;
    	let span7;
    	let t497;
    	let span8;
    	let t498;
    	let h212;
    	let t500;
    	let h213;
    	let t502;
    	let ul10;
    	let li22;
    	let p85;
    	let t504;
    	let li23;
    	let p86;
    	let a6;
    	let t506;
    	let li24;
    	let p87;
    	let t508;
    	let li25;
    	let p88;
    	let a7;
    	let t510;
    	let li26;
    	let p89;
    	let a8;
    	let t512;
    	let li27;
    	let p90;
    	let a9;
    	let t514;
    	let li28;
    	let p91;
    	let a10;
    	let t516;
    	let li29;
    	let p92;
    	let a11;
    	let t518;
    	let ul11;
    	let li30;
    	let t520;
    	let ul12;
    	let li31;
    	let p93;
    	let a12;
    	let t522;
    	let li32;
    	let p94;
    	let t524;
    	let li33;
    	let p95;
    	let a13;
    	let t526;
    	let ul13;
    	let li34;
    	let t528;
    	let ul14;
    	let li35;
    	let a14;
    	let t530;
    	let ul15;
    	let li36;
    	let t532;
    	let ul16;
    	let li37;
    	let a15;
    	let t534;
    	let ul17;
    	let li38;
    	let t536;
    	let ul18;
    	let li39;
    	let a16;
    	let t538;
    	let li40;
    	let a17;
    	let t540;
    	let pre42;
    	let code18;
    	let t542;
    	let p96;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = space();
    			h20 = element("h2");
    			h20.textContent = "Selamlaaaaar 👋";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Herşeyden önce umuyorum ki bu basit döküman Svelte yolculuğunda rehber\nolabilir. Son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte'in\nyapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu\ndökümanı oluşturdum. Döküman içerisinde adım adım ");
    			em0 = element("em");
    			em0.textContent = "Game";
    			t5 = text(" bağlantısında\ngörebileğin oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsan aynı\nadımları takip ederek benzer bir uygulama oluşturabilir, veya küçük bir kaynak\nmodelinde kullanabilirsin. Svelte içeriği iyi ayrıntılanmış dökümantasyonlara\n(");
    			a0 = element("a");
    			a0.textContent = "docs";
    			t7 = text(",\n");
    			a1 = element("a");
    			a1.textContent = "examples";
    			t9 = text(") sahip,\ndökümantasyonları inceledikten sonra uygulamayı takip etmen daha faydalı\nolabilir.");
    			t10 = space();
    			p1 = element("p");
    			img0 = element("img");
    			t11 = space();
    			p2 = element("p");
    			p2.textContent = "İçeriğin detaylarını sol tarafta yer alan haritalandırma ile takip\nedebilirsin. İlk bölümlerde Svelte'i nasıl kullanabileceğine dair\nbilgilendirmeler yer alıyor. Bu kısımlara hakimsen, atlayarak Start Game\nbölümünden devam edebilirsin.";
    			t13 = space();
    			span1 = element("span");
    			t14 = space();
    			h21 = element("h2");
    			h21.textContent = "🪁 Oyun hakkında";
    			t16 = space();
    			p3 = element("p");
    			p3.textContent = "Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre\narayüz üzerinde kartlar bulunacak. Kartlara click eventi gerçekleştiğinde\nkartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar.\nEşleşen kartlar açık bir şekilde arayüz üzerinde dururken başarılı eşleşme\nsonucunda kullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar\nbulundukları yerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, bir\nsonraki seviyede yer alan kartlar arayüze kapalı olarak yeniden gelecektir.";
    			t18 = space();
    			p4 = element("p");
    			img1 = element("img");
    			t19 = space();
    			p5 = element("p");
    			t20 = text("Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde\nyer alan görsellerden birini seçmesi beklenecektir (Avatarlar ne kadar evcil\ngözükseler de, güç içlerinde gizli 🐱‍👤). Bu seçilen değerler oyunun arayüzünde\nkartların yer aldığı bölümün altında ");
    			em1 = element("em");
    			em1.textContent = "score & level";
    			t22 = text(" değerleri ile\nbirlikte gösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak\ntutulurken, ");
    			em2 = element("em");
    			em2.textContent = "score & level";
    			t24 = text(" değerleri dinamik olarak kullanıcı davranışına göre\ngüncellenecektir.");
    			t25 = space();
    			span2 = element("span");
    			t26 = space();
    			h22 = element("h2");
    			h22.textContent = "🪁 Svelte nedir?";
    			t28 = space();
    			p6 = element("p");
    			t29 = text("Svelte günümüz modern library ve framework habitatının komplex yapılarını\nazaltarak daha basit şekilde yüksek verimliliğe sahip uygulamalar\ngeliştirilmesini sağlamayı amaçlayan bir derleyicidir. Modern framework/library\nile birlikte geride bıraktığımız her süreçte farklı ihtiyaçlar için yeni bir\nöğrenme süreci ortaya çıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin\nkarşısına çıkması bir süre sonrasında illallah dedirtmeye başladığı gayet\naşikar. Svelte alışık olduğumuz ");
    			em3 = element("em");
    			em3.textContent = "html & css & js";
    			t31 = text(" kod yapılarına benzer bir\nsözdizimine sahip olması, props ve state/stores güncellemeleri için 40 takla\natılmasına gerek kalınmaması gibi özellikleri ile bu döngünün dışına çıkmayı\nbaşarabilmiş.. ve umuyorum ki bu şekilde sadeliğini korumaya devam edebilir.");
    			t32 = space();
    			p7 = element("p");
    			a2 = element("a");
    			a2.textContent = "Stack Overflow Developer Survey 2021";
    			t34 = text(" anketinde geliştiriciler tarafından %71.47 oranıyla en çok sevilen\nweb framework Svelte olarak seçildi.");
    			t35 = space();
    			h23 = element("h2");
    			h23.textContent = "🪁 Basit ifadeler";
    			t37 = space();
    			p8 = element("p");
    			p8.textContent = "Bazı bölümlerde aynı kelimeleri tekrar etmemek için, bazı kısayol ifadeleri\nkullandım(tamamen salladım). Sayısı çok fazla değil, sorun yaşamayacağını\ndüşünüyorum.";
    			t39 = space();
    			ul6 = element("ul");
    			li1 = element("li");
    			code0 = element("code");
    			code0.textContent = "_Playground_";
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Playground.svelte Component";
    			t42 = space();
    			li3 = element("li");
    			code1 = element("code");
    			code1.textContent = "+ User.svelte";
    			ul1 = element("ul");
    			li2 = element("li");
    			em4 = element("em");
    			em4.textContent = "User.svelte";
    			t45 = text(" dosyası oluşturuldu.");
    			t46 = space();
    			li5 = element("li");
    			code2 = element("code");
    			code2.textContent = "Avatar/";
    			ul2 = element("ul");
    			li4 = element("li");
    			em5 = element("em");
    			em5.textContent = "Avatar";
    			t49 = text(" klasörü oluşturuldu.");
    			t50 = space();
    			li7 = element("li");
    			code3 = element("code");
    			code3.textContent = "+ User.svelte + Header.svelte + Avatars.svelte";
    			ul3 = element("ul");
    			li6 = element("li");
    			em6 = element("em");
    			em6.textContent = "User.svelte, Header.svelte, Avatars.svelte";
    			t53 = text(" dosyaları oluşturuldu.");
    			t54 = space();
    			li9 = element("li");
    			code4 = element("code");
    			code4.textContent = "+ User > Avatar.svelte";
    			ul4 = element("ul");
    			li8 = element("li");
    			em7 = element("em");
    			em7.textContent = "User";
    			t57 = text(" klasörü içerisinde ");
    			em8 = element("em");
    			em8.textContent = "Avatar.svelte";
    			t59 = text(" dosyası oluşturuldu.");
    			t60 = space();
    			li11 = element("li");
    			code5 = element("code");
    			code5.textContent = "+ public > assets > images > pasa.jpg, sabuha.jpg";
    			ul5 = element("ul");
    			li10 = element("li");
    			em9 = element("em");
    			em9.textContent = "public > assets > images";
    			t63 = text(" klasörü içerisinde ");
    			em10 = element("em");
    			em10.textContent = "pasa.jpg";
    			t65 = text(", ");
    			em11 = element("em");
    			em11.textContent = "sabuha.jpg";
    			t67 = text("\ndosyaları oluşturuldu.");
    			t68 = space();
    			span3 = element("span");
    			t69 = space();
    			h24 = element("h2");
    			h24.textContent = "🪁 Svelte projesi oluşturma";
    			t71 = space();
    			p9 = element("p");
    			p9.textContent = "Npx ile yeni bir proje oluşturma:";
    			t73 = space();
    			html_tag = new HtmlTag(false);
    			t74 = space();
    			p10 = element("p");
    			p10.textContent = "Svelte Typescript notasyonunu desteklemektedir. Typescript üzerinde\nyapabileceğiniz bütün işlemleri Svelte projende kullanabilirsin.";
    			t76 = space();
    			html_tag_1 = new HtmlTag(false);
    			t77 = space();
    			p11 = element("p");
    			p11.textContent = "Gerekli olan bağımlılıkları projemize ekleyerek ayağa kaldırabiliriz.";
    			t79 = space();
    			html_tag_2 = new HtmlTag(false);
    			t80 = space();
    			p12 = element("p");
    			p12.textContent = "Bu komutlar sonrasında konsol üzerinde projenin hangi port üzerinde çalıştığını\ngörebilirsin. Windows işletim sistemlerinde varsayılan 8080 portu işaretli\niken, bu port üzerinde çalışan proje bulunuyorsa veya farklı işletim sistemi\nkullanıyorsan port adresi değişkenlik gösterebilir.";
    			t82 = space();
    			p13 = element("p");
    			img2 = element("img");
    			t83 = space();
    			span4 = element("span");
    			t84 = space();
    			h25 = element("h2");
    			h25.textContent = "🪁 Svelte nasıl çalışır?";
    			t86 = space();
    			p14 = element("p");
    			t87 = text("Svelte bileşenleri ");
    			em12 = element("em");
    			em12.textContent = ".svelte";
    			t89 = text(" uzantılı dosyalar ile oluşturulur. HTML'de benzer\nolarak ");
    			em13 = element("em");
    			em13.textContent = "script, style, html";
    			t91 = text(" kod yapılarını oluşturabilirdiğiniz üç farklı bölüm\nbulunuyor.");
    			t92 = space();
    			p15 = element("p");
    			p15.textContent = "Uygulama oluşturduğumuzda bu bileşenler derlenerek, pure Javascript\nkodlarına dönüştürülür. Svelte derleme işlemini runtime üzerinde\ngerçekleştiriyor. Bu derleme işlemiyle birlikte Virtual DOM bağımlılığını\nortadan kalkıyor.";
    			t94 = space();
    			p16 = element("p");
    			img3 = element("img");
    			t95 = space();
    			span5 = element("span");
    			t96 = space();
    			h26 = element("h2");
    			h26.textContent = "🪁 Proje bağımlılıkları";
    			t98 = space();
    			ul7 = element("ul");
    			li12 = element("li");
    			h40 = element("h4");
    			h40.textContent = "Typescript";
    			t100 = text("\nTypescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı\nhataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Projenizde\nyer alan ");
    			em14 = element("em");
    			em14.textContent = ".svelte";
    			t102 = text(" uzantılı dosyalarda kullanabileceğiniz gibi, ");
    			em15 = element("em");
    			em15.textContent = ".ts";
    			t104 = text("\ndosyalarını da destekler.");
    			t105 = space();
    			li13 = element("li");
    			h41 = element("h4");
    			h41.textContent = "Rollup";
    			t107 = text("\nSvelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası\noluşturulacaktır. Rollup Javascript uygulamalar için kullanılan bir modül\npaketleyicidir, uygulamamızda yer alan kodları tarayıcının anlayabileceği\nşekilde ayrıştırır.");
    			t108 = space();
    			span6 = element("span");
    			t109 = space();
    			h27 = element("h2");
    			h27.textContent = "🪁 Svelte yapısını inceleme";
    			t111 = space();
    			p17 = element("p");
    			t112 = text("Varsayılan ");
    			em16 = element("em");
    			em16.textContent = "src/App.svelte";
    			t114 = text(" dosyasını kontrol ettiğimizde daha önce\ndeğindiğimiz gibi ");
    			em17 = element("em");
    			em17.textContent = "Javascript";
    			t116 = text(" kodları için ");
    			em18 = element("em");
    			em18.textContent = "script";
    			t118 = text(", ");
    			em19 = element("em");
    			em19.textContent = "html";
    			t120 = text(" kodları için ");
    			em20 = element("em");
    			em20.textContent = "main";
    			t122 = text("\nve stillendirme için ");
    			em21 = element("em");
    			em21.textContent = "style";
    			t124 = text(" tagları bulunuyor.");
    			t125 = space();
    			p18 = element("p");
    			t126 = text("🎈 ");
    			em22 = element("em");
    			em22.textContent = "script";
    			t128 = text(" etiketinde ");
    			em23 = element("em");
    			em23.textContent = "lang";
    			t130 = text(" özelliği Typescript bağımlılığını eklediğimiz\niçin ");
    			em24 = element("em");
    			em24.textContent = "ts";
    			t132 = text(" değerinde bulunmaktadır. Typescript kullanmak istediğin ");
    			em25 = element("em");
    			em25.textContent = "svelte";
    			t134 = text("\ndosyalarında ");
    			em26 = element("em");
    			em26.textContent = "lang";
    			t136 = text(" özelliğine ");
    			em27 = element("em");
    			em27.textContent = "ts";
    			t138 = text(" değerini vermen yeterli olacaktır.");
    			t139 = space();
    			p19 = element("p");
    			t140 = text("🎈 ");
    			em28 = element("em");
    			em28.textContent = "main";
    			t142 = text(" etiketinde ");
    			em29 = element("em");
    			em29.textContent = "html";
    			t144 = text(" kodlarını tanımlayabileceğin gibi, bu etiketin\ndışında da dilediğin gibi ");
    			em30 = element("em");
    			em30.textContent = "html";
    			t146 = text(" kodlarını tanımlayabilirsin. Svelte\ntanımladığın kodları ");
    			em31 = element("em");
    			em31.textContent = "html";
    			t148 = text(" kodu olarak derlemesine rağmen, proje yapısının\ndaha okunabilir olabilmesi için kapsayıcı bir etiketin altında toplanması daha\niyi olabilir.");
    			t149 = space();
    			p20 = element("p");
    			t150 = text("🎈 ");
    			em32 = element("em");
    			em32.textContent = "style";
    			t152 = text(" etiketi altında tanımladığın stil özelliklerinden, aynı dosyada\nbulunan ");
    			em33 = element("em");
    			em33.textContent = "html";
    			t154 = text(" alanında seçiciler etkilenir. Global seçicileri\ntanımlayabilir veya global olarak tanımlamak istediğin seçicileri\n");
    			code6 = element("code");
    			code6.textContent = "public/global.css";
    			t156 = text(" dosyasında düzenleyebilirsin.");
    			t157 = space();
    			p21 = element("p");
    			t158 = text("🎈 Proje içerisinde compile edilen bütün yapılar ");
    			code7 = element("code");
    			code7.textContent = "/public/build/bundle.js";
    			t160 = text("\ndosyasında yer almaktadir. ");
    			em34 = element("em");
    			em34.textContent = "index.html";
    			t162 = text(" dosyası buradaki yapıyı referans alarak\nSvelte projesini kullanıcı karşısına getirmektedir.");
    			t163 = space();
    			h28 = element("h2");
    			h28.textContent = "🪁 Biraz pratik";
    			t165 = space();
    			p22 = element("p");
    			p22.textContent = "Birkaç örnek yaparak Svelte'i anlamaya, yorumlamaya çalışalım. Kod örnekleri\noyun üzerinde sıkça kullanacağımız yapılar için bir temel oluşturacak.";
    			t167 = space();
    			p23 = element("p");
    			em35 = element("em");
    			em35.textContent = "App.svelte";
    			t169 = text(" dosyasında ");
    			em36 = element("em");
    			em36.textContent = "name";
    			t171 = text(" isminde bir değişken tanımlanmış. Typescript\nnotasyonu baz alındığı için değer tipi olarak ");
    			em37 = element("em");
    			em37.textContent = "string";
    			t173 = text(" verilmiş. Bu notasyon ile\nanlatım biraz daha uzun olabileceği için kullanmamayı tercih edicem. Github\nüzerinde bulunan kodlar ile, burada birlikte oluşturacaklarımız farklılık\ngösterebilir.. panik yok, Typescript'e ");
    			a3 = element("a");
    			a3.textContent = "hakim olabileceğine";
    			t175 = text("\neminim.");
    			t176 = space();
    			h30 = element("h3");
    			h30.textContent = "🎈 Variable erişimi";
    			t178 = space();
    			p24 = element("p");
    			p24.textContent = "Script üzerinde tanımlanan değerleri html içerisinde çağırabilmek için\n{ } kullanılmalıdır. Bu template ile değer tipi farketmeksizin\ndeğişkenleri çağırarak işlemler gerçekleştirilebilir.";
    			t180 = space();
    			p25 = element("p");
    			em38 = element("em");
    			em38.textContent = "app.svelte";
    			t182 = space();
    			div0 = element("div");
    			pre0 = element("pre");

    			pre0.textContent = `${`\<script>
  const user = "sabuha";
</script>`}`;

    			t184 = space();
    			pre1 = element("pre");

    			pre1.textContent = `${`\<span>{user} seni izliyor!</span>
`}`;

    			t186 = space();
    			pre2 = element("pre");

    			pre2.textContent = `${`\<style>
  h1 {
    color: rebeccapurple;
  }
</style>`}`;

    			t188 = space();
    			p26 = element("p");
    			t189 = text("Bu tanımlama ile birlikte ");
    			em39 = element("em");
    			em39.textContent = "user";
    			t191 = text(" değerine tanımlanan her değeri dinamik olarak\n");
    			em40 = element("em");
    			em40.textContent = "html";
    			t193 = text(" içerisinde çağırabilirsin. biraz daha biraz daha karıştıralım..\n");
    			em41 = element("em");
    			em41.textContent = "user";
    			t195 = text(" tanımlaması ");
    			em42 = element("em");
    			em42.textContent = "sabuha";
    			t197 = text(" değerine eşit olduğu durumlarda 'seni izliyor!'\nyerine 'bir kedi gördüm sanki!' değerini ekrana getirelim.");
    			t198 = space();
    			p27 = element("p");
    			em43 = element("em");
    			em43.textContent = "app.svelte";
    			t200 = space();
    			div1 = element("div");
    			pre3 = element("pre");

    			pre3.textContent = `${`\<script>
  const user = "sabuha";
</script>`}`;

    			t202 = space();
    			pre4 = element("pre");

    			pre4.textContent = `${`\<span>{user === "sabuha" ? "bir kedi gördüm sanki!" : "seni izliyor!"}</span>
`}`;

    			t204 = space();
    			pre5 = element("pre");
    			pre5.textContent = `${`\<style></style>`}`;
    			t206 = space();
    			p28 = element("p");
    			em44 = element("em");
    			em44.textContent = "html";
    			t208 = text(" içerisinde kullandığımız { } tagları arasında condition\nyapıları gibi döngü, fonksiyon çağırma işlemleri gerçekleştirebilirsin. Bu\nyapılara sahip birçok işlemi birlikte gerçekleştireceğiz.");
    			t209 = space();
    			h31 = element("h3");
    			h31.textContent = "🎈 Reaktif değişkenler";
    			t211 = space();
    			p29 = element("p");
    			p29.textContent = "Değişkenlik gösterebilecek dinamik verilerin güncellendiğinde, DOM üzerinde\nyer alan referansı benzer olarak güncellenir.";
    			t213 = space();
    			p30 = element("p");
    			em45 = element("em");
    			em45.textContent = "app.svelte";
    			t215 = space();
    			div2 = element("div");
    			pre6 = element("pre");

    			pre6.textContent = `${`\<script>
  let number = 0;
  
  const randomNumber = () => {
    number = Math.round(Math.random() \* 15);
  };
</script>`}`;

    			t217 = space();
    			pre7 = element("pre");

    			pre7.textContent = `${`\
<main>
  <h3>{number}</h3>
  <button on:click={randomNumber}>Update Number</button>
</main>
`}`;

    			t219 = space();
    			pre8 = element("pre");

    			pre8.textContent = `${`\<style>
  main {
    border-radius: 5px;
    background-color: yellowgreen;
    padding: 5px;
    margin: 10px 50px;
  }
  
  h3 {
    background-color: orangered;
    width: 100px;
    color: white;
  }
  
  button {
    border: 1px solid black;
    cursor: pointer;
  }
  
  h3,button {
    display: block;
    text-align: center;
    margin: 25px auto;
    padding: 5px;
  }
</style>`}`;

    			t221 = space();
    			p31 = element("p");
    			t222 = text("Tanımladığımız ");
    			em46 = element("em");
    			em46.textContent = "numb";
    			t224 = text(" değeri her güncellendiğinde, DOM üzerinde bu değer\nyeniden ve sıkılmadan güncellenmeye devam edecektir.");
    			t225 = space();
    			p32 = element("p");
    			img4 = element("img");
    			t226 = space();
    			h32 = element("h3");
    			h32.textContent = "🎈 Component kullanımı";
    			t228 = space();
    			p33 = element("p");
    			p33.textContent = "Uygulamalarımızda yer alan bileşenleri parçalayarak istediğimiz gibi bir bütün\nhaline getirebilmek üzerinde çalışırken kolaylık sağlar, tekrar eden bileşen\nparçalarında yeniden çağırabilmek daha az efor sarfettirir.";
    			t230 = space();
    			p34 = element("p");
    			img5 = element("img");
    			t231 = space();
    			p35 = element("p");
    			p35.textContent = "Bir önceki örnekte yaptığımız random sayı üreten basit yapıyı bir component\nhaline getirelim.";
    			t233 = space();
    			p36 = element("p");
    			code8 = element("code");
    			code8.textContent = "components/Content/";
    			t235 = text(" dizininde ");
    			code9 = element("code");
    			code9.textContent = "RandomNumber.svelte";
    			t237 = text(" dosyasını oluşturalım.\nBu yeni componentimizi ");
    			code10 = element("code");
    			code10.textContent = "App.svelte";
    			t239 = text(" dosyasında kullanalım.");
    			t240 = space();
    			p37 = element("p");
    			em47 = element("em");
    			em47.textContent = "Components > Content > RandomNumber.svelte";
    			t242 = space();
    			div3 = element("div");
    			pre9 = element("pre");

    			pre9.textContent = `${`\<script>
  let number = 0;
  
  const randomNumber = () => {
    number = Math.round(Math.random() \* 15);
  };
</script>`}`;

    			t244 = space();
    			pre10 = element("pre");

    			pre10.textContent = `${`\
<div class="random-number-capsule">
  <h3>{number}</h3>
  <button on:click={randomNumber}>Update Number</button>
</div>
`}`;

    			t246 = space();
    			pre11 = element("pre");

    			pre11.textContent = `${`\<style>
  .random-number-capsule {
    border-radius: 5px;
    background-color: yellowgreen;
    padding: 5px;
    margin: 10px 50px;
  }
  
  h3 {
    background-color: orangered;
    width: 100px;
    color: white;
  } 
  
  button {
    border: 1px solid black;
    cursor: pointer;
  } 
  
  h3,
  button {
    display: block;
    text-align: center;
    margin: 25px auto;
    padding: 5px;
  }
</style>`}`;

    			t248 = space();
    			p38 = element("p");
    			code11 = element("code");
    			code11.textContent = "RandomNumber";
    			t250 = text(" componentini istediğimiz gibi çağırarak kullanmaya\nbaşlayabiliriz.");
    			t251 = space();
    			p39 = element("p");
    			em48 = element("em");
    			em48.textContent = "App.svelte";
    			t253 = space();
    			div4 = element("div");
    			pre12 = element("pre");

    			pre12.textContent = `${`\<script>
  \import RandomNumber from "./components/Content/RandomNumber/RandomNumber.svelte";  
</script>`}`;

    			t255 = space();
    			pre13 = element("pre");

    			pre13.textContent = `${`\
<main>
  <RandomNumber />
  <RandomNumber />
  <RandomNumber />
  <RandomNumber />
</main>
`}`;

    			t257 = space();
    			pre14 = element("pre");

    			pre14.textContent = `${`\<style>
</style>`}`;

    			t259 = space();
    			p40 = element("p");
    			img6 = element("img");
    			t260 = space();
    			h33 = element("h3");
    			h33.textContent = "🎈 Componentler Arası İletişim";
    			t262 = space();
    			p41 = element("p");
    			img7 = element("img");
    			t263 = space();
    			p42 = element("p");
    			p42.textContent = "Küçük yapılı projelerden, komplex yapılılara kadar birçok component üzerinden\nalıp farklı bir yerde kullanma, güncelleme gibi ihtiyaçlarımız olacak.\nKullanılan framework, library veya compiler'in bu ihtiyacınıza esnek çözümler\nsağlayabilmesi gerekiyor. Svelte bu ihtiyaçlarınız için birden fazla ve basit\nyapılara sahip çözümler barındırıyor.";
    			t265 = space();
    			h42 = element("h4");
    			h42.textContent = "🎈🎈 Props";
    			t267 = space();
    			p43 = element("p");
    			p43.textContent = "Props kullanarak dataları bir component üzerinden farklı componentlere\naktarabilirsiniz. Componentler arası bu ilişki parent-child ile ifade edilir.\nParent üzerinden child componentlere veri aktarabiliyorken, aynı zamanda child\ncomponent üzerinden parent componente veri iletebilirsiniz.";
    			t269 = space();
    			h43 = element("h4");
    			h43.textContent = "🎈🎈 Slots";
    			t271 = space();
    			p44 = element("p");
    			p44.textContent = "Parent-child ilişkisinde olduğu gibi verilerin alt componente\naktarılmasında kullanabilirsin. Bir template dahilinde (html içeririkleri gibi)\nverilerin aktarılmasına izin verir.";
    			t273 = space();
    			h44 = element("h4");
    			h44.textContent = "🎈🎈 Context";
    			t275 = space();
    			p45 = element("p");
    			p45.textContent = "Bir veriyi iletmeniz gereken component sayısı arttıkça, yapısını kurgulamak ve\ntakibini sağlamak zor ve bir yerden sonra da oldukça sıkıcı bir duruma\ndönüşebilir. Context ile dataların parent üzerinden child componentler\nüzerinde erişilmesini sağlar.";
    			t277 = space();
    			h45 = element("h4");
    			h45.textContent = "🎈🎈 Module Context";
    			t279 = space();
    			p46 = element("p");
    			p46.textContent = "Component üzerinde kullandığınız veri farklı bir Component'da yer alıyorsa ve\nçalışmaları birbirlerine bağımlı olduğu senaryolarda Module Context Componentlar\narasında bu senaryonun uygulanmasını sağlıyor. Verileri birden çok component ile\npaylaşılmasını olanak tanır.";
    			t281 = space();
    			h46 = element("h4");
    			h46.textContent = "🎈🎈 Store";
    			t283 = space();
    			p47 = element("p");
    			p47.textContent = "Veri taşımacılık ltd. şti.'nin joker kartı.. Verilerinizi her yerde\ngüncellenmesini, çağırılmasını sağlar. Kullanımı için bir hiyerarşi içerisinde\nolmasına gereksinimi bulunmuyor.";
    			t285 = space();
    			h29 = element("h2");
    			h29.textContent = "🎈 Svelte lifecycle";
    			t287 = space();
    			h210 = element("h2");
    			h210.textContent = "🪁 Start Game";
    			t289 = space();
    			p48 = element("p");
    			t290 = text("Svelte'i biraz daha yakından tanıyoruz, birlikte uygulamamızı oluşturabilmek\niçin yeteri kadar bilgi sahibi olduk. Kullanıcının arayüz olarak görebileceği\niki Component bulunuyor. Kullanıcı adı ve avatar seçtiği User Component, bu\nseçimler sonrasında erişilen Playground Component. User Componenti ile oyunumuzu\noluşturmaya başlayalım. ");
    			a4 = element("a");
    			a4.textContent = "Yeni bir proje oluşturabilir";
    			t292 = text("\nveya pratik yapabilmek için şuana kadarki kodları kaldırabilirsin.\n");
    			em49 = element("em");
    			em49.textContent = "src > components > User";
    			t294 = text(" ve ");
    			em50 = element("em");
    			em50.textContent = "src > components > Playground";
    			t296 = text(" klasörlerini\noluşturalım.");
    			t297 = space();
    			p49 = element("p");
    			img8 = element("img");
    			t298 = space();
    			h34 = element("h3");
    			h34.textContent = "🎈 User Component";
    			t300 = space();
    			p50 = element("p");
    			em51 = element("em");
    			em51.textContent = "User";
    			t302 = text(" klasörü altında Kullanıcıdan alacağımız her değer için ");
    			em52 = element("em");
    			em52.textContent = "Avatar";
    			t304 = text(" ve\n");
    			em53 = element("em");
    			em53.textContent = "Name";
    			t306 = text(" klasörlerini oluşturalım. Root klasörde ");
    			em54 = element("em");
    			em54.textContent = "User";
    			t308 = text(" Component altında\ntanımlanan bütün yapıların yer alacağı bir kapsayıcı dahil edeceğiz.\n");
    			em55 = element("em");
    			em55.textContent = "UserGround.svelte";
    			t310 = text(" isminde bir dosya oluşturuyorum, parçaladığımız bütün\ncomponentler burada yer alacak.");
    			t311 = space();
    			p51 = element("p");
    			em56 = element("em");
    			em56.textContent = "Playground";
    			t313 = text(" klasörü içerisinde buna benzer bir yapıyı oluşturarak, oyun\niçerisindeki bütün componentleri aynı dosya üzerinde çağıracağız.\n");
    			em57 = element("em");
    			em57.textContent = "Playground";
    			t315 = text(" altında ");
    			em58 = element("em");
    			em58.textContent = "Wrapper > Playground.svelte";
    			t317 = text(" dizin ve dosyasını\noluşturalım.");
    			t318 = space();
    			p52 = element("p");
    			t319 = text("User Componenti üzerinde çalışırken, yapacağımız değişiklikleri inceleyebilmek\niçin User Component'ini ");
    			em59 = element("em");
    			em59.textContent = "Playground > Wrapper > Playground.svelte";
    			t321 = text(" dosyasında\nçağıralım.");
    			t322 = space();
    			p53 = element("p");
    			em60 = element("em");
    			em60.textContent = "User > UserGround.svelte";
    			t324 = space();
    			div5 = element("div");
    			pre15 = element("pre");

    			pre15.textContent = `${`\<script>
  const componentDetail = "User";
</script>`}`;

    			t326 = space();
    			pre16 = element("pre");

    			pre16.textContent = `${`\
<main>
  <h2>{componentDetail} Component</h2>
</main>
`}`;

    			t328 = space();
    			pre17 = element("pre");

    			pre17.textContent = `${`\<style>
  h2 {
    color: white;
    background-color: orangered;
    text-align: center;
  }
</style>`}`;

    			t330 = space();
    			p54 = element("p");
    			em61 = element("em");
    			em61.textContent = "Playground > Wrapper > Playground.svelte";
    			t332 = space();
    			div6 = element("div");
    			pre18 = element("pre");

    			pre18.textContent = `${`\<script>
  \import Userground from "../../User/Userground.svelte";
</script>`}`;

    			t334 = space();
    			pre19 = element("pre");

    			pre19.textContent = `${`\
<main>
   <UserGround />
</main>
`}`;

    			t336 = space();
    			pre20 = element("pre");

    			pre20.textContent = `${`\<style>
  h2 {
    color: white;
    background-color: orangered;
    text-align: center;
  }
</style>`}`;

    			t338 = space();
    			p55 = element("p");
    			em62 = element("em");
    			em62.textContent = "User Component";
    			t340 = text(" çağırdıktan sonra üzerinde geliştirme yapmaya başlayalım.");
    			t341 = space();
    			p56 = element("p");
    			img9 = element("img");
    			t342 = space();
    			p57 = element("p");
    			p57.textContent = "Component üzerinde 4 farklı bölüm yer alıyor.";
    			t344 = space();
    			ul8 = element("ul");
    			li14 = element("li");
    			li14.textContent = "Kullanıcıyı bilgilendiren bir header yazısı";
    			t346 = space();
    			li15 = element("li");
    			li15.textContent = "Kullanıcının görseller üzerinden avatar seçimi yapabildiği bir bölüm";
    			t348 = space();
    			li16 = element("li");
    			li16.textContent = "Kullanıcı adının girilebilmesi için alan";
    			t350 = space();
    			li17 = element("li");
    			li17.textContent = "Ve bütün bunlar tamamlandığında oyuna start veren bir button elementi\nbulunuyor.";
    			t352 = space();
    			p58 = element("p");
    			img10 = element("img");
    			t353 = space();
    			h35 = element("h3");
    			h35.textContent = "🎈 Header Component";
    			t355 = space();
    			p59 = element("p");
    			t356 = text("Root folder üzerinde ");
    			em63 = element("em");
    			em63.textContent = "Header.svelte";
    			t358 = text(" isminde bir Component oluşturuyorum.\nÖnceki örneklerde gerçekleştirdiğimiz gibi, ");
    			em64 = element("em");
    			em64.textContent = "Header.svelte";
    			t360 = text(" Componentini\n");
    			em65 = element("em");
    			em65.textContent = "Userground.svelte";
    			t362 = text(" componenti üzerinde çağıralım. Oluşturduğumuz\n");
    			em66 = element("em");
    			em66.textContent = "Header.svelte";
    			t364 = text(" componentinin basit bir görevi bulunuyor, statik bir metin\nbarındırıyor.");
    			t365 = space();
    			p60 = element("p");
    			em67 = element("em");
    			em67.textContent = "User > Header.svelte";
    			t367 = space();
    			div7 = element("div");
    			pre21 = element("pre");
    			pre21.textContent = `${`\<script></script>`}`;
    			t369 = space();
    			pre22 = element("pre");

    			pre22.textContent = `${`\
<div class="header">
  <h2>select your best pokemon and start catching!</h2>
</div>
`}`;

    			t371 = space();
    			pre23 = element("pre");

    			pre23.textContent = `${`\<style>
  .header {
    padding: 5px 0;
    margin-bottom: 15px;
    border-bottom: 3px solid white;
  }
</style>`}`;

    			t373 = space();
    			p61 = element("p");
    			em68 = element("em");
    			em68.textContent = "User > UserGround.svelte";
    			t375 = space();
    			div8 = element("div");
    			pre24 = element("pre");

    			pre24.textContent = `${`\<script>
  \import Header from "./Header.svelte";
</script>`}`;

    			t377 = space();
    			pre25 = element("pre");

    			pre25.textContent = `${`\
<main>
  <Header />
</main>
`}`;

    			t379 = space();
    			pre26 = element("pre");

    			pre26.textContent = `${`\<style>
  main {
    background-color: #f5f5f5;
    border-radius: 5px;
    padding-bottom: 15px;
  }
</style>`}`;

    			t381 = space();
    			p62 = element("p");
    			img11 = element("img");
    			t382 = space();
    			p63 = element("p");
    			p63.textContent = "Süper iğrenç gözüküyor, öyle değil mi? İyi ki CSS var..";
    			t384 = space();
    			p64 = element("p");
    			em69 = element("em");
    			em69.textContent = "Playground > Wrapper > Playground.svelte";
    			t386 = space();
    			div9 = element("div");
    			pre27 = element("pre");

    			pre27.textContent = `${`\<script>
  \import Userground from "../../User/Userground.svelte";
</script>`}`;

    			t388 = space();
    			pre28 = element("pre");

    			pre28.textContent = `${`\
<main class="playground">
   <Userground />
</main>
`}`;

    			t390 = space();
    			pre29 = element("pre");

    			pre29.textContent = `${`\<style>
  .playground {
    width: 900px;
    margin: 0 auto;
    text-align: center;
  }
</style>`}`;

    			t392 = space();
    			p65 = element("p");
    			p65.textContent = "Ehh... şimdi biraz daha az kötü gözüktüğü söylenebilir💩💩💩";
    			t394 = space();
    			h36 = element("h3");
    			h36.textContent = "🎈 Avatar Component";
    			t396 = space();
    			p66 = element("p");
    			p66.textContent = "Bu Component içerisinde birden fazla bileşene ihtiyaç duyduğu için, bir klasör\noluşturarak bütün gereksinim duyduğu yapıları klasör içerisinde tanımlayalım.";
    			t398 = space();
    			ul9 = element("ul");
    			li18 = element("li");
    			code12 = element("code");
    			code12.textContent = "Avatar/";
    			t400 = space();
    			li19 = element("li");
    			code13 = element("code");
    			code13.textContent = "+ User > Avatar > Avatars.svelte, ImageAvatar.svelte";
    			t402 = space();
    			li20 = element("li");
    			code14 = element("code");
    			code14.textContent = "+ public > assets > images > pasa.jpg, sabuha.jpg, mohito.jpg, limon.jpg, susi.jpg";
    			t404 = space();
    			li21 = element("li");
    			a5 = element("a");
    			a5.textContent = "images";
    			t406 = space();
    			p67 = element("p");
    			em70 = element("em");
    			em70.textContent = "Avatars.svelte";
    			t408 = space();
    			em71 = element("em");
    			em71.textContent = "Userground.svelte";
    			t410 = text(" içerisinde çağıralım. ");
    			em72 = element("em");
    			em72.textContent = "Avatars.svelte";
    			t412 = text(",\n");
    			em73 = element("em");
    			em73.textContent = "ImageAvatar.svelte";
    			t414 = text(" bir kapsayıcı görevi görecek. Bununla birlikte\n");
    			em74 = element("em");
    			em74.textContent = "ImageAvatar.svelte";
    			t416 = text(" componentine data gönderecek.");
    			t417 = space();
    			p68 = element("p");
    			em75 = element("em");
    			em75.textContent = "User > Avatar > Avatars.svelte";
    			t419 = space();
    			div10 = element("div");
    			pre30 = element("pre");

    			pre30.textContent = `${`\<script>
  // avatar list
  let sabuha = "/asset/images/sabuha.jpg";
  let pasa = "/asset/images/pasa.jpg";
</script>`}`;

    			t421 = space();
    			pre31 = element("pre");

    			pre31.textContent = `${`\
<div class="avatars">
  <img src={sabuha} alt="" />
  <img src={pasa} alt="" />
</div>
`}`;

    			t423 = space();
    			pre32 = element("pre");

    			pre32.textContent = `${`\<style>
 img {
    width: 100px;
  }
</style>`}`;

    			t425 = space();
    			p69 = element("p");
    			em76 = element("em");
    			em76.textContent = "Avatars";
    			t427 = text(", ");
    			em77 = element("em");
    			em77.textContent = "Userground";
    			t429 = text(" üzerinde çağırdığımda karşıma bu iki güzellik gelecek.");
    			t430 = space();
    			p70 = element("p");
    			img12 = element("img");
    			t431 = space();
    			p71 = element("p");
    			em78 = element("em");
    			em78.textContent = "Avatars";
    			t433 = text(" biraz daha işlevli bir yapıya büründürelim.");
    			t434 = space();
    			p72 = element("p");
    			em79 = element("em");
    			em79.textContent = "User > Avatar > Avatars.svelte";
    			t436 = space();
    			div11 = element("div");
    			pre33 = element("pre");

    			pre33.textContent = `${`\<script>
  \import ImageAvatar from "./ImageAvatar.svelte";

// avatar list
let sabuha = "/asset/images/sabuha.jpg";
let mohito = "/asset/images/mohito.jpg";
let pasa = "/asset/images/pasa.jpg";
let susi = "/asset/images/susi.jpg";
let limon = "/asset/images/limon.jpg";

const avatars = [pasa, mohito, sabuha, limon, susi];
</script>`}`;

    			t438 = space();
    			pre34 = element("pre");

    			pre34.textContent = `${`\
<div class="avatars">
 { #each avatars as avatar}
    <ImageAvatar {avatar} />
{ /each}

</div>
`}`;

    			t440 = space();
    			pre35 = element("pre");

    			pre35.textContent = `${`\<style>
 .avatars {
    display: flex;
    justify-content: center;
  }
</style>`}`;

    			t442 = space();
    			p73 = element("p");
    			t443 = text("Oluşturduğumuz ");
    			code15 = element("code");
    			code15.textContent = "avatars";
    			t445 = text(" dizisine ait her elemana ");
    			em80 = element("em");
    			em80.textContent = "html";
    			t447 = text(" üzerinde #each\ndöngüsünde erişiyoruz. Erişilen her elemanının bilgisini ");
    			em81 = element("em");
    			em81.textContent = "ImageAvatar";
    			t449 = text("\ncomponentine aktarıyoruz. Componente aktarılan bu değerlerle birlikte,\ndizi içerisinde bulunan her elamanın görüntüsünü elde edeceğiz.");
    			t450 = space();
    			p74 = element("p");
    			em82 = element("em");
    			em82.textContent = "User > Avatar > ImageAvatar.svelte";
    			t452 = space();
    			div12 = element("div");
    			pre36 = element("pre");

    			pre36.textContent = `${`\<script>
  \export let avatar;
</script>`}`;

    			t454 = space();
    			pre37 = element("pre");

    			pre37.textContent = `${`\
<img src={avatar} class="avatar unpicked" alt="avatar" />
`}`;

    			t456 = space();
    			pre38 = element("pre");

    			pre38.textContent = `${`\<style>
  .avatar {
    width: 100px;
    border-radius: 100px;
    justify-content: space-around;
    margin: 0 25px 15px 0;
    border: 2px solid #fff;
    box-shadow: 0px 0px 3px black;
    border: 2px solid whitesmoke;
  }
  
  .avatar:hover {
    opacity: 1;
    cursor: pointer;
  }
  
  .unpicked {
    opacity: 0.8;
  }
  
  .picked {
    opacity: 1;
  }
</style>`}`;

    			t458 = space();
    			p75 = element("p");
    			p75.textContent = "Daha güzel bir görüntüyü hak ettik. Avatarlar üzerinde CSS ile biraz\ndüzenlemeler yapmamız gerekti.";
    			t460 = space();
    			p76 = element("p");
    			img13 = element("img");
    			t461 = space();
    			h37 = element("h3");
    			h37.textContent = "🎈 Name Component";
    			t463 = space();
    			p77 = element("p");
    			p77.textContent = "Pokemon eğitmenimizin bir isim girebilmesi için gerekli olan componenti\noluşturalım.";
    			t465 = space();
    			p78 = element("p");
    			code16 = element("code");
    			code16.textContent = "+ /User/Avatar/Name";
    			t467 = space();
    			p79 = element("p");
    			code17 = element("code");
    			code17.textContent = "+ /User/Avatar/Name/UserName.svelte";
    			t469 = space();
    			p80 = element("p");
    			em83 = element("em");
    			em83.textContent = "User > Avatar > Name > UserName.svelte";
    			t471 = space();
    			div13 = element("div");
    			pre39 = element("pre");
    			pre39.textContent = `${`\<script></script>`}`;
    			t473 = space();
    			pre40 = element("pre");

    			pre40.textContent = `${`\
<div class="user">
  <input type="text" class="name" name="name" placeholder="pika pika" />
</div>
`}`;

    			t475 = space();
    			pre41 = element("pre");

    			pre41.textContent = `${`\<style>
   .name {
    width: 40%;
    border-radius: 20px;
    text-align: center;
    margin-bottom: 30px;
    padding: 8px 0;
  }
</style>`}`;

    			t477 = space();
    			p81 = element("p");
    			t478 = text("Diğer componentlerde yaptığımız gibi, ");
    			em84 = element("em");
    			em84.textContent = "UserName";
    			t480 = text(" componentinin ");
    			em85 = element("em");
    			em85.textContent = "Userground";
    			t482 = text("\ncomponentinde kullanalım.");
    			t483 = space();
    			p82 = element("p");
    			t484 = text("Geriye son bir componentimiz kaldı. \"Start\" yazısına sahip bir buton\ncomponentini oluşturarak, ");
    			em86 = element("em");
    			em86.textContent = "User";
    			t486 = text(" klasöründe ");
    			em87 = element("em");
    			em87.textContent = "Start.svelte";
    			t488 = text(" ismiyle kaydedererek\n");
    			em88 = element("em");
    			em88.textContent = "UserGround";
    			t490 = text(" componentinde çağıralım.");
    			t491 = space();
    			p83 = element("p");
    			p83.textContent = "Ta daaaa... Şuana kadar yaptığımız componentler dinamik işlemler\ngerçekleştirmedi. Arayüzü oluşturmak için yeteri kadar malzememiz ortaya çıktı,\nve bunları istediğin gibi stillendirebilirsin. Bundan sonraki aşamalarda bu\ncomponentlara dinamik özellikler kazandıracağız.";
    			t493 = space();
    			p84 = element("p");
    			img14 = element("img");
    			t494 = space();
    			h211 = element("h2");
    			h211.textContent = "🪁 Oyun Gereksinimleri";
    			t496 = space();
    			span7 = element("span");
    			t497 = space();
    			span8 = element("span");
    			t498 = space();
    			h212 = element("h2");
    			h212.textContent = "GitHub Pages ile Deploy";
    			t500 = space();
    			h213 = element("h2");
    			h213.textContent = "Kaynak";
    			t502 = space();
    			ul10 = element("ul");
    			li22 = element("li");
    			p85 = element("p");
    			p85.textContent = "Svelte nedir?";
    			t504 = space();
    			li23 = element("li");
    			p86 = element("p");
    			a6 = element("a");
    			a6.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t506 = space();
    			li24 = element("li");
    			p87 = element("p");
    			p87.textContent = "Svelte Documentation:";
    			t508 = space();
    			li25 = element("li");
    			p88 = element("p");
    			a7 = element("a");
    			a7.textContent = "https://svelte.dev/examples/hello-world";
    			t510 = space();
    			li26 = element("li");
    			p89 = element("p");
    			a8 = element("a");
    			a8.textContent = "https://svelte.dev/tutorial/basics";
    			t512 = space();
    			li27 = element("li");
    			p90 = element("p");
    			a9 = element("a");
    			a9.textContent = "https://svelte.dev/docs";
    			t514 = space();
    			li28 = element("li");
    			p91 = element("p");
    			a10 = element("a");
    			a10.textContent = "https://svelte.dev/blog";
    			t516 = space();
    			li29 = element("li");
    			p92 = element("p");
    			a11 = element("a");
    			a11.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t518 = space();
    			ul11 = element("ul");
    			li30 = element("li");
    			li30.textContent = "Svelte Projesi Oluşturma";
    			t520 = space();
    			ul12 = element("ul");
    			li31 = element("li");
    			p93 = element("p");
    			a12 = element("a");
    			a12.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript";
    			t522 = space();
    			li32 = element("li");
    			p94 = element("p");
    			p94.textContent = "Bağımlılıklar";
    			t524 = space();
    			li33 = element("li");
    			p95 = element("p");
    			a13 = element("a");
    			a13.textContent = "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/";
    			t526 = space();
    			ul13 = element("ul");
    			li34 = element("li");
    			li34.textContent = "Deploy:";
    			t528 = space();
    			ul14 = element("ul");
    			li35 = element("li");
    			a14 = element("a");
    			a14.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next";
    			t530 = space();
    			ul15 = element("ul");
    			li36 = element("li");
    			li36.textContent = "md files importing";
    			t532 = space();
    			ul16 = element("ul");
    			li37 = element("li");
    			a15 = element("a");
    			a15.textContent = "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project";
    			t534 = space();
    			ul17 = element("ul");
    			li38 = element("li");
    			li38.textContent = "Component Communications";
    			t536 = space();
    			ul18 = element("ul");
    			li39 = element("li");
    			a16 = element("a");
    			a16.textContent = "https://betterprogramming.pub/6-ways-to-do-component-communications-in-svelte-b3f2a483913c";
    			t538 = space();
    			li40 = element("li");
    			a17 = element("a");
    			a17.textContent = "https://livebook.manning.com/book/svelte-and-sapper-in-action/chapter-5/v-3/";
    			t540 = space();
    			pre42 = element("pre");
    			code18 = element("code");
    			code18.textContent = "\n";
    			t542 = space();
    			p96 = element("p");
    			p96.textContent = ":check en file:";
    			attr_dev(span0, "id", "selam-sana");
    			add_location(span0, file$4, 0, 0, 0);
    			add_location(h20, file$4, 1, 0, 30);
    			add_location(em0, file$4, 5, 50, 335);
    			attr_dev(a0, "href", "https://svelte.dev/docs");
    			attr_dev(a0, "title", "Svelte Documentation");
    			add_location(a0, file$4, 9, 1, 591);
    			attr_dev(a1, "href", "https://svelte.dev/examples/hello-world");
    			attr_dev(a1, "title", "Svelte Examples");
    			add_location(a1, file$4, 10, 0, 664);
    			add_location(p0, file$4, 2, 0, 55);
    			if (!src_url_equal(img0.src, img0_src_value = "./assets/squirtle-squad.webp")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Svelte definition variable");
    			set_style(img0, "width", "900px");
    			add_location(img0, file$4, 13, 18, 864);
    			attr_dev(p1, "align", "center");
    			add_location(p1, file$4, 13, 0, 846);
    			add_location(p2, file$4, 15, 0, 968);
    			attr_dev(span1, "id", "proje-hakkinda");
    			add_location(span1, file$4, 19, 0, 1215);
    			add_location(h21, file$4, 20, 0, 1249);
    			add_location(p3, file$4, 21, 0, 1275);
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/playground.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "view of cards on the playground");
    			attr_dev(img1, "title", "view of cards on the playground");
    			set_style(img1, "width", "900px");
    			add_location(img1, file$4, 28, 18, 1827);
    			attr_dev(p4, "align", "center");
    			add_location(p4, file$4, 28, 0, 1809);
    			add_location(em1, file$4, 33, 37, 2247);
    			add_location(em2, file$4, 35, 12, 2381);
    			add_location(p5, file$4, 30, 0, 1972);
    			attr_dev(span2, "id", "svelte-nedir");
    			add_location(span2, file$4, 37, 0, 2482);
    			add_location(h22, file$4, 38, 0, 2514);
    			add_location(em3, file$4, 45, 32, 3026);
    			add_location(p6, file$4, 39, 0, 2540);
    			attr_dev(a2, "href", "https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks");
    			attr_dev(a2, "title", "Stack Overflow Developer Survey 2021");
    			add_location(a2, file$4, 49, 3, 3323);
    			add_location(p7, file$4, 49, 0, 3320);
    			add_location(h23, file$4, 51, 0, 3627);
    			add_location(p8, file$4, 52, 0, 3654);
    			add_location(code0, file$4, 56, 4, 3833);
    			add_location(li0, file$4, 57, 0, 3863);
    			add_location(ul0, file$4, 56, 29, 3858);
    			add_location(li1, file$4, 56, 0, 3829);
    			add_location(code1, file$4, 60, 4, 3916);
    			add_location(em4, file$4, 61, 4, 3951);
    			add_location(li2, file$4, 61, 0, 3947);
    			add_location(ul1, file$4, 60, 30, 3942);
    			add_location(li3, file$4, 60, 0, 3912);
    			add_location(code2, file$4, 64, 4, 4014);
    			add_location(em5, file$4, 65, 4, 4043);
    			add_location(li4, file$4, 65, 0, 4039);
    			add_location(ul2, file$4, 64, 24, 4034);
    			add_location(li5, file$4, 64, 0, 4010);
    			add_location(code3, file$4, 68, 4, 4101);
    			add_location(em6, file$4, 69, 4, 4169);
    			add_location(li6, file$4, 69, 0, 4165);
    			add_location(ul3, file$4, 68, 63, 4160);
    			add_location(li7, file$4, 68, 0, 4097);
    			add_location(code4, file$4, 72, 4, 4265);
    			add_location(em7, file$4, 73, 4, 4312);
    			add_location(em8, file$4, 73, 37, 4345);
    			add_location(li8, file$4, 73, 0, 4308);
    			add_location(ul4, file$4, 72, 42, 4303);
    			add_location(li9, file$4, 72, 0, 4261);
    			add_location(code5, file$4, 76, 4, 4410);
    			add_location(em9, file$4, 77, 4, 4490);
    			add_location(em10, file$4, 77, 63, 4549);
    			add_location(em11, file$4, 77, 82, 4568);
    			add_location(li10, file$4, 77, 0, 4486);
    			add_location(ul5, file$4, 76, 75, 4481);
    			add_location(li11, file$4, 76, 0, 4406);
    			add_location(ul6, file$4, 55, 0, 3824);
    			attr_dev(span3, "id", "svelte-projesi-olusturma");
    			add_location(span3, file$4, 82, 0, 4634);
    			add_location(h24, file$4, 83, 0, 4678);
    			add_location(p9, file$4, 84, 0, 4715);
    			html_tag.a = t74;
    			add_location(p10, file$4, 86, 0, 4776);
    			html_tag_1.a = t77;
    			add_location(p11, file$4, 89, 0, 4936);
    			html_tag_2.a = t80;
    			add_location(p12, file$4, 91, 0, 5033);
    			if (!src_url_equal(img2.src, img2_src_value = "./assets/console-logs.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Port where Svelte is running on the console");
    			attr_dev(img2, "title", "Port where Svelte is running on the console");
    			add_location(img2, file$4, 95, 18, 5342);
    			attr_dev(p13, "align", "center");
    			add_location(p13, file$4, 95, 0, 5324);
    			attr_dev(span4, "id", "svelte-nasil-calisir");
    			add_location(span4, file$4, 98, 0, 5496);
    			add_location(h25, file$4, 99, 0, 5536);
    			add_location(em12, file$4, 100, 22, 5592);
    			add_location(em13, file$4, 101, 7, 5670);
    			add_location(p14, file$4, 100, 0, 5570);
    			add_location(p15, file$4, 103, 0, 5766);
    			if (!src_url_equal(img3.src, img3_src_value = "./assets/build-map.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Svelte Build map");
    			set_style(img3, "width", "800px");
    			add_location(img3, file$4, 107, 18, 6016);
    			attr_dev(p16, "align", "center");
    			add_location(p16, file$4, 107, 0, 5998);
    			attr_dev(span5, "id", "bagimliliklar");
    			add_location(span5, file$4, 108, 0, 6100);
    			add_location(h26, file$4, 109, 0, 6133);
    			add_location(h40, file$4, 111, 4, 6175);
    			add_location(em14, file$4, 114, 9, 6351);
    			add_location(em15, file$4, 114, 71, 6413);
    			add_location(li12, file$4, 111, 0, 6171);
    			add_location(h41, file$4, 116, 4, 6461);
    			add_location(li13, file$4, 116, 0, 6457);
    			add_location(ul7, file$4, 110, 0, 6166);
    			attr_dev(span6, "id", "svelte-projesini-inceleme");
    			add_location(span6, file$4, 122, 0, 6732);
    			add_location(h27, file$4, 123, 0, 6777);
    			add_location(em16, file$4, 124, 14, 6828);
    			add_location(em17, file$4, 125, 18, 6910);
    			add_location(em18, file$4, 125, 51, 6943);
    			add_location(em19, file$4, 125, 68, 6960);
    			add_location(em20, file$4, 125, 95, 6987);
    			add_location(em21, file$4, 126, 21, 7022);
    			add_location(p17, file$4, 124, 0, 6814);
    			add_location(em22, file$4, 127, 6, 7066);
    			add_location(em23, file$4, 127, 33, 7093);
    			add_location(em24, file$4, 128, 5, 7158);
    			add_location(em25, file$4, 128, 73, 7226);
    			add_location(em26, file$4, 129, 13, 7255);
    			add_location(em27, file$4, 129, 38, 7280);
    			add_location(p18, file$4, 127, 0, 7060);
    			add_location(em28, file$4, 130, 6, 7337);
    			add_location(em29, file$4, 130, 31, 7362);
    			add_location(em30, file$4, 131, 26, 7449);
    			add_location(em31, file$4, 132, 21, 7520);
    			add_location(p19, file$4, 130, 0, 7331);
    			add_location(em32, file$4, 135, 6, 7685);
    			add_location(em33, file$4, 136, 8, 7772);
    			add_location(code6, file$4, 138, 0, 7900);
    			add_location(p20, file$4, 135, 0, 7679);
    			add_location(code7, file$4, 139, 52, 8017);
    			add_location(em34, file$4, 140, 27, 8081);
    			add_location(p21, file$4, 139, 0, 7965);
    			add_location(h28, file$4, 142, 0, 8197);
    			add_location(p22, file$4, 143, 0, 8222);
    			add_location(em35, file$4, 145, 3, 8384);
    			add_location(em36, file$4, 145, 34, 8415);
    			add_location(em37, file$4, 146, 46, 8520);
    			attr_dev(a3, "href", "https://youtube.com/shorts/oyIO1_8uNPc");
    			attr_dev(a3, "title", "senin kocaman kalbin <33");
    			add_location(a3, file$4, 149, 43, 8755);
    			add_location(p23, file$4, 145, 0, 8381);
    			add_location(h30, file$4, 151, 0, 8876);
    			add_location(p24, file$4, 152, 0, 8905);
    			add_location(em38, file$4, 155, 3, 9113);
    			add_location(p25, file$4, 155, 0, 9110);
    			set_style(pre0, "border", "none");
    			attr_dev(pre0, "class", "prettyprint lang-js");
    			add_location(pre0, file$4, 156, 112, 9249);
    			set_style(pre1, "border", "none");
    			attr_dev(pre1, "class", "prettyprint lang-html");
    			add_location(pre1, file$4, 159, 0, 9361);
    			set_style(pre2, "border", "none");
    			attr_dev(pre2, "class", "prettyprint lang-css");
    			add_location(pre2, file$4, 162, 0, 9469);
    			attr_dev(div0, "class", "code-wrapper");
    			set_style(div0, "padding", "0 10px");
    			set_style(div0, "margin", "0 30px");
    			set_style(div0, "border", "2px dashed #ff3e00");
    			set_style(div0, "background", "#fff");
    			add_location(div0, file$4, 156, 0, 9137);
    			add_location(em39, file$4, 168, 29, 9630);
    			add_location(em40, file$4, 169, 0, 9690);
    			add_location(em41, file$4, 170, 0, 9768);
    			add_location(em42, file$4, 170, 26, 9794);
    			add_location(p26, file$4, 168, 0, 9601);
    			add_location(em43, file$4, 172, 3, 9940);
    			add_location(p27, file$4, 172, 0, 9937);
    			set_style(pre3, "border", "none");
    			attr_dev(pre3, "class", "prettyprint lang-js");
    			add_location(pre3, file$4, 174, 49, 10080);
    			set_style(pre4, "border", "none");
    			attr_dev(pre4, "class", "prettyprint lang-html");
    			add_location(pre4, file$4, 177, 0, 10192);
    			set_style(pre5, "border", "none");
    			attr_dev(pre5, "class", "prettyprint lang-css");
    			add_location(pre5, file$4, 180, 0, 10344);
    			attr_dev(div1, "class", "code-wrapper");
    			set_style(div1, "padding", "0 10px");
    			set_style(div1, "margin", "0 30px");
    			set_style(div1, "border", "2px dashed #ff3e00");
    			set_style(div1, "background", "#fff");
    			add_location(div1, file$4, 173, 0, 9964);
    			add_location(em44, file$4, 182, 3, 10437);
    			add_location(p28, file$4, 182, 0, 10434);
    			add_location(h31, file$4, 185, 0, 10654);
    			add_location(p29, file$4, 186, 0, 10686);
    			add_location(em45, file$4, 188, 3, 10818);
    			add_location(p30, file$4, 188, 0, 10815);
    			set_style(pre6, "border", "none");
    			attr_dev(pre6, "class", "prettyprint lang-js");
    			add_location(pre6, file$4, 190, 48, 10957);
    			set_style(pre7, "border", "none");
    			attr_dev(pre7, "class", "prettyprint lang-html");
    			add_location(pre7, file$4, 197, 0, 11151);
    			set_style(pre8, "border", "none");
    			attr_dev(pre8, "class", "prettyprint lang-css");
    			add_location(pre8, file$4, 204, 0, 11322);
    			attr_dev(div2, "class", "code-wrapper");
    			set_style(div2, "padding", "0 10px");
    			set_style(div2, "margin", "0 30px");
    			set_style(div2, "border", "2px dashed #ff3e00");
    			set_style(div2, "background", "white");
    			add_location(div2, file$4, 189, 0, 10842);
    			add_location(em46, file$4, 231, 18, 11826);
    			add_location(p31, file$4, 231, 0, 11808);
    			if (!src_url_equal(img4.src, img4_src_value = "./assets/gif/reactive.gif")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Svelte definition variable");
    			set_style(img4, "width", "800px");
    			add_location(img4, file$4, 233, 18, 11966);
    			attr_dev(p32, "align", "center");
    			add_location(p32, file$4, 233, 0, 11948);
    			add_location(h32, file$4, 235, 0, 12067);
    			add_location(p33, file$4, 236, 0, 12099);
    			if (!src_url_equal(img5.src, img5_src_value = "./assets/components/component-with-sabuha.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Svelte Build map");
    			set_style(img5, "width", "900px");
    			add_location(img5, file$4, 239, 18, 12340);
    			attr_dev(p34, "align", "center");
    			add_location(p34, file$4, 239, 0, 12322);
    			add_location(p35, file$4, 241, 0, 12449);
    			add_location(code8, file$4, 243, 3, 12553);
    			add_location(code9, file$4, 243, 46, 12596);
    			add_location(code10, file$4, 244, 23, 12675);
    			add_location(p36, file$4, 243, 0, 12550);
    			add_location(em47, file$4, 245, 3, 12729);
    			add_location(p37, file$4, 245, 0, 12726);
    			set_style(pre9, "border", "none");
    			attr_dev(pre9, "class", "prettyprint lang-js");
    			add_location(pre9, file$4, 247, 48, 12906);
    			set_style(pre10, "border", "none");
    			attr_dev(pre10, "class", "prettyprint lang-html");
    			add_location(pre10, file$4, 254, 0, 13100);
    			set_style(pre11, "border", "none");
    			attr_dev(pre11, "class", "prettyprint lang-css");
    			add_location(pre11, file$4, 261, 0, 13299);
    			attr_dev(div3, "class", "code-wrapper");
    			set_style(div3, "padding", "0 10px");
    			set_style(div3, "margin", "0 30px");
    			set_style(div3, "border", "2px dashed #ff3e00");
    			set_style(div3, "background", "white");
    			add_location(div3, file$4, 246, 0, 12791);
    			add_location(code11, file$4, 289, 3, 13812);
    			add_location(p38, file$4, 289, 0, 13809);
    			add_location(em48, file$4, 291, 3, 13912);
    			add_location(p39, file$4, 291, 0, 13909);
    			set_style(pre12, "border", "none");
    			attr_dev(pre12, "class", "prettyprint lang-js");
    			add_location(pre12, file$4, 293, 48, 14051);
    			set_style(pre13, "border", "none");
    			attr_dev(pre13, "class", "prettyprint lang-html");
    			add_location(pre13, file$4, 296, 0, 14225);
    			set_style(pre14, "border", "none");
    			attr_dev(pre14, "class", "prettyprint lang-css");
    			add_location(pre14, file$4, 305, 0, 14397);
    			attr_dev(div4, "class", "code-wrapper");
    			set_style(div4, "padding", "0 10px");
    			set_style(div4, "margin", "0 30px");
    			set_style(div4, "border", "2px dashed #ff3e00");
    			set_style(div4, "background", "white");
    			add_location(div4, file$4, 292, 0, 13936);
    			if (!src_url_equal(img6.src, img6_src_value = "./assets/components/random-number-component.gif")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Svelte Build map");
    			set_style(img6, "width", "900px");
    			add_location(img6, file$4, 308, 18, 14507);
    			attr_dev(p40, "align", "center");
    			add_location(p40, file$4, 308, 0, 14489);
    			add_location(h33, file$4, 310, 0, 14620);
    			if (!src_url_equal(img7.src, img7_src_value = "./assets/communication-is-key.jpg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "Svelte Build map");
    			set_style(img7, "width", "500px");
    			add_location(img7, file$4, 311, 18, 14678);
    			attr_dev(p41, "align", "center");
    			add_location(p41, file$4, 311, 0, 14660);
    			add_location(p42, file$4, 313, 0, 14777);
    			add_location(h42, file$4, 318, 0, 15131);
    			add_location(p43, file$4, 319, 0, 15151);
    			add_location(h43, file$4, 323, 0, 15446);
    			add_location(p44, file$4, 324, 0, 15466);
    			add_location(h44, file$4, 327, 0, 15651);
    			add_location(p45, file$4, 328, 0, 15673);
    			add_location(h45, file$4, 332, 0, 15931);
    			add_location(p46, file$4, 333, 0, 15960);
    			add_location(h46, file$4, 337, 0, 16240);
    			add_location(p47, file$4, 338, 0, 16260);
    			add_location(h29, file$4, 341, 0, 16451);
    			add_location(h210, file$4, 342, 0, 16480);
    			attr_dev(a4, "href", "#svelte-projesi-olusturma");
    			attr_dev(a4, "title", "Yeni bir Svelte Projesi oluştur");
    			add_location(a4, file$4, 347, 24, 16846);
    			add_location(em49, file$4, 349, 0, 17022);
    			add_location(em50, file$4, 349, 42, 17064);
    			add_location(p48, file$4, 343, 0, 16503);
    			if (!src_url_equal(img8.src, img8_src_value = "./assets/start-folder.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "Svelte Build map");
    			set_style(img8, "width", "900px");
    			add_location(img8, file$4, 351, 18, 17157);
    			attr_dev(p49, "align", "center");
    			add_location(p49, file$4, 351, 0, 17139);
    			add_location(h34, file$4, 353, 0, 17249);
    			add_location(em51, file$4, 354, 3, 17279);
    			add_location(em52, file$4, 354, 72, 17348);
    			add_location(em53, file$4, 355, 0, 17367);
    			add_location(em54, file$4, 355, 54, 17421);
    			add_location(em55, file$4, 357, 0, 17522);
    			add_location(p50, file$4, 354, 0, 17276);
    			add_location(em56, file$4, 359, 3, 17642);
    			add_location(em57, file$4, 361, 0, 17788);
    			add_location(em58, file$4, 361, 28, 17816);
    			add_location(p51, file$4, 359, 0, 17639);
    			add_location(em59, file$4, 364, 28, 18002);
    			add_location(p52, file$4, 363, 0, 17892);
    			add_location(em60, file$4, 366, 3, 18087);
    			add_location(p53, file$4, 366, 0, 18084);
    			set_style(pre15, "border", "none");
    			attr_dev(pre15, "class", "prettyprint lang-js");
    			add_location(pre15, file$4, 368, 48, 18243);
    			set_style(pre16, "border", "none");
    			attr_dev(pre16, "class", "prettyprint lang-html");
    			add_location(pre16, file$4, 371, 0, 18364);
    			set_style(pre17, "border", "none");
    			attr_dev(pre17, "class", "prettyprint lang-css");
    			add_location(pre17, file$4, 377, 0, 18496);
    			attr_dev(div5, "class", "code-wrapper");
    			set_style(div5, "padding", "0 10px");
    			set_style(div5, "margin", "0 30px");
    			set_style(div5, "border", "2px dashed #ff3e00");
    			set_style(div5, "background", "white");
    			add_location(div5, file$4, 367, 0, 18128);
    			add_location(em61, file$4, 385, 3, 18682);
    			add_location(p54, file$4, 385, 0, 18679);
    			set_style(pre18, "border", "none");
    			attr_dev(pre18, "class", "prettyprint lang-js");
    			add_location(pre18, file$4, 387, 48, 18857);
    			set_style(pre19, "border", "none");
    			attr_dev(pre19, "class", "prettyprint lang-html");
    			add_location(pre19, file$4, 390, 0, 19002);
    			set_style(pre20, "border", "none");
    			attr_dev(pre20, "class", "prettyprint lang-css");
    			add_location(pre20, file$4, 396, 0, 19113);
    			attr_dev(div6, "class", "code-wrapper");
    			set_style(div6, "padding", "0 10px");
    			set_style(div6, "margin", "0 30px");
    			set_style(div6, "border", "2px dashed #ff3e00");
    			set_style(div6, "background", "white");
    			add_location(div6, file$4, 386, 0, 18742);
    			add_location(em62, file$4, 404, 3, 19299);
    			add_location(p55, file$4, 404, 0, 19296);
    			if (!src_url_equal(img9.src, img9_src_value = "./assets/components/User/call-user-component.png")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "Call User Component");
    			set_style(img9, "width", "800px");
    			add_location(img9, file$4, 405, 18, 19403);
    			attr_dev(p56, "align", "center");
    			add_location(p56, file$4, 405, 0, 19385);
    			add_location(p57, file$4, 407, 0, 19521);
    			add_location(li14, file$4, 409, 0, 19579);
    			add_location(li15, file$4, 410, 0, 19632);
    			add_location(li16, file$4, 411, 0, 19710);
    			add_location(li17, file$4, 412, 0, 19760);
    			add_location(ul8, file$4, 408, 0, 19574);
    			if (!src_url_equal(img10.src, img10_src_value = "./assets/components/User/components-section.png")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "Call User Component");
    			set_style(img10, "width", "900px");
    			add_location(img10, file$4, 415, 18, 19874);
    			attr_dev(p58, "align", "center");
    			add_location(p58, file$4, 415, 0, 19856);
    			add_location(h35, file$4, 417, 0, 19992);
    			add_location(em63, file$4, 418, 24, 20045);
    			add_location(em64, file$4, 419, 44, 20149);
    			add_location(em65, file$4, 420, 0, 20185);
    			add_location(em66, file$4, 421, 0, 20258);
    			add_location(p59, file$4, 418, 0, 20021);
    			add_location(em67, file$4, 423, 3, 20361);
    			add_location(p60, file$4, 423, 0, 20358);
    			set_style(pre21, "border", "none");
    			attr_dev(pre21, "class", "prettyprint lang-js");
    			add_location(pre21, file$4, 425, 48, 20513);
    			set_style(pre22, "border", "none");
    			attr_dev(pre22, "class", "prettyprint lang-html");
    			add_location(pre22, file$4, 426, 0, 20597);
    			set_style(pre23, "border", "none");
    			attr_dev(pre23, "class", "prettyprint lang-css");
    			add_location(pre23, file$4, 432, 0, 20759);
    			attr_dev(div7, "class", "code-wrapper");
    			set_style(div7, "padding", "0 10px");
    			set_style(div7, "margin", "0 30px");
    			set_style(div7, "border", "2px dashed #ff3e00");
    			set_style(div7, "background", "white");
    			add_location(div7, file$4, 424, 0, 20398);
    			add_location(em68, file$4, 440, 3, 20956);
    			add_location(p61, file$4, 440, 0, 20953);
    			set_style(pre24, "border", "none");
    			attr_dev(pre24, "class", "prettyprint lang-js");
    			add_location(pre24, file$4, 442, 48, 21112);
    			set_style(pre25, "border", "none");
    			attr_dev(pre25, "class", "prettyprint lang-html");
    			add_location(pre25, file$4, 445, 0, 21240);
    			set_style(pre26, "border", "none");
    			attr_dev(pre26, "class", "prettyprint lang-css");
    			add_location(pre26, file$4, 451, 0, 21346);
    			attr_dev(div8, "class", "code-wrapper");
    			set_style(div8, "padding", "0 10px");
    			set_style(div8, "margin", "0 30px");
    			set_style(div8, "border", "2px dashed #ff3e00");
    			set_style(div8, "background", "white");
    			add_location(div8, file$4, 441, 0, 20997);
    			if (!src_url_equal(img11.src, img11_src_value = "./assets/components/User/header-component.png")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "Call User Component");
    			set_style(img11, "width", "900px");
    			add_location(img11, file$4, 459, 18, 21555);
    			attr_dev(p62, "align", "center");
    			add_location(p62, file$4, 459, 0, 21537);
    			add_location(p63, file$4, 461, 0, 21671);
    			add_location(em69, file$4, 462, 3, 21737);
    			add_location(p64, file$4, 462, 0, 21734);
    			set_style(pre27, "border", "none");
    			attr_dev(pre27, "class", "prettyprint lang-js");
    			add_location(pre27, file$4, 464, 48, 21912);
    			set_style(pre28, "border", "none");
    			attr_dev(pre28, "class", "prettyprint lang-html");
    			add_location(pre28, file$4, 467, 0, 22057);
    			set_style(pre29, "border", "none");
    			attr_dev(pre29, "class", "prettyprint lang-css");
    			add_location(pre29, file$4, 473, 0, 22187);
    			attr_dev(div9, "class", "code-wrapper");
    			set_style(div9, "padding", "0 10px");
    			set_style(div9, "margin", "0 30px");
    			set_style(div9, "border", "2px dashed #ff3e00");
    			set_style(div9, "background", "white");
    			add_location(div9, file$4, 463, 0, 21797);
    			add_location(p65, file$4, 481, 0, 22366);
    			add_location(h36, file$4, 482, 0, 22434);
    			add_location(p66, file$4, 483, 0, 22463);
    			add_location(code12, file$4, 486, 4, 22636);
    			add_location(li18, file$4, 486, 0, 22632);
    			add_location(code13, file$4, 487, 4, 22666);
    			add_location(li19, file$4, 487, 0, 22662);
    			add_location(code14, file$4, 488, 4, 22747);
    			add_location(li20, file$4, 488, 0, 22743);
    			attr_dev(a5, "href", "https://github.com/kahilkubilay/remember-em-all/tree/master/public/images");
    			attr_dev(a5, "title", "Images link");
    			add_location(a5, file$4, 489, 4, 22861);
    			add_location(li21, file$4, 489, 0, 22857);
    			add_location(ul9, file$4, 485, 0, 22627);
    			add_location(em70, file$4, 491, 3, 22990);
    			add_location(em71, file$4, 491, 27, 23014);
    			add_location(em72, file$4, 491, 76, 23063);
    			add_location(em73, file$4, 492, 0, 23088);
    			add_location(em74, file$4, 493, 0, 23163);
    			add_location(p67, file$4, 491, 0, 22987);
    			add_location(em75, file$4, 494, 3, 23228);
    			add_location(p68, file$4, 494, 0, 23225);
    			set_style(pre30, "border", "none");
    			attr_dev(pre30, "class", "prettyprint lang-js");
    			add_location(pre30, file$4, 496, 48, 23393);
    			set_style(pre31, "border", "none");
    			attr_dev(pre31, "class", "prettyprint lang-html");
    			add_location(pre31, file$4, 501, 0, 23581);
    			set_style(pre32, "border", "none");
    			attr_dev(pre32, "class", "prettyprint lang-css");
    			add_location(pre32, file$4, 508, 0, 23747);
    			attr_dev(div10, "class", "code-wrapper");
    			set_style(div10, "padding", "0 10px");
    			set_style(div10, "margin", "0 30px");
    			set_style(div10, "border", "2px dashed #ff3e00");
    			set_style(div10, "background", "white");
    			add_location(div10, file$4, 495, 0, 23278);
    			add_location(em76, file$4, 514, 3, 23874);
    			add_location(em77, file$4, 514, 21, 23892);
    			add_location(p69, file$4, 514, 0, 23871);
    			if (!src_url_equal(img12.src, img12_src_value = "./assets/components/User/avatars-component.png")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "Call User Component");
    			set_style(img12, "width", "900px");
    			add_location(img12, file$4, 515, 18, 23989);
    			attr_dev(p70, "align", "center");
    			add_location(p70, file$4, 515, 0, 23971);
    			add_location(em78, file$4, 517, 3, 24109);
    			add_location(p71, file$4, 517, 0, 24106);
    			add_location(em79, file$4, 518, 3, 24177);
    			add_location(p72, file$4, 518, 0, 24174);
    			set_style(pre33, "border", "none");
    			attr_dev(pre33, "class", "prettyprint lang-js");
    			add_location(pre33, file$4, 520, 48, 24342);
    			set_style(pre34, "border", "none");
    			attr_dev(pre34, "class", "prettyprint lang-html");
    			add_location(pre34, file$4, 532, 0, 24754);
    			set_style(pre35, "border", "none");
    			attr_dev(pre35, "class", "prettyprint lang-css");
    			add_location(pre35, file$4, 541, 0, 24931);
    			attr_dev(div11, "class", "code-wrapper");
    			set_style(div11, "padding", "0 10px");
    			set_style(div11, "margin", "0 30px");
    			set_style(div11, "border", "2px dashed #ff3e00");
    			set_style(div11, "background", "white");
    			add_location(div11, file$4, 519, 0, 24227);
    			add_location(code15, file$4, 548, 18, 25109);
    			add_location(em80, file$4, 548, 64, 25155);
    			add_location(em81, file$4, 549, 57, 25241);
    			add_location(p73, file$4, 548, 0, 25091);
    			add_location(em82, file$4, 552, 3, 25404);
    			add_location(p74, file$4, 552, 0, 25401);
    			set_style(pre36, "border", "none");
    			attr_dev(pre36, "class", "prettyprint lang-js");
    			add_location(pre36, file$4, 554, 48, 25573);
    			set_style(pre37, "border", "none");
    			attr_dev(pre37, "class", "prettyprint lang-html");
    			add_location(pre37, file$4, 557, 0, 25682);
    			set_style(pre38, "border", "none");
    			attr_dev(pre38, "class", "prettyprint lang-css");
    			add_location(pre38, file$4, 561, 0, 25816);
    			attr_dev(div12, "class", "code-wrapper");
    			set_style(div12, "padding", "0 10px");
    			set_style(div12, "margin", "0 30px");
    			set_style(div12, "border", "2px dashed #ff3e00");
    			set_style(div12, "background", "white");
    			add_location(div12, file$4, 553, 0, 25458);
    			add_location(p75, file$4, 586, 0, 26285);
    			if (!src_url_equal(img13.src, img13_src_value = "./assets/components/User/user-component-end.png")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "Call User Component");
    			set_style(img13, "width", "900px");
    			add_location(img13, file$4, 588, 18, 26410);
    			attr_dev(p76, "align", "center");
    			add_location(p76, file$4, 588, 0, 26392);
    			add_location(h37, file$4, 590, 0, 26528);
    			add_location(p77, file$4, 591, 0, 26555);
    			add_location(code16, file$4, 593, 3, 26650);
    			add_location(p78, file$4, 593, 0, 26647);
    			add_location(code17, file$4, 594, 3, 26690);
    			add_location(p79, file$4, 594, 0, 26687);
    			add_location(em83, file$4, 595, 3, 26746);
    			add_location(p80, file$4, 595, 0, 26743);
    			set_style(pre39, "border", "none");
    			attr_dev(pre39, "class", "prettyprint lang-js");
    			add_location(pre39, file$4, 597, 48, 26922);
    			set_style(pre40, "border", "none");
    			attr_dev(pre40, "class", "prettyprint lang-html");
    			add_location(pre40, file$4, 598, 0, 27006);
    			set_style(pre41, "border", "none");
    			attr_dev(pre41, "class", "prettyprint lang-css");
    			add_location(pre41, file$4, 604, 0, 27183);
    			attr_dev(div13, "class", "code-wrapper");
    			set_style(div13, "padding", "0 10px");
    			set_style(div13, "margin", "0 30px");
    			set_style(div13, "border", "2px dashed #ff3e00");
    			set_style(div13, "background", "white");
    			add_location(div13, file$4, 596, 0, 26807);
    			add_location(em84, file$4, 614, 41, 27448);
    			add_location(em85, file$4, 614, 73, 27480);
    			add_location(p81, file$4, 614, 0, 27407);
    			add_location(em86, file$4, 617, 26, 27638);
    			add_location(em87, file$4, 617, 51, 27663);
    			add_location(em88, file$4, 618, 0, 27706);
    			add_location(p82, file$4, 616, 0, 27530);
    			add_location(p83, file$4, 619, 0, 27755);
    			if (!src_url_equal(img14.src, img14_src_value = "./assets/components/User/end-interface.png")) attr_dev(img14, "src", img14_src_value);
    			attr_dev(img14, "alt", "Call User Component");
    			set_style(img14, "width", "900px");
    			add_location(img14, file$4, 623, 18, 28050);
    			attr_dev(p84, "align", "center");
    			add_location(p84, file$4, 623, 0, 28032);
    			add_location(h211, file$4, 625, 0, 28163);
    			attr_dev(span7, "id", "component-ve-dizin-yapisi");
    			add_location(span7, file$4, 626, 0, 28195);
    			attr_dev(span8, "id", "github-page-ile-deploy");
    			add_location(span8, file$4, 627, 0, 28240);
    			add_location(h212, file$4, 628, 0, 28282);
    			add_location(h213, file$4, 629, 0, 28315);
    			add_location(p85, file$4, 631, 4, 28340);
    			add_location(li22, file$4, 631, 0, 28336);
    			attr_dev(a6, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a6, file$4, 633, 7, 28374);
    			add_location(p86, file$4, 633, 4, 28371);
    			add_location(li23, file$4, 633, 0, 28367);
    			add_location(p87, file$4, 635, 4, 28512);
    			add_location(li24, file$4, 635, 0, 28508);
    			attr_dev(a7, "href", "https://svelte.dev/examples/hello-world");
    			add_location(a7, file$4, 637, 7, 28554);
    			add_location(p88, file$4, 637, 4, 28551);
    			add_location(li25, file$4, 637, 0, 28547);
    			attr_dev(a8, "href", "https://svelte.dev/tutorial/basics");
    			add_location(a8, file$4, 639, 7, 28665);
    			add_location(p89, file$4, 639, 4, 28662);
    			add_location(li26, file$4, 639, 0, 28658);
    			attr_dev(a9, "href", "https://svelte.dev/docs");
    			add_location(a9, file$4, 641, 7, 28766);
    			add_location(p90, file$4, 641, 4, 28763);
    			add_location(li27, file$4, 641, 0, 28759);
    			attr_dev(a10, "href", "https://svelte.dev/blog");
    			add_location(a10, file$4, 643, 7, 28845);
    			add_location(p91, file$4, 643, 4, 28842);
    			add_location(li28, file$4, 643, 0, 28838);
    			attr_dev(a11, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a11, file$4, 645, 7, 28924);
    			add_location(p92, file$4, 645, 4, 28921);
    			add_location(li29, file$4, 645, 0, 28917);
    			add_location(ul10, file$4, 630, 0, 28331);
    			add_location(li30, file$4, 649, 0, 29069);
    			add_location(ul11, file$4, 648, 0, 29064);
    			attr_dev(a12, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript");
    			add_location(a12, file$4, 652, 7, 29121);
    			add_location(p93, file$4, 652, 4, 29118);
    			add_location(li31, file$4, 652, 0, 29114);
    			add_location(p94, file$4, 654, 4, 29383);
    			add_location(li32, file$4, 654, 0, 29379);
    			attr_dev(a13, "href", "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/");
    			add_location(a13, file$4, 656, 7, 29417);
    			add_location(p95, file$4, 656, 4, 29414);
    			add_location(li33, file$4, 656, 0, 29410);
    			add_location(ul12, file$4, 651, 0, 29109);
    			add_location(li34, file$4, 660, 0, 29576);
    			add_location(ul13, file$4, 659, 0, 29571);
    			attr_dev(a14, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next");
    			add_location(a14, file$4, 663, 4, 29608);
    			add_location(li35, file$4, 663, 0, 29604);
    			add_location(ul14, file$4, 662, 0, 29599);
    			add_location(li36, file$4, 666, 0, 29882);
    			add_location(ul15, file$4, 665, 0, 29877);
    			attr_dev(a15, "href", "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project");
    			add_location(a15, file$4, 669, 4, 29925);
    			add_location(li37, file$4, 669, 0, 29921);
    			add_location(ul16, file$4, 668, 0, 29916);
    			add_location(li38, file$4, 672, 0, 30179);
    			add_location(ul17, file$4, 671, 0, 30174);
    			attr_dev(a16, "href", "https://betterprogramming.pub/6-ways-to-do-component-communications-in-svelte-b3f2a483913c");
    			add_location(a16, file$4, 675, 4, 30228);
    			add_location(li39, file$4, 675, 0, 30224);
    			attr_dev(a17, "href", "https://livebook.manning.com/book/svelte-and-sapper-in-action/chapter-5/v-3/");
    			add_location(a17, file$4, 676, 4, 30433);
    			add_location(li40, file$4, 676, 0, 30429);
    			add_location(ul18, file$4, 674, 0, 30219);
    			add_location(code18, file$4, 678, 5, 30617);
    			add_location(pre42, file$4, 678, 0, 30612);
    			add_location(p96, file$4, 680, 0, 30638);
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
    			append_dev(p0, em0);
    			append_dev(p0, t5);
    			append_dev(p0, a0);
    			append_dev(p0, t7);
    			append_dev(p0, a1);
    			append_dev(p0, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img0);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, img1);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, t20);
    			append_dev(p5, em1);
    			append_dev(p5, t22);
    			append_dev(p5, em2);
    			append_dev(p5, t24);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t29);
    			append_dev(p6, em3);
    			append_dev(p6, t31);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, a2);
    			append_dev(p7, t34);
    			insert_dev(target, t35, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t37, anchor);
    			insert_dev(target, p8, anchor);
    			insert_dev(target, t39, anchor);
    			insert_dev(target, ul6, anchor);
    			append_dev(ul6, li1);
    			append_dev(li1, code0);
    			append_dev(li1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul6, t42);
    			append_dev(ul6, li3);
    			append_dev(li3, code1);
    			append_dev(li3, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, em4);
    			append_dev(li2, t45);
    			append_dev(ul6, t46);
    			append_dev(ul6, li5);
    			append_dev(li5, code2);
    			append_dev(li5, ul2);
    			append_dev(ul2, li4);
    			append_dev(li4, em5);
    			append_dev(li4, t49);
    			append_dev(ul6, t50);
    			append_dev(ul6, li7);
    			append_dev(li7, code3);
    			append_dev(li7, ul3);
    			append_dev(ul3, li6);
    			append_dev(li6, em6);
    			append_dev(li6, t53);
    			append_dev(ul6, t54);
    			append_dev(ul6, li9);
    			append_dev(li9, code4);
    			append_dev(li9, ul4);
    			append_dev(ul4, li8);
    			append_dev(li8, em7);
    			append_dev(li8, t57);
    			append_dev(li8, em8);
    			append_dev(li8, t59);
    			append_dev(ul6, t60);
    			append_dev(ul6, li11);
    			append_dev(li11, code5);
    			append_dev(li11, ul5);
    			append_dev(ul5, li10);
    			append_dev(li10, em9);
    			append_dev(li10, t63);
    			append_dev(li10, em10);
    			append_dev(li10, t65);
    			append_dev(li10, em11);
    			append_dev(li10, t67);
    			insert_dev(target, t68, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t69, anchor);
    			insert_dev(target, h24, anchor);
    			insert_dev(target, t71, anchor);
    			insert_dev(target, p9, anchor);
    			insert_dev(target, t73, anchor);
    			html_tag.m(CODEBLOCK_1$1, target, anchor);
    			insert_dev(target, t74, anchor);
    			insert_dev(target, p10, anchor);
    			insert_dev(target, t76, anchor);
    			html_tag_1.m(CODEBLOCK_2$1, target, anchor);
    			insert_dev(target, t77, anchor);
    			insert_dev(target, p11, anchor);
    			insert_dev(target, t79, anchor);
    			html_tag_2.m(CODEBLOCK_3$1, target, anchor);
    			insert_dev(target, t80, anchor);
    			insert_dev(target, p12, anchor);
    			insert_dev(target, t82, anchor);
    			insert_dev(target, p13, anchor);
    			append_dev(p13, img2);
    			insert_dev(target, t83, anchor);
    			insert_dev(target, span4, anchor);
    			insert_dev(target, t84, anchor);
    			insert_dev(target, h25, anchor);
    			insert_dev(target, t86, anchor);
    			insert_dev(target, p14, anchor);
    			append_dev(p14, t87);
    			append_dev(p14, em12);
    			append_dev(p14, t89);
    			append_dev(p14, em13);
    			append_dev(p14, t91);
    			insert_dev(target, t92, anchor);
    			insert_dev(target, p15, anchor);
    			insert_dev(target, t94, anchor);
    			insert_dev(target, p16, anchor);
    			append_dev(p16, img3);
    			insert_dev(target, t95, anchor);
    			insert_dev(target, span5, anchor);
    			insert_dev(target, t96, anchor);
    			insert_dev(target, h26, anchor);
    			insert_dev(target, t98, anchor);
    			insert_dev(target, ul7, anchor);
    			append_dev(ul7, li12);
    			append_dev(li12, h40);
    			append_dev(li12, t100);
    			append_dev(li12, em14);
    			append_dev(li12, t102);
    			append_dev(li12, em15);
    			append_dev(li12, t104);
    			append_dev(ul7, t105);
    			append_dev(ul7, li13);
    			append_dev(li13, h41);
    			append_dev(li13, t107);
    			insert_dev(target, t108, anchor);
    			insert_dev(target, span6, anchor);
    			insert_dev(target, t109, anchor);
    			insert_dev(target, h27, anchor);
    			insert_dev(target, t111, anchor);
    			insert_dev(target, p17, anchor);
    			append_dev(p17, t112);
    			append_dev(p17, em16);
    			append_dev(p17, t114);
    			append_dev(p17, em17);
    			append_dev(p17, t116);
    			append_dev(p17, em18);
    			append_dev(p17, t118);
    			append_dev(p17, em19);
    			append_dev(p17, t120);
    			append_dev(p17, em20);
    			append_dev(p17, t122);
    			append_dev(p17, em21);
    			append_dev(p17, t124);
    			insert_dev(target, t125, anchor);
    			insert_dev(target, p18, anchor);
    			append_dev(p18, t126);
    			append_dev(p18, em22);
    			append_dev(p18, t128);
    			append_dev(p18, em23);
    			append_dev(p18, t130);
    			append_dev(p18, em24);
    			append_dev(p18, t132);
    			append_dev(p18, em25);
    			append_dev(p18, t134);
    			append_dev(p18, em26);
    			append_dev(p18, t136);
    			append_dev(p18, em27);
    			append_dev(p18, t138);
    			insert_dev(target, t139, anchor);
    			insert_dev(target, p19, anchor);
    			append_dev(p19, t140);
    			append_dev(p19, em28);
    			append_dev(p19, t142);
    			append_dev(p19, em29);
    			append_dev(p19, t144);
    			append_dev(p19, em30);
    			append_dev(p19, t146);
    			append_dev(p19, em31);
    			append_dev(p19, t148);
    			insert_dev(target, t149, anchor);
    			insert_dev(target, p20, anchor);
    			append_dev(p20, t150);
    			append_dev(p20, em32);
    			append_dev(p20, t152);
    			append_dev(p20, em33);
    			append_dev(p20, t154);
    			append_dev(p20, code6);
    			append_dev(p20, t156);
    			insert_dev(target, t157, anchor);
    			insert_dev(target, p21, anchor);
    			append_dev(p21, t158);
    			append_dev(p21, code7);
    			append_dev(p21, t160);
    			append_dev(p21, em34);
    			append_dev(p21, t162);
    			insert_dev(target, t163, anchor);
    			insert_dev(target, h28, anchor);
    			insert_dev(target, t165, anchor);
    			insert_dev(target, p22, anchor);
    			insert_dev(target, t167, anchor);
    			insert_dev(target, p23, anchor);
    			append_dev(p23, em35);
    			append_dev(p23, t169);
    			append_dev(p23, em36);
    			append_dev(p23, t171);
    			append_dev(p23, em37);
    			append_dev(p23, t173);
    			append_dev(p23, a3);
    			append_dev(p23, t175);
    			insert_dev(target, t176, anchor);
    			insert_dev(target, h30, anchor);
    			insert_dev(target, t178, anchor);
    			insert_dev(target, p24, anchor);
    			insert_dev(target, t180, anchor);
    			insert_dev(target, p25, anchor);
    			append_dev(p25, em38);
    			insert_dev(target, t182, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, pre0);
    			append_dev(div0, t184);
    			append_dev(div0, pre1);
    			append_dev(div0, t186);
    			append_dev(div0, pre2);
    			insert_dev(target, t188, anchor);
    			insert_dev(target, p26, anchor);
    			append_dev(p26, t189);
    			append_dev(p26, em39);
    			append_dev(p26, t191);
    			append_dev(p26, em40);
    			append_dev(p26, t193);
    			append_dev(p26, em41);
    			append_dev(p26, t195);
    			append_dev(p26, em42);
    			append_dev(p26, t197);
    			insert_dev(target, t198, anchor);
    			insert_dev(target, p27, anchor);
    			append_dev(p27, em43);
    			insert_dev(target, t200, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, pre3);
    			append_dev(div1, t202);
    			append_dev(div1, pre4);
    			append_dev(div1, t204);
    			append_dev(div1, pre5);
    			insert_dev(target, t206, anchor);
    			insert_dev(target, p28, anchor);
    			append_dev(p28, em44);
    			append_dev(p28, t208);
    			insert_dev(target, t209, anchor);
    			insert_dev(target, h31, anchor);
    			insert_dev(target, t211, anchor);
    			insert_dev(target, p29, anchor);
    			insert_dev(target, t213, anchor);
    			insert_dev(target, p30, anchor);
    			append_dev(p30, em45);
    			insert_dev(target, t215, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, pre6);
    			append_dev(div2, t217);
    			append_dev(div2, pre7);
    			append_dev(div2, t219);
    			append_dev(div2, pre8);
    			insert_dev(target, t221, anchor);
    			insert_dev(target, p31, anchor);
    			append_dev(p31, t222);
    			append_dev(p31, em46);
    			append_dev(p31, t224);
    			insert_dev(target, t225, anchor);
    			insert_dev(target, p32, anchor);
    			append_dev(p32, img4);
    			insert_dev(target, t226, anchor);
    			insert_dev(target, h32, anchor);
    			insert_dev(target, t228, anchor);
    			insert_dev(target, p33, anchor);
    			insert_dev(target, t230, anchor);
    			insert_dev(target, p34, anchor);
    			append_dev(p34, img5);
    			insert_dev(target, t231, anchor);
    			insert_dev(target, p35, anchor);
    			insert_dev(target, t233, anchor);
    			insert_dev(target, p36, anchor);
    			append_dev(p36, code8);
    			append_dev(p36, t235);
    			append_dev(p36, code9);
    			append_dev(p36, t237);
    			append_dev(p36, code10);
    			append_dev(p36, t239);
    			insert_dev(target, t240, anchor);
    			insert_dev(target, p37, anchor);
    			append_dev(p37, em47);
    			insert_dev(target, t242, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, pre9);
    			append_dev(div3, t244);
    			append_dev(div3, pre10);
    			append_dev(div3, t246);
    			append_dev(div3, pre11);
    			insert_dev(target, t248, anchor);
    			insert_dev(target, p38, anchor);
    			append_dev(p38, code11);
    			append_dev(p38, t250);
    			insert_dev(target, t251, anchor);
    			insert_dev(target, p39, anchor);
    			append_dev(p39, em48);
    			insert_dev(target, t253, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, pre12);
    			append_dev(div4, t255);
    			append_dev(div4, pre13);
    			append_dev(div4, t257);
    			append_dev(div4, pre14);
    			insert_dev(target, t259, anchor);
    			insert_dev(target, p40, anchor);
    			append_dev(p40, img6);
    			insert_dev(target, t260, anchor);
    			insert_dev(target, h33, anchor);
    			insert_dev(target, t262, anchor);
    			insert_dev(target, p41, anchor);
    			append_dev(p41, img7);
    			insert_dev(target, t263, anchor);
    			insert_dev(target, p42, anchor);
    			insert_dev(target, t265, anchor);
    			insert_dev(target, h42, anchor);
    			insert_dev(target, t267, anchor);
    			insert_dev(target, p43, anchor);
    			insert_dev(target, t269, anchor);
    			insert_dev(target, h43, anchor);
    			insert_dev(target, t271, anchor);
    			insert_dev(target, p44, anchor);
    			insert_dev(target, t273, anchor);
    			insert_dev(target, h44, anchor);
    			insert_dev(target, t275, anchor);
    			insert_dev(target, p45, anchor);
    			insert_dev(target, t277, anchor);
    			insert_dev(target, h45, anchor);
    			insert_dev(target, t279, anchor);
    			insert_dev(target, p46, anchor);
    			insert_dev(target, t281, anchor);
    			insert_dev(target, h46, anchor);
    			insert_dev(target, t283, anchor);
    			insert_dev(target, p47, anchor);
    			insert_dev(target, t285, anchor);
    			insert_dev(target, h29, anchor);
    			insert_dev(target, t287, anchor);
    			insert_dev(target, h210, anchor);
    			insert_dev(target, t289, anchor);
    			insert_dev(target, p48, anchor);
    			append_dev(p48, t290);
    			append_dev(p48, a4);
    			append_dev(p48, t292);
    			append_dev(p48, em49);
    			append_dev(p48, t294);
    			append_dev(p48, em50);
    			append_dev(p48, t296);
    			insert_dev(target, t297, anchor);
    			insert_dev(target, p49, anchor);
    			append_dev(p49, img8);
    			insert_dev(target, t298, anchor);
    			insert_dev(target, h34, anchor);
    			insert_dev(target, t300, anchor);
    			insert_dev(target, p50, anchor);
    			append_dev(p50, em51);
    			append_dev(p50, t302);
    			append_dev(p50, em52);
    			append_dev(p50, t304);
    			append_dev(p50, em53);
    			append_dev(p50, t306);
    			append_dev(p50, em54);
    			append_dev(p50, t308);
    			append_dev(p50, em55);
    			append_dev(p50, t310);
    			insert_dev(target, t311, anchor);
    			insert_dev(target, p51, anchor);
    			append_dev(p51, em56);
    			append_dev(p51, t313);
    			append_dev(p51, em57);
    			append_dev(p51, t315);
    			append_dev(p51, em58);
    			append_dev(p51, t317);
    			insert_dev(target, t318, anchor);
    			insert_dev(target, p52, anchor);
    			append_dev(p52, t319);
    			append_dev(p52, em59);
    			append_dev(p52, t321);
    			insert_dev(target, t322, anchor);
    			insert_dev(target, p53, anchor);
    			append_dev(p53, em60);
    			insert_dev(target, t324, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, pre15);
    			append_dev(div5, t326);
    			append_dev(div5, pre16);
    			append_dev(div5, t328);
    			append_dev(div5, pre17);
    			insert_dev(target, t330, anchor);
    			insert_dev(target, p54, anchor);
    			append_dev(p54, em61);
    			insert_dev(target, t332, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, pre18);
    			append_dev(div6, t334);
    			append_dev(div6, pre19);
    			append_dev(div6, t336);
    			append_dev(div6, pre20);
    			insert_dev(target, t338, anchor);
    			insert_dev(target, p55, anchor);
    			append_dev(p55, em62);
    			append_dev(p55, t340);
    			insert_dev(target, t341, anchor);
    			insert_dev(target, p56, anchor);
    			append_dev(p56, img9);
    			insert_dev(target, t342, anchor);
    			insert_dev(target, p57, anchor);
    			insert_dev(target, t344, anchor);
    			insert_dev(target, ul8, anchor);
    			append_dev(ul8, li14);
    			append_dev(ul8, t346);
    			append_dev(ul8, li15);
    			append_dev(ul8, t348);
    			append_dev(ul8, li16);
    			append_dev(ul8, t350);
    			append_dev(ul8, li17);
    			insert_dev(target, t352, anchor);
    			insert_dev(target, p58, anchor);
    			append_dev(p58, img10);
    			insert_dev(target, t353, anchor);
    			insert_dev(target, h35, anchor);
    			insert_dev(target, t355, anchor);
    			insert_dev(target, p59, anchor);
    			append_dev(p59, t356);
    			append_dev(p59, em63);
    			append_dev(p59, t358);
    			append_dev(p59, em64);
    			append_dev(p59, t360);
    			append_dev(p59, em65);
    			append_dev(p59, t362);
    			append_dev(p59, em66);
    			append_dev(p59, t364);
    			insert_dev(target, t365, anchor);
    			insert_dev(target, p60, anchor);
    			append_dev(p60, em67);
    			insert_dev(target, t367, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, pre21);
    			append_dev(div7, t369);
    			append_dev(div7, pre22);
    			append_dev(div7, t371);
    			append_dev(div7, pre23);
    			insert_dev(target, t373, anchor);
    			insert_dev(target, p61, anchor);
    			append_dev(p61, em68);
    			insert_dev(target, t375, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, pre24);
    			append_dev(div8, t377);
    			append_dev(div8, pre25);
    			append_dev(div8, t379);
    			append_dev(div8, pre26);
    			insert_dev(target, t381, anchor);
    			insert_dev(target, p62, anchor);
    			append_dev(p62, img11);
    			insert_dev(target, t382, anchor);
    			insert_dev(target, p63, anchor);
    			insert_dev(target, t384, anchor);
    			insert_dev(target, p64, anchor);
    			append_dev(p64, em69);
    			insert_dev(target, t386, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, pre27);
    			append_dev(div9, t388);
    			append_dev(div9, pre28);
    			append_dev(div9, t390);
    			append_dev(div9, pre29);
    			insert_dev(target, t392, anchor);
    			insert_dev(target, p65, anchor);
    			insert_dev(target, t394, anchor);
    			insert_dev(target, h36, anchor);
    			insert_dev(target, t396, anchor);
    			insert_dev(target, p66, anchor);
    			insert_dev(target, t398, anchor);
    			insert_dev(target, ul9, anchor);
    			append_dev(ul9, li18);
    			append_dev(li18, code12);
    			append_dev(ul9, t400);
    			append_dev(ul9, li19);
    			append_dev(li19, code13);
    			append_dev(ul9, t402);
    			append_dev(ul9, li20);
    			append_dev(li20, code14);
    			append_dev(ul9, t404);
    			append_dev(ul9, li21);
    			append_dev(li21, a5);
    			insert_dev(target, t406, anchor);
    			insert_dev(target, p67, anchor);
    			append_dev(p67, em70);
    			append_dev(p67, t408);
    			append_dev(p67, em71);
    			append_dev(p67, t410);
    			append_dev(p67, em72);
    			append_dev(p67, t412);
    			append_dev(p67, em73);
    			append_dev(p67, t414);
    			append_dev(p67, em74);
    			append_dev(p67, t416);
    			insert_dev(target, t417, anchor);
    			insert_dev(target, p68, anchor);
    			append_dev(p68, em75);
    			insert_dev(target, t419, anchor);
    			insert_dev(target, div10, anchor);
    			append_dev(div10, pre30);
    			append_dev(div10, t421);
    			append_dev(div10, pre31);
    			append_dev(div10, t423);
    			append_dev(div10, pre32);
    			insert_dev(target, t425, anchor);
    			insert_dev(target, p69, anchor);
    			append_dev(p69, em76);
    			append_dev(p69, t427);
    			append_dev(p69, em77);
    			append_dev(p69, t429);
    			insert_dev(target, t430, anchor);
    			insert_dev(target, p70, anchor);
    			append_dev(p70, img12);
    			insert_dev(target, t431, anchor);
    			insert_dev(target, p71, anchor);
    			append_dev(p71, em78);
    			append_dev(p71, t433);
    			insert_dev(target, t434, anchor);
    			insert_dev(target, p72, anchor);
    			append_dev(p72, em79);
    			insert_dev(target, t436, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, pre33);
    			append_dev(div11, t438);
    			append_dev(div11, pre34);
    			append_dev(div11, t440);
    			append_dev(div11, pre35);
    			insert_dev(target, t442, anchor);
    			insert_dev(target, p73, anchor);
    			append_dev(p73, t443);
    			append_dev(p73, code15);
    			append_dev(p73, t445);
    			append_dev(p73, em80);
    			append_dev(p73, t447);
    			append_dev(p73, em81);
    			append_dev(p73, t449);
    			insert_dev(target, t450, anchor);
    			insert_dev(target, p74, anchor);
    			append_dev(p74, em82);
    			insert_dev(target, t452, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, pre36);
    			append_dev(div12, t454);
    			append_dev(div12, pre37);
    			append_dev(div12, t456);
    			append_dev(div12, pre38);
    			insert_dev(target, t458, anchor);
    			insert_dev(target, p75, anchor);
    			insert_dev(target, t460, anchor);
    			insert_dev(target, p76, anchor);
    			append_dev(p76, img13);
    			insert_dev(target, t461, anchor);
    			insert_dev(target, h37, anchor);
    			insert_dev(target, t463, anchor);
    			insert_dev(target, p77, anchor);
    			insert_dev(target, t465, anchor);
    			insert_dev(target, p78, anchor);
    			append_dev(p78, code16);
    			insert_dev(target, t467, anchor);
    			insert_dev(target, p79, anchor);
    			append_dev(p79, code17);
    			insert_dev(target, t469, anchor);
    			insert_dev(target, p80, anchor);
    			append_dev(p80, em83);
    			insert_dev(target, t471, anchor);
    			insert_dev(target, div13, anchor);
    			append_dev(div13, pre39);
    			append_dev(div13, t473);
    			append_dev(div13, pre40);
    			append_dev(div13, t475);
    			append_dev(div13, pre41);
    			insert_dev(target, t477, anchor);
    			insert_dev(target, p81, anchor);
    			append_dev(p81, t478);
    			append_dev(p81, em84);
    			append_dev(p81, t480);
    			append_dev(p81, em85);
    			append_dev(p81, t482);
    			insert_dev(target, t483, anchor);
    			insert_dev(target, p82, anchor);
    			append_dev(p82, t484);
    			append_dev(p82, em86);
    			append_dev(p82, t486);
    			append_dev(p82, em87);
    			append_dev(p82, t488);
    			append_dev(p82, em88);
    			append_dev(p82, t490);
    			insert_dev(target, t491, anchor);
    			insert_dev(target, p83, anchor);
    			insert_dev(target, t493, anchor);
    			insert_dev(target, p84, anchor);
    			append_dev(p84, img14);
    			insert_dev(target, t494, anchor);
    			insert_dev(target, h211, anchor);
    			insert_dev(target, t496, anchor);
    			insert_dev(target, span7, anchor);
    			insert_dev(target, t497, anchor);
    			insert_dev(target, span8, anchor);
    			insert_dev(target, t498, anchor);
    			insert_dev(target, h212, anchor);
    			insert_dev(target, t500, anchor);
    			insert_dev(target, h213, anchor);
    			insert_dev(target, t502, anchor);
    			insert_dev(target, ul10, anchor);
    			append_dev(ul10, li22);
    			append_dev(li22, p85);
    			append_dev(ul10, t504);
    			append_dev(ul10, li23);
    			append_dev(li23, p86);
    			append_dev(p86, a6);
    			append_dev(ul10, t506);
    			append_dev(ul10, li24);
    			append_dev(li24, p87);
    			append_dev(ul10, t508);
    			append_dev(ul10, li25);
    			append_dev(li25, p88);
    			append_dev(p88, a7);
    			append_dev(ul10, t510);
    			append_dev(ul10, li26);
    			append_dev(li26, p89);
    			append_dev(p89, a8);
    			append_dev(ul10, t512);
    			append_dev(ul10, li27);
    			append_dev(li27, p90);
    			append_dev(p90, a9);
    			append_dev(ul10, t514);
    			append_dev(ul10, li28);
    			append_dev(li28, p91);
    			append_dev(p91, a10);
    			append_dev(ul10, t516);
    			append_dev(ul10, li29);
    			append_dev(li29, p92);
    			append_dev(p92, a11);
    			insert_dev(target, t518, anchor);
    			insert_dev(target, ul11, anchor);
    			append_dev(ul11, li30);
    			insert_dev(target, t520, anchor);
    			insert_dev(target, ul12, anchor);
    			append_dev(ul12, li31);
    			append_dev(li31, p93);
    			append_dev(p93, a12);
    			append_dev(ul12, t522);
    			append_dev(ul12, li32);
    			append_dev(li32, p94);
    			append_dev(ul12, t524);
    			append_dev(ul12, li33);
    			append_dev(li33, p95);
    			append_dev(p95, a13);
    			insert_dev(target, t526, anchor);
    			insert_dev(target, ul13, anchor);
    			append_dev(ul13, li34);
    			insert_dev(target, t528, anchor);
    			insert_dev(target, ul14, anchor);
    			append_dev(ul14, li35);
    			append_dev(li35, a14);
    			insert_dev(target, t530, anchor);
    			insert_dev(target, ul15, anchor);
    			append_dev(ul15, li36);
    			insert_dev(target, t532, anchor);
    			insert_dev(target, ul16, anchor);
    			append_dev(ul16, li37);
    			append_dev(li37, a15);
    			insert_dev(target, t534, anchor);
    			insert_dev(target, ul17, anchor);
    			append_dev(ul17, li38);
    			insert_dev(target, t536, anchor);
    			insert_dev(target, ul18, anchor);
    			append_dev(ul18, li39);
    			append_dev(li39, a16);
    			append_dev(ul18, t538);
    			append_dev(ul18, li40);
    			append_dev(li40, a17);
    			insert_dev(target, t540, anchor);
    			insert_dev(target, pre42, anchor);
    			append_dev(pre42, code18);
    			insert_dev(target, t542, anchor);
    			insert_dev(target, p96, anchor);
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
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t35);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t37);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t39);
    			if (detaching) detach_dev(ul6);
    			if (detaching) detach_dev(t68);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t69);
    			if (detaching) detach_dev(h24);
    			if (detaching) detach_dev(t71);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t73);
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t74);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t76);
    			if (detaching) html_tag_1.d();
    			if (detaching) detach_dev(t77);
    			if (detaching) detach_dev(p11);
    			if (detaching) detach_dev(t79);
    			if (detaching) html_tag_2.d();
    			if (detaching) detach_dev(t80);
    			if (detaching) detach_dev(p12);
    			if (detaching) detach_dev(t82);
    			if (detaching) detach_dev(p13);
    			if (detaching) detach_dev(t83);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t84);
    			if (detaching) detach_dev(h25);
    			if (detaching) detach_dev(t86);
    			if (detaching) detach_dev(p14);
    			if (detaching) detach_dev(t92);
    			if (detaching) detach_dev(p15);
    			if (detaching) detach_dev(t94);
    			if (detaching) detach_dev(p16);
    			if (detaching) detach_dev(t95);
    			if (detaching) detach_dev(span5);
    			if (detaching) detach_dev(t96);
    			if (detaching) detach_dev(h26);
    			if (detaching) detach_dev(t98);
    			if (detaching) detach_dev(ul7);
    			if (detaching) detach_dev(t108);
    			if (detaching) detach_dev(span6);
    			if (detaching) detach_dev(t109);
    			if (detaching) detach_dev(h27);
    			if (detaching) detach_dev(t111);
    			if (detaching) detach_dev(p17);
    			if (detaching) detach_dev(t125);
    			if (detaching) detach_dev(p18);
    			if (detaching) detach_dev(t139);
    			if (detaching) detach_dev(p19);
    			if (detaching) detach_dev(t149);
    			if (detaching) detach_dev(p20);
    			if (detaching) detach_dev(t157);
    			if (detaching) detach_dev(p21);
    			if (detaching) detach_dev(t163);
    			if (detaching) detach_dev(h28);
    			if (detaching) detach_dev(t165);
    			if (detaching) detach_dev(p22);
    			if (detaching) detach_dev(t167);
    			if (detaching) detach_dev(p23);
    			if (detaching) detach_dev(t176);
    			if (detaching) detach_dev(h30);
    			if (detaching) detach_dev(t178);
    			if (detaching) detach_dev(p24);
    			if (detaching) detach_dev(t180);
    			if (detaching) detach_dev(p25);
    			if (detaching) detach_dev(t182);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t188);
    			if (detaching) detach_dev(p26);
    			if (detaching) detach_dev(t198);
    			if (detaching) detach_dev(p27);
    			if (detaching) detach_dev(t200);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t206);
    			if (detaching) detach_dev(p28);
    			if (detaching) detach_dev(t209);
    			if (detaching) detach_dev(h31);
    			if (detaching) detach_dev(t211);
    			if (detaching) detach_dev(p29);
    			if (detaching) detach_dev(t213);
    			if (detaching) detach_dev(p30);
    			if (detaching) detach_dev(t215);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t221);
    			if (detaching) detach_dev(p31);
    			if (detaching) detach_dev(t225);
    			if (detaching) detach_dev(p32);
    			if (detaching) detach_dev(t226);
    			if (detaching) detach_dev(h32);
    			if (detaching) detach_dev(t228);
    			if (detaching) detach_dev(p33);
    			if (detaching) detach_dev(t230);
    			if (detaching) detach_dev(p34);
    			if (detaching) detach_dev(t231);
    			if (detaching) detach_dev(p35);
    			if (detaching) detach_dev(t233);
    			if (detaching) detach_dev(p36);
    			if (detaching) detach_dev(t240);
    			if (detaching) detach_dev(p37);
    			if (detaching) detach_dev(t242);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t248);
    			if (detaching) detach_dev(p38);
    			if (detaching) detach_dev(t251);
    			if (detaching) detach_dev(p39);
    			if (detaching) detach_dev(t253);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t259);
    			if (detaching) detach_dev(p40);
    			if (detaching) detach_dev(t260);
    			if (detaching) detach_dev(h33);
    			if (detaching) detach_dev(t262);
    			if (detaching) detach_dev(p41);
    			if (detaching) detach_dev(t263);
    			if (detaching) detach_dev(p42);
    			if (detaching) detach_dev(t265);
    			if (detaching) detach_dev(h42);
    			if (detaching) detach_dev(t267);
    			if (detaching) detach_dev(p43);
    			if (detaching) detach_dev(t269);
    			if (detaching) detach_dev(h43);
    			if (detaching) detach_dev(t271);
    			if (detaching) detach_dev(p44);
    			if (detaching) detach_dev(t273);
    			if (detaching) detach_dev(h44);
    			if (detaching) detach_dev(t275);
    			if (detaching) detach_dev(p45);
    			if (detaching) detach_dev(t277);
    			if (detaching) detach_dev(h45);
    			if (detaching) detach_dev(t279);
    			if (detaching) detach_dev(p46);
    			if (detaching) detach_dev(t281);
    			if (detaching) detach_dev(h46);
    			if (detaching) detach_dev(t283);
    			if (detaching) detach_dev(p47);
    			if (detaching) detach_dev(t285);
    			if (detaching) detach_dev(h29);
    			if (detaching) detach_dev(t287);
    			if (detaching) detach_dev(h210);
    			if (detaching) detach_dev(t289);
    			if (detaching) detach_dev(p48);
    			if (detaching) detach_dev(t297);
    			if (detaching) detach_dev(p49);
    			if (detaching) detach_dev(t298);
    			if (detaching) detach_dev(h34);
    			if (detaching) detach_dev(t300);
    			if (detaching) detach_dev(p50);
    			if (detaching) detach_dev(t311);
    			if (detaching) detach_dev(p51);
    			if (detaching) detach_dev(t318);
    			if (detaching) detach_dev(p52);
    			if (detaching) detach_dev(t322);
    			if (detaching) detach_dev(p53);
    			if (detaching) detach_dev(t324);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t330);
    			if (detaching) detach_dev(p54);
    			if (detaching) detach_dev(t332);
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t338);
    			if (detaching) detach_dev(p55);
    			if (detaching) detach_dev(t341);
    			if (detaching) detach_dev(p56);
    			if (detaching) detach_dev(t342);
    			if (detaching) detach_dev(p57);
    			if (detaching) detach_dev(t344);
    			if (detaching) detach_dev(ul8);
    			if (detaching) detach_dev(t352);
    			if (detaching) detach_dev(p58);
    			if (detaching) detach_dev(t353);
    			if (detaching) detach_dev(h35);
    			if (detaching) detach_dev(t355);
    			if (detaching) detach_dev(p59);
    			if (detaching) detach_dev(t365);
    			if (detaching) detach_dev(p60);
    			if (detaching) detach_dev(t367);
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t373);
    			if (detaching) detach_dev(p61);
    			if (detaching) detach_dev(t375);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t381);
    			if (detaching) detach_dev(p62);
    			if (detaching) detach_dev(t382);
    			if (detaching) detach_dev(p63);
    			if (detaching) detach_dev(t384);
    			if (detaching) detach_dev(p64);
    			if (detaching) detach_dev(t386);
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t392);
    			if (detaching) detach_dev(p65);
    			if (detaching) detach_dev(t394);
    			if (detaching) detach_dev(h36);
    			if (detaching) detach_dev(t396);
    			if (detaching) detach_dev(p66);
    			if (detaching) detach_dev(t398);
    			if (detaching) detach_dev(ul9);
    			if (detaching) detach_dev(t406);
    			if (detaching) detach_dev(p67);
    			if (detaching) detach_dev(t417);
    			if (detaching) detach_dev(p68);
    			if (detaching) detach_dev(t419);
    			if (detaching) detach_dev(div10);
    			if (detaching) detach_dev(t425);
    			if (detaching) detach_dev(p69);
    			if (detaching) detach_dev(t430);
    			if (detaching) detach_dev(p70);
    			if (detaching) detach_dev(t431);
    			if (detaching) detach_dev(p71);
    			if (detaching) detach_dev(t434);
    			if (detaching) detach_dev(p72);
    			if (detaching) detach_dev(t436);
    			if (detaching) detach_dev(div11);
    			if (detaching) detach_dev(t442);
    			if (detaching) detach_dev(p73);
    			if (detaching) detach_dev(t450);
    			if (detaching) detach_dev(p74);
    			if (detaching) detach_dev(t452);
    			if (detaching) detach_dev(div12);
    			if (detaching) detach_dev(t458);
    			if (detaching) detach_dev(p75);
    			if (detaching) detach_dev(t460);
    			if (detaching) detach_dev(p76);
    			if (detaching) detach_dev(t461);
    			if (detaching) detach_dev(h37);
    			if (detaching) detach_dev(t463);
    			if (detaching) detach_dev(p77);
    			if (detaching) detach_dev(t465);
    			if (detaching) detach_dev(p78);
    			if (detaching) detach_dev(t467);
    			if (detaching) detach_dev(p79);
    			if (detaching) detach_dev(t469);
    			if (detaching) detach_dev(p80);
    			if (detaching) detach_dev(t471);
    			if (detaching) detach_dev(div13);
    			if (detaching) detach_dev(t477);
    			if (detaching) detach_dev(p81);
    			if (detaching) detach_dev(t483);
    			if (detaching) detach_dev(p82);
    			if (detaching) detach_dev(t491);
    			if (detaching) detach_dev(p83);
    			if (detaching) detach_dev(t493);
    			if (detaching) detach_dev(p84);
    			if (detaching) detach_dev(t494);
    			if (detaching) detach_dev(h211);
    			if (detaching) detach_dev(t496);
    			if (detaching) detach_dev(span7);
    			if (detaching) detach_dev(t497);
    			if (detaching) detach_dev(span8);
    			if (detaching) detach_dev(t498);
    			if (detaching) detach_dev(h212);
    			if (detaching) detach_dev(t500);
    			if (detaching) detach_dev(h213);
    			if (detaching) detach_dev(t502);
    			if (detaching) detach_dev(ul10);
    			if (detaching) detach_dev(t518);
    			if (detaching) detach_dev(ul11);
    			if (detaching) detach_dev(t520);
    			if (detaching) detach_dev(ul12);
    			if (detaching) detach_dev(t526);
    			if (detaching) detach_dev(ul13);
    			if (detaching) detach_dev(t528);
    			if (detaching) detach_dev(ul14);
    			if (detaching) detach_dev(t530);
    			if (detaching) detach_dev(ul15);
    			if (detaching) detach_dev(t532);
    			if (detaching) detach_dev(ul16);
    			if (detaching) detach_dev(t534);
    			if (detaching) detach_dev(ul17);
    			if (detaching) detach_dev(t536);
    			if (detaching) detach_dev(ul18);
    			if (detaching) detach_dev(t540);
    			if (detaching) detach_dev(pre42);
    			if (detaching) detach_dev(t542);
    			if (detaching) detach_dev(p96);
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

    const CODEBLOCK_1$1 = `<pre><code class="language-js">npx degit sveltejs/template remember-em-all
</code></pre>
`;

    const CODEBLOCK_2$1 = `<pre><code class="language-js">cd remember-em-all
node scripts/setupTypeScript.js
</code></pre>
`;

    const CODEBLOCK_3$1 = `<pre><code class="language-js">npm install
npm run dev
</code></pre>
`;

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('README', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<README> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		META: META$1,
    		CODEBLOCK_1: CODEBLOCK_1$1,
    		CODEBLOCK_2: CODEBLOCK_2$1,
    		CODEBLOCK_3: CODEBLOCK_3$1
    	});

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

    /* src\components\Info\READMETR.md generated by Svelte v3.48.0 */

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
    	let a1;
    	let t7;
    	let t8;
    	let span1;
    	let t9;
    	let h21;
    	let t11;
    	let p1;
    	let t13;
    	let p2;
    	let img0;
    	let img0_src_value;
    	let t14;
    	let p3;
    	let t16;
    	let span2;
    	let t17;
    	let h22;
    	let t19;
    	let p4;
    	let t21;
    	let p5;
    	let img1;
    	let img1_src_value;
    	let t22;
    	let p6;
    	let t24;
    	let p7;
    	let a2;
    	let t26;
    	let t27;
    	let span3;
    	let t28;
    	let h23;
    	let t30;
    	let p8;
    	let t32;
    	let html_tag;
    	let t33;
    	let p9;
    	let t35;
    	let html_tag_1;
    	let t36;
    	let p10;
    	let t38;
    	let html_tag_2;
    	let t39;
    	let p11;
    	let t41;
    	let p12;
    	let img2;
    	let img2_src_value;
    	let t42;
    	let span4;
    	let t43;
    	let h24;
    	let t45;
    	let p13;
    	let t46;
    	let code0;
    	let t48;
    	let code1;
    	let t50;
    	let t51;
    	let p14;
    	let img3;
    	let img3_src_value;
    	let t52;
    	let p15;
    	let t54;
    	let span5;
    	let t55;
    	let h25;
    	let t57;
    	let ul0;
    	let li0;
    	let h40;
    	let t59;
    	let code2;
    	let t61;
    	let code3;
    	let t63;
    	let t64;
    	let li1;
    	let h41;
    	let t66;
    	let t67;
    	let span6;
    	let t68;
    	let h26;
    	let t70;
    	let p16;
    	let t72;
    	let p17;
    	let code4;
    	let t74;
    	let t75;
    	let p18;
    	let code5;
    	let t77;
    	let t78;
    	let p19;
    	let code6;
    	let t80;
    	let code7;
    	let t82;
    	let t83;
    	let p20;
    	let t84;
    	let code8;
    	let t86;
    	let t87;
    	let p21;
    	let t89;
    	let p22;
    	let t90;
    	let code9;
    	let t92;
    	let t93;
    	let h42;
    	let t95;
    	let p23;
    	let t97;
    	let div0;
    	let pre0;
    	let p24;
    	let t98;
    	let code10;
    	let t100;
    	let t101;
    	let p25;
    	let t102;
    	let code11;
    	let t104;
    	let code12;
    	let t106;
    	let t107;
    	let div1;
    	let pre1;
    	let p26;
    	let t108;
    	let code13;
    	let t110;
    	let t111;
    	let pre2;
    	let code14;
    	let t113;
    	let pre3;
    	let code15;
    	let t115;
    	let p27;
    	let t117;
    	let h43;
    	let t119;
    	let p28;
    	let t121;
    	let pre4;
    	let code16;
    	let t123;
    	let pre5;
    	let code17;
    	let t125;
    	let pre6;
    	let code18;
    	let t127;
    	let p29;
    	let t128;
    	let code19;
    	let t130;
    	let t131;
    	let p30;
    	let img4;
    	let img4_src_value;
    	let t132;
    	let span7;
    	let t133;
    	let h27;
    	let t135;
    	let h3;
    	let t137;
    	let p32;
    	let img5;
    	let img5_src_value;
    	let t138;
    	let label;
    	let i;
    	let p31;
    	let a3;
    	let t140;
    	let t141;
    	let p33;
    	let t142;
    	let code20;
    	let t144;
    	let t145;
    	let p34;
    	let img6;
    	let img6_src_value;
    	let t146;
    	let h44;
    	let t148;
    	let p35;
    	let t150;
    	let p36;
    	let code21;
    	let t152;
    	let pre7;
    	let code22;
    	let t154;
    	let p37;
    	let code23;
    	let t156;
    	let pre8;
    	let code24;
    	let t158;
    	let p38;
    	let img7;
    	let img7_src_value;
    	let t159;
    	let p39;
    	let t161;
    	let span8;
    	let t162;
    	let h28;
    	let t164;
    	let h29;
    	let t166;
    	let ul1;
    	let li2;
    	let p40;
    	let t168;
    	let li3;
    	let p41;
    	let a4;
    	let t170;
    	let li4;
    	let p42;
    	let t172;
    	let li5;
    	let p43;
    	let a5;
    	let t174;
    	let li6;
    	let p44;
    	let a6;
    	let t176;
    	let li7;
    	let p45;
    	let a7;
    	let t178;
    	let li8;
    	let p46;
    	let a8;
    	let t180;
    	let li9;
    	let p47;
    	let a9;
    	let t182;
    	let ul2;
    	let li10;
    	let t184;
    	let ul3;
    	let li11;
    	let p48;
    	let a10;
    	let t186;
    	let li12;
    	let p49;
    	let t188;
    	let li13;
    	let p50;
    	let a11;
    	let t190;
    	let ul4;
    	let li14;
    	let t192;
    	let ul5;
    	let li15;
    	let a12;
    	let t194;
    	let ul6;
    	let li16;
    	let t196;
    	let ul7;
    	let li17;
    	let a13;
    	let t198;
    	let pre9;
    	let code25;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = space();
    			h20 = element("h2");
    			h20.textContent = "Selam :wave:";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte'in\nyapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu\ndökümanı oluşturdum. Döküman içerisinde adım adım 'Game' bağlantısında\ngörebileğiniz oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsanız aynı\nadımları takip ederek benzer veya farklı bir uygulama oluşturabilirsiniz.\nSvelte içeriği iyi ayrıntılanmış dökümantasyonlara\n(");
    			a0 = element("a");
    			a0.textContent = "docs";
    			t5 = text(",\n");
    			a1 = element("a");
    			a1.textContent = "examples";
    			t7 = text(") sahip,\ndökümantasyonları inceledikten sonra uygulamayı takip etmeniz daha faydalı\nolabilir. İçeriğin özelliklerini sol tarafta bulunan haritalandırma ile takip\nedebilirsiniz.");
    			t8 = space();
    			span1 = element("span");
    			t9 = space();
    			h21 = element("h2");
    			h21.textContent = "Oyun Hakkında";
    			t11 = space();
    			p1 = element("p");
    			p1.textContent = "Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre\narayüz üzerinde kartlar bulunacak. Kartların üzerlerine click eventi\ngerçekleştirildiğinde kartlar açılacak, kullanıcılar açılan kartları\neşleştirmeye çalışacaklar. Eşleşen kartlar açık bir şekilde arayüz üzerinde\ndururken başarılı eşleşme sonucunda kullanıcıya puan kazandıracak, başarısız her\neşleşmede kartlar bulundukları yerde yeniden kapatılacaklar. Bütün kartlar\neşleştiklerinde, bir sonraki seviyede yer alan kartar arayüze kapalı olarak\nyeniden gelecektir.";
    			t13 = space();
    			p2 = element("p");
    			img0 = element("img");
    			t14 = space();
    			p3 = element("p");
    			p3.textContent = "Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde\nyer alan görsellerden birini seçmesi beklenecektir. Bu seçilen değerler oyunun\narayüzünde kartların yer aldığı bölümün altında score & level değerleri ile\nbirlikte gösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak\nkalacaktır, score & level değerleri dinamik olarak kullanıcı davranışına göre\ngüncellenecektir.";
    			t16 = space();
    			span2 = element("span");
    			t17 = space();
    			h22 = element("h2");
    			h22.textContent = "Svelte nedir?";
    			t19 = space();
    			p4 = element("p");
    			p4.textContent = "Svelte günümüz modern library ve framework habitatının komplex yapılarını\nazaltarak daha basit şekilde yüksek verimliliğe sahip uygulamalar\ngeliştirilmesini sağlamayı amaçlayan bir derleyicidir. Modern framework/library\nile birlikte geride bıraktığımız her süreçte farklı ihtiyaçlar için yeni bir öğrenme\nsüreci ortaya çıktı.";
    			t21 = space();
    			p5 = element("p");
    			img1 = element("img");
    			t22 = space();
    			p6 = element("p");
    			p6.textContent = "Öğrenme döngüsünün sürekli olarak geliştiricilerin\nkarşısına çıkması bir süre sonrasında illallah dedirtmeye başladılar.\nSvelte'in alışık olduğumuz html & css & js kod yapılarına benzer bir\nsözdiziminin kullanılması, props ve state güncellemeleri için 40 takla\natılmasına gerek kalınmaması gibi özellikleri ile bu döngünün dışına çıkmayı\namaçlamaktadır.";
    			t24 = space();
    			p7 = element("p");
    			a2 = element("a");
    			a2.textContent = "Stack Overflow Developer Survey 2021";
    			t26 = text(" anketinde geliştiriciler tarafından %71.47 oranıyla en çok sevilen web\nframework Svelte olarak seçildi.");
    			t27 = space();
    			span3 = element("span");
    			t28 = space();
    			h23 = element("h2");
    			h23.textContent = "Svelte projesi oluşturma";
    			t30 = space();
    			p8 = element("p");
    			p8.textContent = "Npx ile yeni bir proje oluşturma:";
    			t32 = space();
    			html_tag = new HtmlTag(false);
    			t33 = space();
    			p9 = element("p");
    			p9.textContent = "Svelte Typescript notasyonunu desteklemektedir. Typescript üzerinde\nyapabileceğiniz bütün işlemleri Svelte projenizde kullanabilirsiniz.";
    			t35 = space();
    			html_tag_1 = new HtmlTag(false);
    			t36 = space();
    			p10 = element("p");
    			p10.textContent = "Gerekli olan bağımlılıkları projemize ekleyerek ayağa kaldırabiliriz.";
    			t38 = space();
    			html_tag_2 = new HtmlTag(false);
    			t39 = space();
    			p11 = element("p");
    			p11.textContent = "Bu komutlar sonrasında konsol üzerinde projenin hangi port üzerinde çalıştığını\nkontrol edebilirsiniz. Windows işletim sistemlerinde genelde 8080 portu işaret\nedilirken, bu port üzerinde çalışan proje varsa veya farklı işletim\nsistemlerinde port adresi değişebilir.";
    			t41 = space();
    			p12 = element("p");
    			img2 = element("img");
    			t42 = space();
    			span4 = element("span");
    			t43 = space();
    			h24 = element("h2");
    			h24.textContent = "Svelte nasıl çalışır?";
    			t45 = space();
    			p13 = element("p");
    			t46 = text("Svelte bileşenleri ");
    			code0 = element("code");
    			code0.textContent = ".svelte";
    			t48 = text(" uzantılı dosyalar ile oluşturulur. HTML'de benzer\nolarak ");
    			code1 = element("code");
    			code1.textContent = "script, style, html";
    			t50 = text(" kod yapılarını oluşturabilirdiğiniz üç farklı bölüm\nbulunuyor. Uygulamanızı oluşturduğunuzda bu bileşenler derlenerek, pure\nJavascript kodlarına dönüştürülür.");
    			t51 = space();
    			p14 = element("p");
    			img3 = element("img");
    			t52 = space();
    			p15 = element("p");
    			p15.textContent = "Svelte'in derleme işlemini runtime üzerinde gerçekleştiriyor. Bu derleme\nişlemiyle birlikte Virtual DOM bağımlılığı ortadan kalkıyor.";
    			t54 = space();
    			span5 = element("span");
    			t55 = space();
    			h25 = element("h2");
    			h25.textContent = "Proje bağımlılıkları";
    			t57 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			h40 = element("h4");
    			h40.textContent = "Typescript";
    			t59 = text("\nTypescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı\nhataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Svelte\n");
    			code2 = element("code");
    			code2.textContent = ".svelte";
    			t61 = text(" uzantılı dosyaların yanısıra ");
    			code3 = element("code");
    			code3.textContent = ".ts";
    			t63 = text(" dosyaları da destekler.");
    			t64 = space();
    			li1 = element("li");
    			h41 = element("h4");
    			h41.textContent = "Rollup";
    			t66 = text("\nSvelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası\noluşturulacaktır. Rollup javascript uygulamalar için kullanılan bir modül\npaketleyicidir. Rollup uygulamamızda yer alan kodları tarayıcının\nanlayabileceği şekilde ayrıştırır.");
    			t67 = space();
    			span6 = element("span");
    			t68 = space();
    			h26 = element("h2");
    			h26.textContent = "Svelte projesini inceleme";
    			t70 = space();
    			p16 = element("p");
    			p16.textContent = "Varsayılan src/App.svelte dosyasını kontrol ettiğimizde daha önce bahsettiğimiz\nJavascript kodları için script, html kodları için main ve stillendirme için\nstyle tagları bulunuyor.";
    			t72 = space();
    			p17 = element("p");
    			code4 = element("code");
    			code4.textContent = "script";
    			t74 = text(" etiketinde lang attribute'i Typescript bağımlılığını eklediğimiz için\n\"ts\" değerinde bulunmaktadır. Typescript kullanmak istediğiniz .svelte\ndosyalarında lang attribute'ine ts değerini vermeniz yeterli olacaktır.");
    			t75 = space();
    			p18 = element("p");
    			code5 = element("code");
    			code5.textContent = "main";
    			t77 = text(" etiketinde html kodlarını tanımlayabileceğiniz gibi, bu tag'ın dışında da\nistediğiniz gibi html kodlarını tanımlayabilirsiniz. Svelte tanımladığınız\nkodları html kodu olarak derlemesine rağmen, proje yapısının daha okunabilir\nolabilmesi bir etiketin altında toplanması daha iyi olabilir.");
    			t78 = space();
    			p19 = element("p");
    			code6 = element("code");
    			code6.textContent = "style";
    			t80 = text(" etiketi altında tanımladığınız stillendirmeler, html alanında bulunan\nseçiciler etkilenir. Global seçicileri kullanabileceğiniz gibi, global olarak\ntanımlamak istediğiniz seçicileri ");
    			code7 = element("code");
    			code7.textContent = "public>global.css";
    			t82 = text(" dosyasında\ndüzenleyebilirsiniz.");
    			t83 = space();
    			p20 = element("p");
    			t84 = text("Proje içerisinde compile edilen bütün yapılar ");
    			code8 = element("code");
    			code8.textContent = "/public/build/bundle.js";
    			t86 = text("\ndosyasında yer almaktadir. index.html dosyası buradaki yapıyı referans alarak\nsvelte projesini kullanıcı karşısına getirmektedir.");
    			t87 = space();
    			p21 = element("p");
    			p21.textContent = "Burada birkaç örnek yaparak Svelte'i anlamaya, yorumlayamaya çalışalım.";
    			t89 = space();
    			p22 = element("p");
    			t90 = text("App.svelte dosyasında name isminde bir değişken tanımlanmış. Typescript\nnotasyonu baz alındığı için değer tipi olarak ");
    			code9 = element("code");
    			code9.textContent = "string";
    			t92 = text(" verilmiş. Bu notasyon ile\nanlatım biraz daha uzun olabileceği için kullanmayı tercih etmicem.");
    			t93 = space();
    			h42 = element("h4");
    			h42.textContent = "Variable erişimi";
    			t95 = space();
    			p23 = element("p");
    			p23.textContent = "Script üzerinde tanımlanan değerleri html içerisinde çağırabilmek için\n{ } kullanılmalıdır. Bu template ile değer tipi farketmeksizin\ndeğişkenleri çağırarak işlemler gerçekleştirilebilir.";
    			t97 = space();
    			div0 = element("div");
    			pre0 = element("pre");
    			p24 = element("p");
    			t98 = text("// app.svelte\n");
    			code10 = element("code");

    			code10.textContent = `${`
\<script>
  const user = "sabuha";
</script>

\<span>{ user } seni izliyor!</span>

\<style>
h1 {
color: rebeccapurple;
}
</style>
`}`;

    			t100 = text("\n");
    			t101 = space();
    			p25 = element("p");
    			t102 = text("Bu tanımlama ile birlikte ");
    			code11 = element("code");
    			code11.textContent = "user";
    			t104 = text(" değerine tanımalanan her değer dinamik olarak\nözellik kazanacaktır. biraz biraz karıştıralım.. ");
    			code12 = element("code");
    			code12.textContent = "user";
    			t106 = text(" değeri sabuha'ya eşit\nolduğu durumlarda 'seni izliyor!' yerine 'bir kedi gördüm sanki!' değeri ekrana\nyazılsın.");
    			t107 = space();
    			div1 = element("div");
    			pre1 = element("pre");
    			p26 = element("p");
    			t108 = text("// app.svelte\n");
    			code13 = element("code");

    			code13.textContent = `${`
\<script>
  const user = "sabuha";
  let cat = "bir kedi gördüm sanki!";
  let dictator = "is watch you!";
</script>

\<span>{ user === "sabuha" ? cat : dictator }</span>
`}`;

    			t110 = text("\n");
    			t111 = space();
    			pre2 = element("pre");
    			code14 = element("code");

    			code14.textContent = `${`
const user = "sabuha";
let cat = "bir kedi gördüm sanki!";
let dictator = "is watch you!";
`}`;

    			t113 = space();
    			pre3 = element("pre");
    			code15 = element("code");

    			code15.textContent = `${`
<span>&lcub;user === "sabuha" ? cat : dictator&rcub;</span>
`}`;

    			t115 = space();
    			p27 = element("p");
    			p27.textContent = "html içerisinde kullandığımız { } tagları arasında condition yapıları\ngibi döngü, fonksiyon çağırma işlemleri gerçekleştirebiliyoruz. Sırasıyla\nhepsini gerçekleştireceğiz.";
    			t117 = space();
    			h43 = element("h4");
    			h43.textContent = "Reactive Variable";
    			t119 = space();
    			p28 = element("p");
    			p28.textContent = "Duruma bağlı değişkenlik gösterebilecek dinamik verileriniz güncellendiğinde\nDOM üzerinde güncelleme gerçekleştirilir.";
    			t121 = space();
    			pre4 = element("pre");
    			code16 = element("code");

    			code16.textContent = `${`
let count = 0;

function handleClick() &rcub;
  count += 1;
&lcub;
`}`;

    			t123 = space();
    			pre5 = element("pre");
    			code17 = element("code");

    			code17.textContent = `${`
<main>
  <button on:click="{handleClick}">Click</button>

  <h2>&lcub;count&rcub;</h2>
</main>
`}`;

    			t125 = space();
    			pre6 = element("pre");
    			code18 = element("code");

    			code18.textContent = `${`
h2,
button &rcub;
  display: block;
  border: 3px dashed purple;
  background-color: yellowgreen;
  padding: 10px;
  margin: 0 auto;
  text-align: center;
  width: 400px;
  margin-bottom: 40px;
&lcub;
`}`;

    			t127 = space();
    			p29 = element("p");
    			t128 = text("Button üzerine her tıklama ile birlikte ");
    			code19 = element("code");
    			code19.textContent = "count";
    			t130 = text(" değerimiz +1 artacak ve DOM\nüzerinde bu değer render edilecektir.");
    			t131 = space();
    			p30 = element("p");
    			img4 = element("img");
    			t132 = space();
    			span7 = element("span");
    			t133 = space();
    			h27 = element("h2");
    			h27.textContent = "Arayüzü oluşturma";
    			t135 = space();
    			h3 = element("h3");
    			h3.textContent = "Component Yapısı";
    			t137 = space();
    			p32 = element("p");
    			img5 = element("img");
    			t138 = space();
    			label = element("label");
    			i = element("i");
    			p31 = element("p");
    			a3 = element("a");
    			a3.textContent = "JSONVisio";
    			t140 = text(" ile JSON\nverilerinizi görselleştirebilir, bu yapıdaki dosyalarınızı daha okunabilir\nformata çevirebilirsiniz.");
    			t141 = space();
    			p33 = element("p");
    			t142 = text("Playground Componenti altında oyunda yer alan bütün yapıları tutacağız. Bununla\nbirlikte arayüz üzerinde yer alan kartları ve kullanıcının gerçekleştirmiş\nolduğu eventleri burada takip edeceğiz. ");
    			code20 = element("code");
    			code20.textContent = "src";
    			t144 = text(" klasörünün altında Playground için\ntanımlayacağımız dizin yapısını aşağıdaki görseldeki gibi oluşturalım.");
    			t145 = space();
    			p34 = element("p");
    			img6 = element("img");
    			t146 = space();
    			h44 = element("h4");
    			h44.textContent = "Playground Componenti";
    			t148 = space();
    			p35 = element("p");
    			p35.textContent = "Playground componentinde bazı güncellemeler gerçekleştirerek, app.svelte\ndosyamızda import edelim. Import edilen componentler html içerisinde atanan\nisimle birlikte taglar içerisinde tanımlanabilir.";
    			t150 = space();
    			p36 = element("p");
    			code21 = element("code");
    			code21.textContent = "Playground.svelte";
    			t152 = space();
    			pre7 = element("pre");
    			code22 = element("code");

    			code22.textContent = `${`
some code
`}`;

    			t154 = space();
    			p37 = element("p");
    			code23 = element("code");
    			code23.textContent = "App.svelte";
    			t156 = space();
    			pre8 = element("pre");
    			code24 = element("code");

    			code24.textContent = `${`
some code
`}`;

    			t158 = space();
    			p38 = element("p");
    			img7 = element("img");
    			t159 = space();
    			p39 = element("p");
    			p39.textContent = "Playground componentimizde kartları oluşturabiliriz. Card.svelte componentinde\nkart yapısına uygun tanımlamaları gerçekleştiriyoruz. App.svelte dosyasında\nyaptığımız gibi, Card.svelte componentini Playground componentinde tanımlayalım.";
    			t161 = space();
    			span8 = element("span");
    			t162 = space();
    			h28 = element("h2");
    			h28.textContent = "GitHub Pages ile Deploy";
    			t164 = space();
    			h29 = element("h2");
    			h29.textContent = "Kaynak";
    			t166 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			p40 = element("p");
    			p40.textContent = "Svelte nedir?";
    			t168 = space();
    			li3 = element("li");
    			p41 = element("p");
    			a4 = element("a");
    			a4.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t170 = space();
    			li4 = element("li");
    			p42 = element("p");
    			p42.textContent = "Svelte Documentation:";
    			t172 = space();
    			li5 = element("li");
    			p43 = element("p");
    			a5 = element("a");
    			a5.textContent = "https://svelte.dev/examples/hello-world";
    			t174 = space();
    			li6 = element("li");
    			p44 = element("p");
    			a6 = element("a");
    			a6.textContent = "https://svelte.dev/tutorial/basics";
    			t176 = space();
    			li7 = element("li");
    			p45 = element("p");
    			a7 = element("a");
    			a7.textContent = "https://svelte.dev/docs";
    			t178 = space();
    			li8 = element("li");
    			p46 = element("p");
    			a8 = element("a");
    			a8.textContent = "https://svelte.dev/blog";
    			t180 = space();
    			li9 = element("li");
    			p47 = element("p");
    			a9 = element("a");
    			a9.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t182 = space();
    			ul2 = element("ul");
    			li10 = element("li");
    			li10.textContent = "Svelte Projesi Oluşturma";
    			t184 = space();
    			ul3 = element("ul");
    			li11 = element("li");
    			p48 = element("p");
    			a10 = element("a");
    			a10.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript";
    			t186 = space();
    			li12 = element("li");
    			p49 = element("p");
    			p49.textContent = "Bağımlılıklar";
    			t188 = space();
    			li13 = element("li");
    			p50 = element("p");
    			a11 = element("a");
    			a11.textContent = "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/";
    			t190 = space();
    			ul4 = element("ul");
    			li14 = element("li");
    			li14.textContent = "Deploy:";
    			t192 = space();
    			ul5 = element("ul");
    			li15 = element("li");
    			a12 = element("a");
    			a12.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next";
    			t194 = space();
    			ul6 = element("ul");
    			li16 = element("li");
    			li16.textContent = "md files importing";
    			t196 = space();
    			ul7 = element("ul");
    			li17 = element("li");
    			a13 = element("a");
    			a13.textContent = "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project";
    			t198 = space();
    			pre9 = element("pre");
    			code25 = element("code");
    			code25.textContent = "\n";
    			attr_dev(span0, "id", "selam-sana");
    			add_location(span0, file$3, 0, 0, 0);
    			add_location(h20, file$3, 1, 0, 30);
    			attr_dev(a0, "href", "https://svelte.dev/docs");
    			attr_dev(a0, "title", "Svelte Documentation");
    			add_location(a0, file$3, 8, 1, 480);
    			attr_dev(a1, "href", "https://svelte.dev/examples/hello-world");
    			attr_dev(a1, "title", "Svelte Examples");
    			add_location(a1, file$3, 9, 0, 553);
    			add_location(p0, file$3, 2, 0, 52);
    			attr_dev(span1, "id", "proje-hakkinda");
    			add_location(span1, file$3, 13, 0, 820);
    			add_location(h21, file$3, 14, 0, 854);
    			add_location(p1, file$3, 15, 0, 877);
    			if (!src_url_equal(img0.src, img0_src_value = "./assets/playground.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "view of cards on the playground");
    			attr_dev(img0, "title", "view of cards on the playground");
    			set_style(img0, "width", "900px");
    			add_location(img0, file$3, 23, 18, 1445);
    			attr_dev(p2, "align", "center");
    			add_location(p2, file$3, 23, 0, 1427);
    			add_location(p3, file$3, 25, 0, 1590);
    			attr_dev(span2, "id", "svelte-nedir");
    			add_location(span2, file$3, 31, 0, 2014);
    			add_location(h22, file$3, 32, 0, 2046);
    			add_location(p4, file$3, 33, 0, 2069);
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/svelte-react.jfif")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Simplicity of Svelte compiler versus react");
    			attr_dev(img1, "title", "Simplicity of Svelte compiler versus react");
    			set_style(img1, "width", "450px");
    			add_location(img1, file$3, 38, 18, 2420);
    			attr_dev(p5, "align", "center");
    			add_location(p5, file$3, 38, 0, 2402);
    			add_location(p6, file$3, 41, 0, 2594);
    			attr_dev(a2, "href", "https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks");
    			attr_dev(a2, "title", "Stack Overflow Developer Survey 2021");
    			add_location(a2, file$3, 47, 3, 2970);
    			add_location(p7, file$3, 47, 0, 2967);
    			attr_dev(span3, "id", "svelte-projesi-olusturma");
    			add_location(span3, file$3, 49, 0, 3274);
    			add_location(h23, file$3, 50, 0, 3318);
    			add_location(p8, file$3, 51, 0, 3352);
    			html_tag.a = t33;
    			add_location(p9, file$3, 53, 0, 3413);
    			html_tag_1.a = t36;
    			add_location(p10, file$3, 56, 0, 3577);
    			html_tag_2.a = t39;
    			add_location(p11, file$3, 58, 0, 3674);
    			if (!src_url_equal(img2.src, img2_src_value = "./assets/console-logs.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Port where Svelte is running on the console");
    			attr_dev(img2, "title", "Port where Svelte is running on the console");
    			add_location(img2, file$3, 62, 18, 3965);
    			attr_dev(p12, "align", "center");
    			add_location(p12, file$3, 62, 0, 3947);
    			attr_dev(span4, "id", "svelte-nasil-calisir");
    			add_location(span4, file$3, 65, 0, 4119);
    			add_location(h24, file$3, 66, 0, 4159);
    			add_location(code0, file$3, 67, 22, 4212);
    			add_location(code1, file$3, 68, 7, 4294);
    			add_location(p13, file$3, 67, 0, 4190);
    			if (!src_url_equal(img3.src, img3_src_value = "./assets/build-map.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Svelte Build map");
    			set_style(img3, "width", "800px");
    			add_location(img3, file$3, 71, 18, 4508);
    			attr_dev(p14, "align", "center");
    			add_location(p14, file$3, 71, 0, 4490);
    			add_location(p15, file$3, 72, 0, 4592);
    			attr_dev(span5, "id", "bagimliliklar");
    			add_location(span5, file$3, 74, 0, 4737);
    			add_location(h25, file$3, 75, 0, 4770);
    			add_location(h40, file$3, 77, 4, 4809);
    			add_location(code2, file$3, 80, 0, 4972);
    			add_location(code3, file$3, 80, 50, 5022);
    			add_location(li0, file$3, 77, 0, 4805);
    			add_location(h41, file$3, 81, 4, 5072);
    			add_location(li1, file$3, 81, 0, 5068);
    			add_location(ul0, file$3, 76, 0, 4800);
    			attr_dev(span6, "id", "svelte-projesini-inceleme");
    			add_location(span6, file$3, 87, 0, 5350);
    			add_location(h26, file$3, 88, 0, 5395);
    			add_location(p16, file$3, 89, 0, 5430);
    			add_location(code4, file$3, 92, 3, 5621);
    			add_location(p17, file$3, 92, 0, 5618);
    			add_location(code5, file$3, 95, 3, 5879);
    			add_location(p18, file$3, 95, 0, 5876);
    			add_location(code6, file$3, 99, 3, 6196);
    			add_location(code7, file$3, 101, 34, 6397);
    			add_location(p19, file$3, 99, 0, 6193);
    			add_location(code8, file$3, 103, 49, 6516);
    			add_location(p20, file$3, 103, 0, 6467);
    			add_location(p21, file$3, 106, 0, 6687);
    			add_location(code9, file$3, 108, 46, 6891);
    			add_location(p22, file$3, 107, 0, 6770);
    			add_location(h42, file$3, 110, 0, 7009);
    			add_location(p23, file$3, 111, 0, 7035);
    			attr_dev(code10, "class", "language-svelte");
    			add_location(code10, file$3, 116, 0, 7430);
    			add_location(p24, file$3, 115, 65, 7413);
    			set_style(pre0, "background", "#ff3e00");
    			set_style(pre0, "color", "white");
    			set_style(pre0, "font-weight", "bold");
    			set_style(pre0, "padding", "10px 15px 0 15px");
    			set_style(pre0, "margin", "15px");
    			set_style(pre0, "border-left", "5px solid black");
    			add_location(pre0, file$3, 114, 31, 7271);
    			attr_dev(div0, "class", "custom-code-block");
    			add_location(div0, file$3, 114, 0, 7240);
    			add_location(code11, file$3, 130, 29, 7662);
    			add_location(code12, file$3, 131, 49, 7775);
    			add_location(p25, file$3, 130, 0, 7633);
    			attr_dev(code13, "class", "language-svelte");
    			add_location(code13, file$3, 136, 0, 8119);
    			add_location(p26, file$3, 135, 65, 8102);
    			set_style(pre1, "background", "#ff3e00");
    			set_style(pre1, "color", "white");
    			set_style(pre1, "font-weight", "bold");
    			set_style(pre1, "padding", "10px 15px 0 15px");
    			set_style(pre1, "margin", "15px");
    			set_style(pre1, "border-left", "5px solid black");
    			add_location(pre1, file$3, 134, 31, 7960);
    			attr_dev(div1, "class", "custom-code-block");
    			add_location(div1, file$3, 134, 0, 7929);
    			attr_dev(code14, "class", "language-js");
    			add_location(code14, file$3, 146, 5, 8363);
    			add_location(pre2, file$3, 146, 0, 8358);
    			attr_dev(code15, "class", "language-html");
    			add_location(code15, file$3, 151, 5, 8508);
    			add_location(pre3, file$3, 151, 0, 8503);
    			add_location(p27, file$3, 154, 0, 8617);
    			add_location(h43, file$3, 157, 0, 8806);
    			add_location(p28, file$3, 158, 0, 8833);
    			attr_dev(code16, "class", "language-js");
    			add_location(code16, file$3, 160, 5, 8964);
    			add_location(pre4, file$3, 160, 0, 8959);
    			attr_dev(code17, "class", "language-html");
    			add_location(code17, file$3, 167, 5, 9087);
    			add_location(pre5, file$3, 167, 0, 9082);
    			attr_dev(code18, "class", "language-html");
    			add_location(code18, file$3, 174, 5, 9240);
    			add_location(pre6, file$3, 174, 0, 9235);
    			add_location(code19, file$3, 187, 43, 9543);
    			add_location(p29, file$3, 187, 0, 9500);
    			if (!src_url_equal(img4.src, img4_src_value = "./assets/gif/reactive.gif")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Svelte definition variable");
    			set_style(img4, "width", "800px");
    			add_location(img4, file$3, 189, 18, 9650);
    			attr_dev(p30, "align", "center");
    			add_location(p30, file$3, 189, 0, 9632);
    			attr_dev(span7, "id", "component-ve-dizin-yapisi");
    			add_location(span7, file$3, 191, 0, 9751);
    			add_location(h27, file$3, 192, 0, 9796);
    			add_location(h3, file$3, 193, 0, 9823);
    			if (!src_url_equal(img5.src, img5_src_value = "./assets/components/playground-component-structure.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Svelte Build map");
    			set_style(img5, "width", "750px");
    			add_location(img5, file$3, 194, 18, 9867);
    			attr_dev(a3, "href", "https://jsonvisio.com/");
    			attr_dev(a3, "title", "JSONVisio web link");
    			add_location(a3, file$3, 196, 13, 9993);
    			add_location(p31, file$3, 196, 10, 9990);
    			add_location(i, file$3, 196, 7, 9987);
    			add_location(label, file$3, 196, 0, 9980);
    			attr_dev(p32, "align", "center");
    			add_location(p32, file$3, 194, 0, 9849);
    			add_location(code20, file$3, 203, 40, 10397);
    			add_location(p33, file$3, 201, 0, 10199);
    			if (!src_url_equal(img6.src, img6_src_value = "./assets/components/playground-component-directories.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "playground component directories");
    			attr_dev(img6, "title", "playground component directories");
    			set_style(img6, "width", "750px");
    			add_location(img6, file$3, 205, 18, 10542);
    			attr_dev(p34, "align", "center");
    			add_location(p34, file$3, 205, 0, 10524);
    			add_location(h44, file$3, 208, 0, 10719);
    			add_location(p35, file$3, 209, 0, 10750);
    			add_location(code21, file$3, 212, 3, 10959);
    			add_location(p36, file$3, 212, 0, 10956);
    			attr_dev(code22, "class", "language-js");
    			add_location(code22, file$3, 213, 5, 10999);
    			add_location(pre7, file$3, 213, 0, 10994);
    			add_location(code23, file$3, 216, 3, 11059);
    			add_location(p37, file$3, 216, 0, 11056);
    			attr_dev(code24, "class", "language-js");
    			add_location(code24, file$3, 217, 5, 11092);
    			add_location(pre8, file$3, 217, 0, 11087);
    			if (!src_url_equal(img7.src, img7_src_value = "./assets/components/call-playground-component.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "playground component directories");
    			attr_dev(img7, "title", "playground component directories");
    			set_style(img7, "width", "750px");
    			add_location(img7, file$3, 220, 18, 11167);
    			attr_dev(p38, "align", "center");
    			add_location(p38, file$3, 220, 0, 11149);
    			add_location(p39, file$3, 223, 0, 11337);
    			attr_dev(span8, "id", "github-page-ile-deploy");
    			add_location(span8, file$3, 226, 0, 11580);
    			add_location(h28, file$3, 227, 0, 11622);
    			add_location(h29, file$3, 228, 0, 11655);
    			add_location(p40, file$3, 230, 4, 11680);
    			add_location(li2, file$3, 230, 0, 11676);
    			attr_dev(a4, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a4, file$3, 232, 7, 11714);
    			add_location(p41, file$3, 232, 4, 11711);
    			add_location(li3, file$3, 232, 0, 11707);
    			add_location(p42, file$3, 234, 4, 11852);
    			add_location(li4, file$3, 234, 0, 11848);
    			attr_dev(a5, "href", "https://svelte.dev/examples/hello-world");
    			add_location(a5, file$3, 236, 7, 11894);
    			add_location(p43, file$3, 236, 4, 11891);
    			add_location(li5, file$3, 236, 0, 11887);
    			attr_dev(a6, "href", "https://svelte.dev/tutorial/basics");
    			add_location(a6, file$3, 238, 7, 12005);
    			add_location(p44, file$3, 238, 4, 12002);
    			add_location(li6, file$3, 238, 0, 11998);
    			attr_dev(a7, "href", "https://svelte.dev/docs");
    			add_location(a7, file$3, 240, 7, 12106);
    			add_location(p45, file$3, 240, 4, 12103);
    			add_location(li7, file$3, 240, 0, 12099);
    			attr_dev(a8, "href", "https://svelte.dev/blog");
    			add_location(a8, file$3, 242, 7, 12185);
    			add_location(p46, file$3, 242, 4, 12182);
    			add_location(li8, file$3, 242, 0, 12178);
    			attr_dev(a9, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a9, file$3, 244, 7, 12264);
    			add_location(p47, file$3, 244, 4, 12261);
    			add_location(li9, file$3, 244, 0, 12257);
    			add_location(ul1, file$3, 229, 0, 11671);
    			add_location(li10, file$3, 248, 0, 12409);
    			add_location(ul2, file$3, 247, 0, 12404);
    			attr_dev(a10, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript");
    			add_location(a10, file$3, 251, 7, 12461);
    			add_location(p48, file$3, 251, 4, 12458);
    			add_location(li11, file$3, 251, 0, 12454);
    			add_location(p49, file$3, 253, 4, 12723);
    			add_location(li12, file$3, 253, 0, 12719);
    			attr_dev(a11, "href", "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/");
    			add_location(a11, file$3, 255, 7, 12757);
    			add_location(p50, file$3, 255, 4, 12754);
    			add_location(li13, file$3, 255, 0, 12750);
    			add_location(ul3, file$3, 250, 0, 12449);
    			add_location(li14, file$3, 259, 0, 12916);
    			add_location(ul4, file$3, 258, 0, 12911);
    			attr_dev(a12, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next");
    			add_location(a12, file$3, 262, 4, 12948);
    			add_location(li15, file$3, 262, 0, 12944);
    			add_location(ul5, file$3, 261, 0, 12939);
    			add_location(li16, file$3, 265, 0, 13222);
    			add_location(ul6, file$3, 264, 0, 13217);
    			attr_dev(a13, "href", "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project");
    			add_location(a13, file$3, 268, 4, 13265);
    			add_location(li17, file$3, 268, 0, 13261);
    			add_location(ul7, file$3, 267, 0, 13256);
    			add_location(code25, file$3, 270, 5, 13519);
    			add_location(pre9, file$3, 270, 0, 13514);
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
    			append_dev(p0, a1);
    			append_dev(p0, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, img0);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, img1);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, p6, anchor);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, a2);
    			append_dev(p7, t26);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t30, anchor);
    			insert_dev(target, p8, anchor);
    			insert_dev(target, t32, anchor);
    			html_tag.m(CODEBLOCK_1, target, anchor);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, p9, anchor);
    			insert_dev(target, t35, anchor);
    			html_tag_1.m(CODEBLOCK_2, target, anchor);
    			insert_dev(target, t36, anchor);
    			insert_dev(target, p10, anchor);
    			insert_dev(target, t38, anchor);
    			html_tag_2.m(CODEBLOCK_3, target, anchor);
    			insert_dev(target, t39, anchor);
    			insert_dev(target, p11, anchor);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, p12, anchor);
    			append_dev(p12, img2);
    			insert_dev(target, t42, anchor);
    			insert_dev(target, span4, anchor);
    			insert_dev(target, t43, anchor);
    			insert_dev(target, h24, anchor);
    			insert_dev(target, t45, anchor);
    			insert_dev(target, p13, anchor);
    			append_dev(p13, t46);
    			append_dev(p13, code0);
    			append_dev(p13, t48);
    			append_dev(p13, code1);
    			append_dev(p13, t50);
    			insert_dev(target, t51, anchor);
    			insert_dev(target, p14, anchor);
    			append_dev(p14, img3);
    			insert_dev(target, t52, anchor);
    			insert_dev(target, p15, anchor);
    			insert_dev(target, t54, anchor);
    			insert_dev(target, span5, anchor);
    			insert_dev(target, t55, anchor);
    			insert_dev(target, h25, anchor);
    			insert_dev(target, t57, anchor);
    			insert_dev(target, ul0, anchor);
    			append_dev(ul0, li0);
    			append_dev(li0, h40);
    			append_dev(li0, t59);
    			append_dev(li0, code2);
    			append_dev(li0, t61);
    			append_dev(li0, code3);
    			append_dev(li0, t63);
    			append_dev(ul0, t64);
    			append_dev(ul0, li1);
    			append_dev(li1, h41);
    			append_dev(li1, t66);
    			insert_dev(target, t67, anchor);
    			insert_dev(target, span6, anchor);
    			insert_dev(target, t68, anchor);
    			insert_dev(target, h26, anchor);
    			insert_dev(target, t70, anchor);
    			insert_dev(target, p16, anchor);
    			insert_dev(target, t72, anchor);
    			insert_dev(target, p17, anchor);
    			append_dev(p17, code4);
    			append_dev(p17, t74);
    			insert_dev(target, t75, anchor);
    			insert_dev(target, p18, anchor);
    			append_dev(p18, code5);
    			append_dev(p18, t77);
    			insert_dev(target, t78, anchor);
    			insert_dev(target, p19, anchor);
    			append_dev(p19, code6);
    			append_dev(p19, t80);
    			append_dev(p19, code7);
    			append_dev(p19, t82);
    			insert_dev(target, t83, anchor);
    			insert_dev(target, p20, anchor);
    			append_dev(p20, t84);
    			append_dev(p20, code8);
    			append_dev(p20, t86);
    			insert_dev(target, t87, anchor);
    			insert_dev(target, p21, anchor);
    			insert_dev(target, t89, anchor);
    			insert_dev(target, p22, anchor);
    			append_dev(p22, t90);
    			append_dev(p22, code9);
    			append_dev(p22, t92);
    			insert_dev(target, t93, anchor);
    			insert_dev(target, h42, anchor);
    			insert_dev(target, t95, anchor);
    			insert_dev(target, p23, anchor);
    			insert_dev(target, t97, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, pre0);
    			append_dev(pre0, p24);
    			append_dev(p24, t98);
    			append_dev(p24, code10);
    			append_dev(pre0, t100);
    			insert_dev(target, t101, anchor);
    			insert_dev(target, p25, anchor);
    			append_dev(p25, t102);
    			append_dev(p25, code11);
    			append_dev(p25, t104);
    			append_dev(p25, code12);
    			append_dev(p25, t106);
    			insert_dev(target, t107, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, pre1);
    			append_dev(pre1, p26);
    			append_dev(p26, t108);
    			append_dev(p26, code13);
    			append_dev(pre1, t110);
    			insert_dev(target, t111, anchor);
    			insert_dev(target, pre2, anchor);
    			append_dev(pre2, code14);
    			insert_dev(target, t113, anchor);
    			insert_dev(target, pre3, anchor);
    			append_dev(pre3, code15);
    			insert_dev(target, t115, anchor);
    			insert_dev(target, p27, anchor);
    			insert_dev(target, t117, anchor);
    			insert_dev(target, h43, anchor);
    			insert_dev(target, t119, anchor);
    			insert_dev(target, p28, anchor);
    			insert_dev(target, t121, anchor);
    			insert_dev(target, pre4, anchor);
    			append_dev(pre4, code16);
    			insert_dev(target, t123, anchor);
    			insert_dev(target, pre5, anchor);
    			append_dev(pre5, code17);
    			insert_dev(target, t125, anchor);
    			insert_dev(target, pre6, anchor);
    			append_dev(pre6, code18);
    			insert_dev(target, t127, anchor);
    			insert_dev(target, p29, anchor);
    			append_dev(p29, t128);
    			append_dev(p29, code19);
    			append_dev(p29, t130);
    			insert_dev(target, t131, anchor);
    			insert_dev(target, p30, anchor);
    			append_dev(p30, img4);
    			insert_dev(target, t132, anchor);
    			insert_dev(target, span7, anchor);
    			insert_dev(target, t133, anchor);
    			insert_dev(target, h27, anchor);
    			insert_dev(target, t135, anchor);
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t137, anchor);
    			insert_dev(target, p32, anchor);
    			append_dev(p32, img5);
    			append_dev(p32, t138);
    			append_dev(p32, label);
    			append_dev(label, i);
    			append_dev(i, p31);
    			append_dev(p31, a3);
    			append_dev(p31, t140);
    			insert_dev(target, t141, anchor);
    			insert_dev(target, p33, anchor);
    			append_dev(p33, t142);
    			append_dev(p33, code20);
    			append_dev(p33, t144);
    			insert_dev(target, t145, anchor);
    			insert_dev(target, p34, anchor);
    			append_dev(p34, img6);
    			insert_dev(target, t146, anchor);
    			insert_dev(target, h44, anchor);
    			insert_dev(target, t148, anchor);
    			insert_dev(target, p35, anchor);
    			insert_dev(target, t150, anchor);
    			insert_dev(target, p36, anchor);
    			append_dev(p36, code21);
    			insert_dev(target, t152, anchor);
    			insert_dev(target, pre7, anchor);
    			append_dev(pre7, code22);
    			insert_dev(target, t154, anchor);
    			insert_dev(target, p37, anchor);
    			append_dev(p37, code23);
    			insert_dev(target, t156, anchor);
    			insert_dev(target, pre8, anchor);
    			append_dev(pre8, code24);
    			insert_dev(target, t158, anchor);
    			insert_dev(target, p38, anchor);
    			append_dev(p38, img7);
    			insert_dev(target, t159, anchor);
    			insert_dev(target, p39, anchor);
    			insert_dev(target, t161, anchor);
    			insert_dev(target, span8, anchor);
    			insert_dev(target, t162, anchor);
    			insert_dev(target, h28, anchor);
    			insert_dev(target, t164, anchor);
    			insert_dev(target, h29, anchor);
    			insert_dev(target, t166, anchor);
    			insert_dev(target, ul1, anchor);
    			append_dev(ul1, li2);
    			append_dev(li2, p40);
    			append_dev(ul1, t168);
    			append_dev(ul1, li3);
    			append_dev(li3, p41);
    			append_dev(p41, a4);
    			append_dev(ul1, t170);
    			append_dev(ul1, li4);
    			append_dev(li4, p42);
    			append_dev(ul1, t172);
    			append_dev(ul1, li5);
    			append_dev(li5, p43);
    			append_dev(p43, a5);
    			append_dev(ul1, t174);
    			append_dev(ul1, li6);
    			append_dev(li6, p44);
    			append_dev(p44, a6);
    			append_dev(ul1, t176);
    			append_dev(ul1, li7);
    			append_dev(li7, p45);
    			append_dev(p45, a7);
    			append_dev(ul1, t178);
    			append_dev(ul1, li8);
    			append_dev(li8, p46);
    			append_dev(p46, a8);
    			append_dev(ul1, t180);
    			append_dev(ul1, li9);
    			append_dev(li9, p47);
    			append_dev(p47, a9);
    			insert_dev(target, t182, anchor);
    			insert_dev(target, ul2, anchor);
    			append_dev(ul2, li10);
    			insert_dev(target, t184, anchor);
    			insert_dev(target, ul3, anchor);
    			append_dev(ul3, li11);
    			append_dev(li11, p48);
    			append_dev(p48, a10);
    			append_dev(ul3, t186);
    			append_dev(ul3, li12);
    			append_dev(li12, p49);
    			append_dev(ul3, t188);
    			append_dev(ul3, li13);
    			append_dev(li13, p50);
    			append_dev(p50, a11);
    			insert_dev(target, t190, anchor);
    			insert_dev(target, ul4, anchor);
    			append_dev(ul4, li14);
    			insert_dev(target, t192, anchor);
    			insert_dev(target, ul5, anchor);
    			append_dev(ul5, li15);
    			append_dev(li15, a12);
    			insert_dev(target, t194, anchor);
    			insert_dev(target, ul6, anchor);
    			append_dev(ul6, li16);
    			insert_dev(target, t196, anchor);
    			insert_dev(target, ul7, anchor);
    			append_dev(ul7, li17);
    			append_dev(li17, a13);
    			insert_dev(target, t198, anchor);
    			insert_dev(target, pre9, anchor);
    			append_dev(pre9, code25);
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
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t30);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t32);
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t35);
    			if (detaching) html_tag_1.d();
    			if (detaching) detach_dev(t36);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t38);
    			if (detaching) html_tag_2.d();
    			if (detaching) detach_dev(t39);
    			if (detaching) detach_dev(p11);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(p12);
    			if (detaching) detach_dev(t42);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t43);
    			if (detaching) detach_dev(h24);
    			if (detaching) detach_dev(t45);
    			if (detaching) detach_dev(p13);
    			if (detaching) detach_dev(t51);
    			if (detaching) detach_dev(p14);
    			if (detaching) detach_dev(t52);
    			if (detaching) detach_dev(p15);
    			if (detaching) detach_dev(t54);
    			if (detaching) detach_dev(span5);
    			if (detaching) detach_dev(t55);
    			if (detaching) detach_dev(h25);
    			if (detaching) detach_dev(t57);
    			if (detaching) detach_dev(ul0);
    			if (detaching) detach_dev(t67);
    			if (detaching) detach_dev(span6);
    			if (detaching) detach_dev(t68);
    			if (detaching) detach_dev(h26);
    			if (detaching) detach_dev(t70);
    			if (detaching) detach_dev(p16);
    			if (detaching) detach_dev(t72);
    			if (detaching) detach_dev(p17);
    			if (detaching) detach_dev(t75);
    			if (detaching) detach_dev(p18);
    			if (detaching) detach_dev(t78);
    			if (detaching) detach_dev(p19);
    			if (detaching) detach_dev(t83);
    			if (detaching) detach_dev(p20);
    			if (detaching) detach_dev(t87);
    			if (detaching) detach_dev(p21);
    			if (detaching) detach_dev(t89);
    			if (detaching) detach_dev(p22);
    			if (detaching) detach_dev(t93);
    			if (detaching) detach_dev(h42);
    			if (detaching) detach_dev(t95);
    			if (detaching) detach_dev(p23);
    			if (detaching) detach_dev(t97);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t101);
    			if (detaching) detach_dev(p25);
    			if (detaching) detach_dev(t107);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t111);
    			if (detaching) detach_dev(pre2);
    			if (detaching) detach_dev(t113);
    			if (detaching) detach_dev(pre3);
    			if (detaching) detach_dev(t115);
    			if (detaching) detach_dev(p27);
    			if (detaching) detach_dev(t117);
    			if (detaching) detach_dev(h43);
    			if (detaching) detach_dev(t119);
    			if (detaching) detach_dev(p28);
    			if (detaching) detach_dev(t121);
    			if (detaching) detach_dev(pre4);
    			if (detaching) detach_dev(t123);
    			if (detaching) detach_dev(pre5);
    			if (detaching) detach_dev(t125);
    			if (detaching) detach_dev(pre6);
    			if (detaching) detach_dev(t127);
    			if (detaching) detach_dev(p29);
    			if (detaching) detach_dev(t131);
    			if (detaching) detach_dev(p30);
    			if (detaching) detach_dev(t132);
    			if (detaching) detach_dev(span7);
    			if (detaching) detach_dev(t133);
    			if (detaching) detach_dev(h27);
    			if (detaching) detach_dev(t135);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t137);
    			if (detaching) detach_dev(p32);
    			if (detaching) detach_dev(t141);
    			if (detaching) detach_dev(p33);
    			if (detaching) detach_dev(t145);
    			if (detaching) detach_dev(p34);
    			if (detaching) detach_dev(t146);
    			if (detaching) detach_dev(h44);
    			if (detaching) detach_dev(t148);
    			if (detaching) detach_dev(p35);
    			if (detaching) detach_dev(t150);
    			if (detaching) detach_dev(p36);
    			if (detaching) detach_dev(t152);
    			if (detaching) detach_dev(pre7);
    			if (detaching) detach_dev(t154);
    			if (detaching) detach_dev(p37);
    			if (detaching) detach_dev(t156);
    			if (detaching) detach_dev(pre8);
    			if (detaching) detach_dev(t158);
    			if (detaching) detach_dev(p38);
    			if (detaching) detach_dev(t159);
    			if (detaching) detach_dev(p39);
    			if (detaching) detach_dev(t161);
    			if (detaching) detach_dev(span8);
    			if (detaching) detach_dev(t162);
    			if (detaching) detach_dev(h28);
    			if (detaching) detach_dev(t164);
    			if (detaching) detach_dev(h29);
    			if (detaching) detach_dev(t166);
    			if (detaching) detach_dev(ul1);
    			if (detaching) detach_dev(t182);
    			if (detaching) detach_dev(ul2);
    			if (detaching) detach_dev(t184);
    			if (detaching) detach_dev(ul3);
    			if (detaching) detach_dev(t190);
    			if (detaching) detach_dev(ul4);
    			if (detaching) detach_dev(t192);
    			if (detaching) detach_dev(ul5);
    			if (detaching) detach_dev(t194);
    			if (detaching) detach_dev(ul6);
    			if (detaching) detach_dev(t196);
    			if (detaching) detach_dev(ul7);
    			if (detaching) detach_dev(t198);
    			if (detaching) detach_dev(pre9);
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

    const CODEBLOCK_1 = `<pre><code class="language-js">npx degit sveltejs/template remember-em-all
</code></pre>
`;

    const CODEBLOCK_2 = `<pre><code class="language-js">cd remember-em-all
node scripts/setupTypeScript.js
</code></pre>
`;

    const CODEBLOCK_3 = `<pre><code class="language-js">npm install
npm run dev
</code></pre>
`;

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('READMETR', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<READMETR> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		META,
    		CODEBLOCK_1,
    		CODEBLOCK_2,
    		CODEBLOCK_3
    	});

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

    var Title="ContentMap";var Description="content headers of description files";var SupportedLanguages=["TR","ENG"];var Headers={Turkish:[{title:"selam",target:"#selam-sana"},{title:"proje hakkında",target:"#proje-hakkinda"},{title:"svelte nedir?",target:"#svelte-nedir"},{title:"svelte nasıl çalışır?",target:"#svelte-nasil-calisir"},{title:"Svelte projesi oluşturma",target:"#svelte-projesi-olusturma"},{title:"bağımlılıklar",target:"#bagimliliklar"},{title:"dizin ve component yapısı",target:"#dizin-ve-component-yapisi"},{title:"github page ile deploy",target:"#github-page-ile-deploy"}],English:[{title:"hi",target:"#hi-to-you"},{title:"about the project",target:"#about-the-project"},{title:"what is svelte?",target:"#what-is-svelte"},{title:"how does Svelte work?",target:"#how-does-svelte-work"},{title:"create a Svelte project",target:"#create-a-svelte-project"},{title:"dependencies",target:"#dependencies"},{title:"directory and component structure",target:"directory-and-component-structure"},{title:"deploy with github page",target:"deploy-with-github-pages"}]};var content = {Title:Title,Description:Description,SupportedLanguages:SupportedLanguages,Headers:Headers};

    var ContentMap = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Title: Title,
        Description: Description,
        SupportedLanguages: SupportedLanguages,
        Headers: Headers,
        'default': content
    });

    /* src\components\Info\about.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\components\\Info\\about.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (21:2) {:else}
    function create_else_block(ctx) {
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(21:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:2) {#if activeLanguage === "Turkish"}
    function create_if_block$1(ctx) {
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(19:2) {#if activeLanguage === \\\"Turkish\\\"}",
    		ctx
    	});

    	return block;
    }

    // (28:6) {#each activeLanguage === "Turkish" ? Turkish : English as ContentMap}
    function create_each_block_1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*ContentMap*/ ctx[10].title[0].toUpperCase() + /*ContentMap*/ ctx[10].title.slice(1) + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*ContentMap*/ ctx[10].target);
    			attr_dev(a, "class", "svelte-1batbae");
    			add_location(a, file$2, 29, 10, 747);
    			attr_dev(li, "class", "svelte-1batbae");
    			add_location(li, file$2, 28, 8, 731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*activeLanguage*/ 1 && t0_value !== (t0_value = /*ContentMap*/ ctx[10].title[0].toUpperCase() + /*ContentMap*/ ctx[10].title.slice(1) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*activeLanguage*/ 1 && a_href_value !== (a_href_value = /*ContentMap*/ ctx[10].target)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(28:6) {#each activeLanguage === \\\"Turkish\\\" ? Turkish : English as ContentMap}",
    		ctx
    	});

    	return block;
    }

    // (38:6) {#each languages as language}
    function create_each_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*language*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = "/assets/" + /*language*/ ctx[7] + ".svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "" + (/*language*/ ctx[7] + " flag"));
    			attr_dev(img, "class", "flag svelte-1batbae");
    			add_location(img, file$2, 39, 10, 1050);
    			add_location(div, file$2, 38, 8, 990);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(38:6) {#each languages as language}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div1;
    	let img;
    	let img_src_value;
    	let t1;
    	let ul;
    	let t2;
    	let div0;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeLanguage*/ ctx[0] === "Turkish") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let each_value_1 = /*activeLanguage*/ ctx[0] === "Turkish"
    	? /*Turkish*/ ctx[2]
    	: /*English*/ ctx[3];

    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*languages*/ ctx[1];
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
    			div1 = element("div");
    			img = element("img");
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img.src, img_src_value = /*svelteLogo*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Svelte logo");
    			attr_dev(img, "class", "logo svelte-1batbae");
    			add_location(img, file$2, 25, 4, 578);
    			attr_dev(ul, "class", "svelte-1batbae");
    			add_location(ul, file$2, 26, 4, 639);
    			attr_dev(div0, "class", "flag-capsule svelte-1batbae");
    			add_location(div0, file$2, 36, 4, 917);
    			attr_dev(div1, "class", "content-map svelte-1batbae");
    			add_location(div1, file$2, 24, 2, 547);
    			attr_dev(main, "class", "container svelte-1batbae");
    			add_location(main, file$2, 17, 0, 423);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, img);
    			append_dev(div1, t1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul, null);
    			}

    			append_dev(div1, t2);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
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

    			if (dirty & /*activeLanguage, Turkish, English*/ 13) {
    				each_value_1 = /*activeLanguage*/ ctx[0] === "Turkish"
    				? /*Turkish*/ ctx[2]
    				: /*English*/ ctx[3];

    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*switchLanguages, languages*/ 18) {
    				each_value = /*languages*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
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
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let languages = ["Turkish", "English"];
    	let activeLanguage = "English";
    	let { Turkish, English } = Headers;

    	const switchLanguages = language => {
    		$$invalidate(0, activeLanguage = language);
    	};

    	let svelteLogo = "/assets/svelte-logo.png";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	const click_handler = language => switchLanguages(language);

    	$$self.$capture_state = () => ({
    		DetailEN: README,
    		DetailTR: READMETR,
    		ContentMap,
    		languages,
    		activeLanguage,
    		Turkish,
    		English,
    		switchLanguages,
    		svelteLogo
    	});

    	$$self.$inject_state = $$props => {
    		if ('languages' in $$props) $$invalidate(1, languages = $$props.languages);
    		if ('activeLanguage' in $$props) $$invalidate(0, activeLanguage = $$props.activeLanguage);
    		if ('Turkish' in $$props) $$invalidate(2, Turkish = $$props.Turkish);
    		if ('English' in $$props) $$invalidate(3, English = $$props.English);
    		if ('svelteLogo' in $$props) $$invalidate(5, svelteLogo = $$props.svelteLogo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		activeLanguage,
    		languages,
    		Turkish,
    		English,
    		switchLanguages,
    		svelteLogo,
    		click_handler
    	];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\shared\Pages.svelte generated by Svelte v3.48.0 */
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
    			attr_dev(li, "class", "svelte-ibmays");
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

    			attr_dev(ul, "class", "svelte-ibmays");
    			add_location(ul, file$1, 9, 2, 182);
    			attr_dev(div, "class", "contents svelte-ibmays");
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

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    // (20:34) 
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
    		source: "(20:34) ",
    		ctx
    	});

    	return block;
    }

    // (18:2) {#if activePage === "about"}
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
    		source: "(18:2) {#if activePage === \\\"about\\\"}",
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
    			add_location(main, file, 14, 0, 385);
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

    	// let activePage = "game";
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
