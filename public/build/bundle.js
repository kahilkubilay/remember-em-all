
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
    			add_location(input, file$g, 5, 2, 130);
    			attr_dev(div, "class", "user");
    			add_location(div, file$g, 4, 0, 108);
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
    			attr_dev(img, "class", "avatar unpicked svelte-186co7w");
    			add_location(img, file$e, 16, 0, 537);
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

    /* src\components\User\Avatar\Avatars.svelte generated by Svelte v3.48.0 */
    const file$d = "src\\components\\User\\Avatar\\Avatars.svelte";

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
    			add_location(div, file$d, 10, 0, 320);
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
    			span1.textContent = "enter a name..";
    			attr_dev(button, "class", "svelte-j6c731");
    			add_location(button, file$c, 18, 2, 531);
    			attr_dev(span0, "class", "unvisible svelte-j6c731");
    			add_location(span0, file$c, 20, 4, 617);
    			attr_dev(div0, "class", "avatarError visible svelte-j6c731");
    			add_location(div0, file$c, 19, 2, 578);
    			attr_dev(span1, "class", "unvisible svelte-j6c731");
    			add_location(span1, file$c, 23, 4, 724);
    			attr_dev(div1, "class", "nameError visible svelte-j6c731");
    			add_location(div1, file$c, 22, 2, 687);
    			attr_dev(div2, "class", "start svelte-j6c731");
    			add_location(div2, file$c, 17, 0, 508);
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
    			attr_dev(main, "class", "pokemon-cards svelte-oqckip");
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
    	let span1;
    	let t11;
    	let h21;
    	let t13;
    	let p1;
    	let t15;
    	let p2;
    	let img0;
    	let img0_src_value;
    	let t16;
    	let p3;
    	let t17;
    	let em1;
    	let t19;
    	let em2;
    	let t21;
    	let t22;
    	let span2;
    	let t23;
    	let h22;
    	let t25;
    	let p4;
    	let t26;
    	let em3;
    	let t28;
    	let t29;
    	let p5;
    	let a2;
    	let t31;
    	let t32;
    	let span3;
    	let t33;
    	let h23;
    	let t35;
    	let p6;
    	let t37;
    	let html_tag;
    	let t38;
    	let p7;
    	let t40;
    	let html_tag_1;
    	let t41;
    	let p8;
    	let t43;
    	let html_tag_2;
    	let t44;
    	let p9;
    	let t46;
    	let p10;
    	let img1;
    	let img1_src_value;
    	let t47;
    	let span4;
    	let t48;
    	let h24;
    	let t50;
    	let p11;
    	let t51;
    	let em4;
    	let t53;
    	let em5;
    	let t55;
    	let t56;
    	let p12;
    	let img2;
    	let img2_src_value;
    	let t57;
    	let p13;
    	let t59;
    	let span5;
    	let t60;
    	let h25;
    	let t62;
    	let ul0;
    	let li0;
    	let h40;
    	let t64;
    	let em6;
    	let t66;
    	let em7;
    	let t68;
    	let t69;
    	let li1;
    	let h41;
    	let t71;
    	let t72;
    	let span6;
    	let t73;
    	let h26;
    	let t75;
    	let p14;
    	let t76;
    	let em8;
    	let t78;
    	let em9;
    	let t80;
    	let em10;
    	let t82;
    	let em11;
    	let t84;
    	let em12;
    	let t86;
    	let em13;
    	let t88;
    	let t89;
    	let p15;
    	let t90;
    	let em14;
    	let t92;
    	let em15;
    	let t94;
    	let em16;
    	let t96;
    	let em17;
    	let t98;
    	let em18;
    	let t100;
    	let t101;
    	let p16;
    	let t102;
    	let em19;
    	let t104;
    	let em20;
    	let t106;
    	let em21;
    	let t108;
    	let em22;
    	let t110;
    	let t111;
    	let p17;
    	let t112;
    	let em23;
    	let t114;
    	let em24;
    	let t116;
    	let code0;
    	let t118;
    	let t119;
    	let p18;
    	let t120;
    	let code1;
    	let t122;
    	let em25;
    	let t124;
    	let t125;
    	let h27;
    	let t127;
    	let p19;
    	let t129;
    	let p20;
    	let em26;
    	let t131;
    	let em27;
    	let t133;
    	let em28;
    	let t135;
    	let a3;
    	let t137;
    	let t138;
    	let h42;
    	let t140;
    	let p21;
    	let t142;
    	let p22;
    	let em29;
    	let t144;
    	let div0;
    	let pre0;
    	let t146;
    	let pre1;
    	let t148;
    	let pre2;
    	let t150;
    	let p23;
    	let t151;
    	let em30;
    	let t153;
    	let em31;
    	let t155;
    	let em32;
    	let t157;
    	let em33;
    	let t159;
    	let t160;
    	let p24;
    	let em34;
    	let t162;
    	let div1;
    	let pre3;
    	let t164;
    	let pre4;
    	let t166;
    	let pre5;
    	let t168;
    	let p25;
    	let em35;
    	let t170;
    	let t171;
    	let h43;
    	let t173;
    	let p26;
    	let t175;
    	let p27;
    	let em36;
    	let t177;
    	let div2;
    	let pre6;
    	let t179;
    	let pre7;
    	let t181;
    	let pre8;
    	let t183;
    	let p28;
    	let t184;
    	let em37;
    	let t186;
    	let t187;
    	let p29;
    	let img3;
    	let img3_src_value;
    	let t188;
    	let h44;
    	let t190;
    	let p30;
    	let t192;
    	let p31;
    	let img4;
    	let img4_src_value;
    	let t193;
    	let p32;
    	let t195;
    	let span7;
    	let t196;
    	let h28;
    	let t198;
    	let span8;
    	let t199;
    	let h29;
    	let t201;
    	let h210;
    	let t203;
    	let ul1;
    	let li2;
    	let p33;
    	let t205;
    	let li3;
    	let p34;
    	let a4;
    	let t207;
    	let li4;
    	let p35;
    	let t209;
    	let li5;
    	let p36;
    	let a5;
    	let t211;
    	let li6;
    	let p37;
    	let a6;
    	let t213;
    	let li7;
    	let p38;
    	let a7;
    	let t215;
    	let li8;
    	let p39;
    	let a8;
    	let t217;
    	let li9;
    	let p40;
    	let a9;
    	let t219;
    	let ul2;
    	let li10;
    	let t221;
    	let ul3;
    	let li11;
    	let p41;
    	let a10;
    	let t223;
    	let li12;
    	let p42;
    	let t225;
    	let li13;
    	let p43;
    	let a11;
    	let t227;
    	let ul4;
    	let li14;
    	let t229;
    	let ul5;
    	let li15;
    	let a12;
    	let t231;
    	let ul6;
    	let li16;
    	let t233;
    	let ul7;
    	let li17;
    	let a13;
    	let t235;
    	let pre9;
    	let code2;
    	let t237;
    	let p44;

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
    			t9 = text(") sahip,\ndökümantasyonları inceledikten sonra uygulamayı takip etmen daha faydalı\nolabilir. İçeriğin özelliklerini sol tarafta bulunan haritalandırma ile takip\nedebilirsin.");
    			t10 = space();
    			span1 = element("span");
    			t11 = space();
    			h21 = element("h2");
    			h21.textContent = "Oyun Hakkında";
    			t13 = space();
    			p1 = element("p");
    			p1.textContent = "Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre\narayüz üzerinde kartlar bulunacak. Kartlara click eventi gerçekleştirildiğinde\nkartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar.\nEşleşen kartlar açık bir şekilde arayüz üzerinde dururken başarılı eşleşme\nsonucunda kullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar\nbulundukları yerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, bir\nsonraki seviyede yer alan kartlar arayüze kapalı olarak yeniden gelecektir.";
    			t15 = space();
    			p2 = element("p");
    			img0 = element("img");
    			t16 = space();
    			p3 = element("p");
    			t17 = text("Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde\nyer alan görsellerden birini seçmesi beklenecektir(Avatarlar ne kadar evcil\ngözükseler de, güç içlerinde gizli 🐱‍👤). Bu seçilen değerler oyunun arayüzünde\nkartların yer aldığı bölümün altında ");
    			em1 = element("em");
    			em1.textContent = "score & level";
    			t19 = text(" değerleri ile\nbirlikte gösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak\ntutulurken, ");
    			em2 = element("em");
    			em2.textContent = "score & level";
    			t21 = text(" değerleri dinamik olarak kullanıcı davranışına göre\ngüncellenecektir.");
    			t22 = space();
    			span2 = element("span");
    			t23 = space();
    			h22 = element("h2");
    			h22.textContent = "Svelte nedir?";
    			t25 = space();
    			p4 = element("p");
    			t26 = text("Svelte günümüz modern library ve framework habitatının komplex yapılarını\nazaltarak daha basit şekilde yüksek verimliliğe sahip uygulamalar\ngeliştirilmesini sağlamayı amaçlayan bir derleyicidir. Modern framework/library\nile birlikte geride bıraktığımız her süreçte farklı ihtiyaçlar için yeni bir\nöğrenme süreci ortaya çıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin\nkarşısına çıkması bir süre sonrasında illallah dedirtmeye başladığı gayet\naşikar. Svelte'in alışık olduğumuz ");
    			em3 = element("em");
    			em3.textContent = "html & css & js";
    			t28 = text(" kod yapılarına benzer bir\nsözdiziminin kullanılması, props ve state/stores güncellemeleri için 40 takla\natılmasına gerek kalınmaması gibi özellikleri ile bu döngünün dışına çıkmayı\nbaşarabilmiş.. ve umuyorum ki bu şekilde sadeliğini korumaya devam edebilir.");
    			t29 = space();
    			p5 = element("p");
    			a2 = element("a");
    			a2.textContent = "Stack Overflow Developer Survey 2021";
    			t31 = text(" anketinde geliştiriciler tarafından %71.47 oranıyla en çok sevilen\nweb framework Svelte olarak seçildi.");
    			t32 = space();
    			span3 = element("span");
    			t33 = space();
    			h23 = element("h2");
    			h23.textContent = "Svelte projesi oluşturma";
    			t35 = space();
    			p6 = element("p");
    			p6.textContent = "Npx ile yeni bir proje oluşturma:";
    			t37 = space();
    			html_tag = new HtmlTag(false);
    			t38 = space();
    			p7 = element("p");
    			p7.textContent = "Svelte Typescript notasyonunu desteklemektedir. Typescript üzerinde\nyapabileceğiniz bütün işlemleri Svelte projenizde kullanabilirsin.";
    			t40 = space();
    			html_tag_1 = new HtmlTag(false);
    			t41 = space();
    			p8 = element("p");
    			p8.textContent = "Gerekli olan bağımlılıkları projemize ekleyerek ayağa kaldırabiliriz.";
    			t43 = space();
    			html_tag_2 = new HtmlTag(false);
    			t44 = space();
    			p9 = element("p");
    			p9.textContent = "Bu komutlar sonrasında konsol üzerinde projenin hangi port üzerinde çalıştığını\nkontrol edebiliriz. Windows işletim sistemlerinde varsayılan 8080 portu işaretli\niken, bu port üzerinde çalışan proje bulunuyorsa veya farklı işletim sistemi\nkullanıyorsan port adresi değişkenlik gösterebilir.";
    			t46 = space();
    			p10 = element("p");
    			img1 = element("img");
    			t47 = space();
    			span4 = element("span");
    			t48 = space();
    			h24 = element("h2");
    			h24.textContent = "Svelte nasıl çalışır?";
    			t50 = space();
    			p11 = element("p");
    			t51 = text("Svelte bileşenleri ");
    			em4 = element("em");
    			em4.textContent = ".svelte";
    			t53 = text(" uzantılı dosyalar ile oluşturulur. HTML'de benzer\nolarak ");
    			em5 = element("em");
    			em5.textContent = "script, style, html";
    			t55 = text(" kod yapılarını oluşturabilirdiğiniz üç farklı bölüm\nbulunuyor. Uygulama oluşturduğumuzda bu bileşenler derlenerek, pure Javascript\nkodlarına dönüştürülür.");
    			t56 = space();
    			p12 = element("p");
    			img2 = element("img");
    			t57 = space();
    			p13 = element("p");
    			p13.textContent = "Svelte derleme işlemini runtime üzerinde gerçekleştiriyor. Bu derleme işlemiyle\nbirlikte Virtual DOM bağımlılığını ortadan kalkıyor.";
    			t59 = space();
    			span5 = element("span");
    			t60 = space();
    			h25 = element("h2");
    			h25.textContent = "Proje bağımlılıkları";
    			t62 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			h40 = element("h4");
    			h40.textContent = "Typescript";
    			t64 = text("\nTypescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı\nhataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Projenizde\nyer alan ");
    			em6 = element("em");
    			em6.textContent = ".svelte";
    			t66 = text(" uzantılı dosyalarda kullanabileceğiniz gibi, ");
    			em7 = element("em");
    			em7.textContent = ".ts";
    			t68 = text("\ndosyalarını da destekler.");
    			t69 = space();
    			li1 = element("li");
    			h41 = element("h4");
    			h41.textContent = "Rollup";
    			t71 = text("\nSvelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası\noluşturulacaktır. Rollup javascript uygulamalar için kullanılan bir modül\npaketleyicidir, uygulamamızda yer alan kodları tarayıcının anlayabileceği\nşekilde ayrıştırır.");
    			t72 = space();
    			span6 = element("span");
    			t73 = space();
    			h26 = element("h2");
    			h26.textContent = "Svelte yapısını inceleme";
    			t75 = space();
    			p14 = element("p");
    			t76 = text("Varsayılan ");
    			em8 = element("em");
    			em8.textContent = "src/App.svelte";
    			t78 = text(" dosyasını kontrol ettiğimizde daha önce\nbahsettiğimiz ");
    			em9 = element("em");
    			em9.textContent = "Javascript";
    			t80 = text(" kodları için ");
    			em10 = element("em");
    			em10.textContent = "script";
    			t82 = text(", ");
    			em11 = element("em");
    			em11.textContent = "html";
    			t84 = text(" kodları için ");
    			em12 = element("em");
    			em12.textContent = "main";
    			t86 = text(" ve\nstillendirme için ");
    			em13 = element("em");
    			em13.textContent = "style";
    			t88 = text(" tagları bulunuyor.");
    			t89 = space();
    			p15 = element("p");
    			t90 = text("🎈 ");
    			em14 = element("em");
    			em14.textContent = "script";
    			t92 = text(" etiketinde lang özelliği Typescript bağımlılığını eklediğimiz\niçin ");
    			em15 = element("em");
    			em15.textContent = "ts";
    			t94 = text(" değerinde bulunmaktadır. Typescript kullanmak istediğiniz ");
    			em16 = element("em");
    			em16.textContent = ".svelte";
    			t96 = text("\ndosyalarında ");
    			em17 = element("em");
    			em17.textContent = "lang attribute";
    			t98 = text(" özelliğine ");
    			em18 = element("em");
    			em18.textContent = "ts";
    			t100 = text(" değerini vermeniz yeterli\nolacaktır.");
    			t101 = space();
    			p16 = element("p");
    			t102 = text("🎈 ");
    			em19 = element("em");
    			em19.textContent = "main";
    			t104 = text(" etiketinde ");
    			em20 = element("em");
    			em20.textContent = "html";
    			t106 = text(" kodlarını tanımlayabileceğin gibi, bu etiketin\ndışında da dilediğin gibi ");
    			em21 = element("em");
    			em21.textContent = "html";
    			t108 = text(" kodlarını tanımlayabilirsin. Svelte\ntanımladığın kodları ");
    			em22 = element("em");
    			em22.textContent = "html";
    			t110 = text(" kodu olarak derlemesine rağmen, proje yapısının\ndaha okunabilir olabilmesi için kapsayıcı bir etiketin altında toplanması daha\niyi olabilir.");
    			t111 = space();
    			p17 = element("p");
    			t112 = text("🎈 ");
    			em23 = element("em");
    			em23.textContent = "style";
    			t114 = text(" etiketi altında tanımladığın stil özelliklerinden, aynı dosyada\nbulunan ");
    			em24 = element("em");
    			em24.textContent = "html";
    			t116 = text(" alanında seçiciler etkilenir. Global seçicileri\nkullanabileceğin gibi, global olarak tanımlamak istediğiniz seçicileri\n");
    			code0 = element("code");
    			code0.textContent = "public/global.css";
    			t118 = text(" dosyasında düzenleyebilirsin.");
    			t119 = space();
    			p18 = element("p");
    			t120 = text("🎈 Proje içerisinde compile edilen bütün yapılar ");
    			code1 = element("code");
    			code1.textContent = "/public/build/bundle.js";
    			t122 = text("\ndosyasında yer almaktadir. ");
    			em25 = element("em");
    			em25.textContent = "index.html";
    			t124 = text(" dosyası buradaki yapıyı referans alarak\nSvelte projesini kullanıcı karşısına getirmektedir.");
    			t125 = space();
    			h27 = element("h2");
    			h27.textContent = "Biraz pratik 🏃";
    			t127 = space();
    			p19 = element("p");
    			p19.textContent = "Burada birkaç örnek yaparak Svelte'i anlamaya, yorumlamaya çalışalım. Kod\nörnekleri oyun üzerinde sıkça kullanacağımız yapılar için bir temel oluşturacak.";
    			t129 = space();
    			p20 = element("p");
    			em26 = element("em");
    			em26.textContent = "App.svelte";
    			t131 = text(" dosyasında ");
    			em27 = element("em");
    			em27.textContent = "name";
    			t133 = text(" isminde bir değişken tanımlanmış. Typescript\nnotasyonu baz alındığı için değer tipi olarak ");
    			em28 = element("em");
    			em28.textContent = "string";
    			t135 = text(" verilmiş. Bu notasyon ile\nanlatım biraz daha uzun olabileceği için kullanmayacam. Github üzerinde bulunan\nkodlar ile, burada birlikte oluşturacaklarımız farklılık gösterebilir.. panik\nyok, Typescript'e ");
    			a3 = element("a");
    			a3.textContent = "hakim olabileceğine";
    			t137 = text("\neminim.");
    			t138 = space();
    			h42 = element("h4");
    			h42.textContent = "🎈 Variable erişimi";
    			t140 = space();
    			p21 = element("p");
    			p21.textContent = "Script üzerinde tanımlanan değerleri html içerisinde çağırabilmek için\n{ } kullanılmalıdır. Bu template ile değer tipi farketmeksizin\ndeğişkenleri çağırarak işlemler gerçekleştirilebilir.";
    			t142 = space();
    			p22 = element("p");
    			em29 = element("em");
    			em29.textContent = "app.svelte";
    			t144 = space();
    			div0 = element("div");
    			pre0 = element("pre");

    			pre0.textContent = `${`\<script>
  const user = "sabuha";
</script>`}`;

    			t146 = space();
    			pre1 = element("pre");

    			pre1.textContent = `${`\<span>{user} seni izliyor!</span>
`}`;

    			t148 = space();
    			pre2 = element("pre");

    			pre2.textContent = `${`\<style>
  h1 {
    color: rebeccapurple;
  }
</style>`}`;

    			t150 = space();
    			p23 = element("p");
    			t151 = text("Bu tanımlama ile birlikte ");
    			em30 = element("em");
    			em30.textContent = "user";
    			t153 = text(" değerine tanımlanan her değeri dinamik olarak\n");
    			em31 = element("em");
    			em31.textContent = "html";
    			t155 = text(" içerisinde çağırabilirsin. biraz daha biraz daha karıştıralım..\n");
    			em32 = element("em");
    			em32.textContent = "user";
    			t157 = text(" değeri ");
    			em33 = element("em");
    			em33.textContent = "sabuha";
    			t159 = text(" değerine eşit olduğu durumlarda 'seni izliyor!' yerine\n'bir kedi gördüm sanki!' değerini birlikte ekrana getirelim.");
    			t160 = space();
    			p24 = element("p");
    			em34 = element("em");
    			em34.textContent = "app.svelte";
    			t162 = space();
    			div1 = element("div");
    			pre3 = element("pre");

    			pre3.textContent = `${`\<script>
  const user = "sabuha";
</script>`}`;

    			t164 = space();
    			pre4 = element("pre");

    			pre4.textContent = `${`\<span>{user === "sabuha" ? "bir kedi gördüm sanki!" : "seni izliyor!"}</span>
`}`;

    			t166 = space();
    			pre5 = element("pre");
    			pre5.textContent = `${`\<style></style>`}`;
    			t168 = space();
    			p25 = element("p");
    			em35 = element("em");
    			em35.textContent = "html";
    			t170 = text(" içerisinde kullandığımız { } tagları arasında condition\nyapıları gibi döngü, fonksiyon çağırma işlemleri gerçekleştirebilirsin. Bu\nyapılara sahip birçok işlemi birlikte gerçekleştireceğiz.");
    			t171 = space();
    			h43 = element("h4");
    			h43.textContent = "🎈 Reaktif Değişkenler";
    			t173 = space();
    			p26 = element("p");
    			p26.textContent = "Değişkenlik gösterebilecek dinamik verilerin güncellendiğinde, DOM üzerinde\nyer alan referansı benzer olarak güncellenir.";
    			t175 = space();
    			p27 = element("p");
    			em36 = element("em");
    			em36.textContent = "app.svelte";
    			t177 = space();
    			div2 = element("div");
    			pre6 = element("pre");

    			pre6.textContent = `${`\<script>
  let number = 0;
  
  const randomNumber = () => {
    number = Math.round(Math.random() \* 15);
  };
</script>`}`;

    			t179 = space();
    			pre7 = element("pre");

    			pre7.textContent = `${`\
<main>
  <h3>{number}</h3>
  <button on:click={randomNumber}>Update Number</button>
</main>
`}`;

    			t181 = space();
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

    			t183 = space();
    			p28 = element("p");
    			t184 = text("Tanımladığımız ");
    			em37 = element("em");
    			em37.textContent = "numb";
    			t186 = text(" değeri her güncellendiğinde, DOM üzerinde bu değer\nyeniden ve sıkılmadan güncellenmeye devam edecektir.");
    			t187 = space();
    			p29 = element("p");
    			img3 = element("img");
    			t188 = space();
    			h44 = element("h4");
    			h44.textContent = "🎈 Component/Child Component kullanımları";
    			t190 = space();
    			p30 = element("p");
    			p30.textContent = "Uygulamalarımızda yer alan bileşenleri parçalayarak istediğimiz gibi bir bütün\nhaline getirebilmek üzerinde çalışırken kolaylık sağlar, tekrar eden bileşen\nparçalarında yeniden çağırabilmek daha az efor sarfettirir.";
    			t192 = space();
    			p31 = element("p");
    			img4 = element("img");
    			t193 = space();
    			p32 = element("p");
    			p32.textContent = "Bir önceki örnekte yaptığımız random sayı üreten basit yapıyı bir component\noluşturarak, yılbaşı çekilişine benzer bir uygulama haline getirelim.";
    			t195 = space();
    			span7 = element("span");
    			t196 = space();
    			h28 = element("h2");
    			h28.textContent = "Arayüzü oluşturma";
    			t198 = space();
    			span8 = element("span");
    			t199 = space();
    			h29 = element("h2");
    			h29.textContent = "GitHub Pages ile Deploy";
    			t201 = space();
    			h210 = element("h2");
    			h210.textContent = "Kaynak";
    			t203 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			p33 = element("p");
    			p33.textContent = "Svelte nedir?";
    			t205 = space();
    			li3 = element("li");
    			p34 = element("p");
    			a4 = element("a");
    			a4.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t207 = space();
    			li4 = element("li");
    			p35 = element("p");
    			p35.textContent = "Svelte Documentation:";
    			t209 = space();
    			li5 = element("li");
    			p36 = element("p");
    			a5 = element("a");
    			a5.textContent = "https://svelte.dev/examples/hello-world";
    			t211 = space();
    			li6 = element("li");
    			p37 = element("p");
    			a6 = element("a");
    			a6.textContent = "https://svelte.dev/tutorial/basics";
    			t213 = space();
    			li7 = element("li");
    			p38 = element("p");
    			a7 = element("a");
    			a7.textContent = "https://svelte.dev/docs";
    			t215 = space();
    			li8 = element("li");
    			p39 = element("p");
    			a8 = element("a");
    			a8.textContent = "https://svelte.dev/blog";
    			t217 = space();
    			li9 = element("li");
    			p40 = element("p");
    			a9 = element("a");
    			a9.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t219 = space();
    			ul2 = element("ul");
    			li10 = element("li");
    			li10.textContent = "Svelte Projesi Oluşturma";
    			t221 = space();
    			ul3 = element("ul");
    			li11 = element("li");
    			p41 = element("p");
    			a10 = element("a");
    			a10.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript";
    			t223 = space();
    			li12 = element("li");
    			p42 = element("p");
    			p42.textContent = "Bağımlılıklar";
    			t225 = space();
    			li13 = element("li");
    			p43 = element("p");
    			a11 = element("a");
    			a11.textContent = "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/";
    			t227 = space();
    			ul4 = element("ul");
    			li14 = element("li");
    			li14.textContent = "Deploy:";
    			t229 = space();
    			ul5 = element("ul");
    			li15 = element("li");
    			a12 = element("a");
    			a12.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next";
    			t231 = space();
    			ul6 = element("ul");
    			li16 = element("li");
    			li16.textContent = "md files importing";
    			t233 = space();
    			ul7 = element("ul");
    			li17 = element("li");
    			a13 = element("a");
    			a13.textContent = "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project";
    			t235 = space();
    			pre9 = element("pre");
    			code2 = element("code");
    			code2.textContent = "\n";
    			t237 = space();
    			p44 = element("p");
    			p44.textContent = ":check en file:";
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
    			attr_dev(span1, "id", "proje-hakkinda");
    			add_location(span1, file$4, 14, 0, 927);
    			add_location(h21, file$4, 15, 0, 961);
    			add_location(p1, file$4, 16, 0, 984);
    			if (!src_url_equal(img0.src, img0_src_value = "./assets/playground.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "view of cards on the playground");
    			attr_dev(img0, "title", "view of cards on the playground");
    			set_style(img0, "width", "900px");
    			add_location(img0, file$4, 23, 18, 1541);
    			attr_dev(p2, "align", "center");
    			add_location(p2, file$4, 23, 0, 1523);
    			add_location(em1, file$4, 28, 37, 1960);
    			add_location(em2, file$4, 30, 12, 2094);
    			add_location(p3, file$4, 25, 0, 1686);
    			attr_dev(span2, "id", "svelte-nedir");
    			add_location(span2, file$4, 32, 0, 2195);
    			add_location(h22, file$4, 33, 0, 2227);
    			add_location(em3, file$4, 40, 39, 2743);
    			add_location(p4, file$4, 34, 0, 2250);
    			attr_dev(a2, "href", "https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks");
    			attr_dev(a2, "title", "Stack Overflow Developer Survey 2021");
    			add_location(a2, file$4, 44, 3, 3041);
    			add_location(p5, file$4, 44, 0, 3038);
    			attr_dev(span3, "id", "svelte-projesi-olusturma");
    			add_location(span3, file$4, 46, 0, 3345);
    			add_location(h23, file$4, 47, 0, 3389);
    			add_location(p6, file$4, 48, 0, 3423);
    			html_tag.a = t38;
    			add_location(p7, file$4, 50, 0, 3484);
    			html_tag_1.a = t41;
    			add_location(p8, file$4, 53, 0, 3646);
    			html_tag_2.a = t44;
    			add_location(p9, file$4, 55, 0, 3743);
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/console-logs.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Port where Svelte is running on the console");
    			attr_dev(img1, "title", "Port where Svelte is running on the console");
    			add_location(img1, file$4, 59, 18, 4058);
    			attr_dev(p10, "align", "center");
    			add_location(p10, file$4, 59, 0, 4040);
    			attr_dev(span4, "id", "svelte-nasil-calisir");
    			add_location(span4, file$4, 62, 0, 4212);
    			add_location(h24, file$4, 63, 0, 4252);
    			add_location(em4, file$4, 64, 22, 4305);
    			add_location(em5, file$4, 65, 7, 4383);
    			add_location(p11, file$4, 64, 0, 4283);
    			if (!src_url_equal(img2.src, img2_src_value = "./assets/build-map.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Svelte Build map");
    			set_style(img2, "width", "800px");
    			add_location(img2, file$4, 68, 18, 4589);
    			attr_dev(p12, "align", "center");
    			add_location(p12, file$4, 68, 0, 4571);
    			add_location(p13, file$4, 69, 0, 4673);
    			attr_dev(span5, "id", "bagimliliklar");
    			add_location(span5, file$4, 71, 0, 4813);
    			add_location(h25, file$4, 72, 0, 4846);
    			add_location(h40, file$4, 74, 4, 4885);
    			add_location(em6, file$4, 77, 9, 5061);
    			add_location(em7, file$4, 77, 71, 5123);
    			add_location(li0, file$4, 74, 0, 4881);
    			add_location(h41, file$4, 79, 4, 5171);
    			add_location(li1, file$4, 79, 0, 5167);
    			add_location(ul0, file$4, 73, 0, 4876);
    			attr_dev(span6, "id", "svelte-projesini-inceleme");
    			add_location(span6, file$4, 85, 0, 5442);
    			add_location(h26, file$4, 86, 0, 5487);
    			add_location(em8, file$4, 87, 14, 5535);
    			add_location(em9, file$4, 88, 14, 5613);
    			add_location(em10, file$4, 88, 47, 5646);
    			add_location(em11, file$4, 88, 64, 5663);
    			add_location(em12, file$4, 88, 91, 5690);
    			add_location(em13, file$4, 89, 18, 5725);
    			add_location(p14, file$4, 87, 0, 5521);
    			add_location(em14, file$4, 90, 6, 5769);
    			add_location(em15, file$4, 91, 5, 5852);
    			add_location(em16, file$4, 91, 75, 5922);
    			add_location(em17, file$4, 92, 13, 5952);
    			add_location(em18, file$4, 92, 48, 5987);
    			add_location(p15, file$4, 90, 0, 5763);
    			add_location(em19, file$4, 94, 6, 6046);
    			add_location(em20, file$4, 94, 31, 6071);
    			add_location(em21, file$4, 95, 26, 6158);
    			add_location(em22, file$4, 96, 21, 6229);
    			add_location(p16, file$4, 94, 0, 6040);
    			add_location(em23, file$4, 99, 6, 6394);
    			add_location(em24, file$4, 100, 8, 6481);
    			add_location(code0, file$4, 102, 0, 6614);
    			add_location(p17, file$4, 99, 0, 6388);
    			add_location(code1, file$4, 103, 52, 6731);
    			add_location(em25, file$4, 104, 27, 6795);
    			add_location(p18, file$4, 103, 0, 6679);
    			add_location(h27, file$4, 106, 0, 6911);
    			add_location(p19, file$4, 107, 0, 6936);
    			add_location(em26, file$4, 109, 3, 7105);
    			add_location(em27, file$4, 109, 34, 7136);
    			add_location(em28, file$4, 110, 46, 7241);
    			attr_dev(a3, "href", "https://youtube.com/shorts/oyIO1_8uNPc");
    			attr_dev(a3, "title", "senin kocaman kalbin <33");
    			add_location(a3, file$4, 113, 22, 7463);
    			add_location(p20, file$4, 109, 0, 7102);
    			add_location(h42, file$4, 115, 0, 7584);
    			add_location(p21, file$4, 116, 0, 7613);
    			add_location(em29, file$4, 119, 3, 7821);
    			add_location(p22, file$4, 119, 0, 7818);
    			set_style(pre0, "border", "none");
    			attr_dev(pre0, "class", "prettyprint lang-js");
    			add_location(pre0, file$4, 120, 112, 7957);
    			set_style(pre1, "border", "none");
    			attr_dev(pre1, "class", "prettyprint lang-html");
    			add_location(pre1, file$4, 123, 0, 8069);
    			set_style(pre2, "border", "none");
    			attr_dev(pre2, "class", "prettyprint lang-css");
    			add_location(pre2, file$4, 126, 0, 8177);
    			attr_dev(div0, "class", "code-wrapper");
    			set_style(div0, "padding", "0 10px");
    			set_style(div0, "margin", "0 30px");
    			set_style(div0, "border", "2px dashed #ff3e00");
    			set_style(div0, "background", "#fff");
    			add_location(div0, file$4, 120, 0, 7845);
    			add_location(em30, file$4, 132, 29, 8338);
    			add_location(em31, file$4, 133, 0, 8398);
    			add_location(em32, file$4, 134, 0, 8476);
    			add_location(em33, file$4, 134, 21, 8497);
    			add_location(p23, file$4, 132, 0, 8309);
    			add_location(em34, file$4, 136, 3, 8652);
    			add_location(p24, file$4, 136, 0, 8649);
    			set_style(pre3, "border", "none");
    			attr_dev(pre3, "class", "prettyprint lang-js");
    			add_location(pre3, file$4, 138, 49, 8792);
    			set_style(pre4, "border", "none");
    			attr_dev(pre4, "class", "prettyprint lang-html");
    			add_location(pre4, file$4, 141, 0, 8904);
    			set_style(pre5, "border", "none");
    			attr_dev(pre5, "class", "prettyprint lang-css");
    			add_location(pre5, file$4, 144, 0, 9056);
    			attr_dev(div1, "class", "code-wrapper");
    			set_style(div1, "padding", "0 10px");
    			set_style(div1, "margin", "0 30px");
    			set_style(div1, "border", "2px dashed #ff3e00");
    			set_style(div1, "background", "#fff");
    			add_location(div1, file$4, 137, 0, 8676);
    			add_location(em35, file$4, 146, 3, 9149);
    			add_location(p25, file$4, 146, 0, 9146);
    			add_location(h43, file$4, 149, 0, 9366);
    			add_location(p26, file$4, 150, 0, 9398);
    			add_location(em36, file$4, 152, 3, 9530);
    			add_location(p27, file$4, 152, 0, 9527);
    			set_style(pre6, "border", "none");
    			attr_dev(pre6, "class", "prettyprint lang-js");
    			add_location(pre6, file$4, 154, 48, 9669);
    			set_style(pre7, "border", "none");
    			attr_dev(pre7, "class", "prettyprint lang-html");
    			add_location(pre7, file$4, 161, 0, 9863);
    			set_style(pre8, "border", "none");
    			attr_dev(pre8, "class", "prettyprint lang-css");
    			add_location(pre8, file$4, 168, 0, 10034);
    			attr_dev(div2, "class", "code-wrapper");
    			set_style(div2, "padding", "0 10px");
    			set_style(div2, "margin", "0 30px");
    			set_style(div2, "border", "2px dashed #ff3e00");
    			set_style(div2, "background", "white");
    			add_location(div2, file$4, 153, 0, 9554);
    			add_location(em37, file$4, 195, 18, 10538);
    			add_location(p28, file$4, 195, 0, 10520);
    			if (!src_url_equal(img3.src, img3_src_value = "./assets/gif/reactive.gif")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Svelte definition variable");
    			set_style(img3, "width", "800px");
    			add_location(img3, file$4, 197, 18, 10678);
    			attr_dev(p29, "align", "center");
    			add_location(p29, file$4, 197, 0, 10660);
    			add_location(h44, file$4, 199, 0, 10779);
    			add_location(p30, file$4, 200, 0, 10830);
    			if (!src_url_equal(img4.src, img4_src_value = "./assets/components/component-with-sabuha.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Svelte Build map");
    			set_style(img4, "width", "900px");
    			add_location(img4, file$4, 203, 18, 11071);
    			attr_dev(p31, "align", "center");
    			add_location(p31, file$4, 203, 0, 11053);
    			add_location(p32, file$4, 205, 0, 11180);
    			attr_dev(span7, "id", "component-ve-dizin-yapisi");
    			add_location(span7, file$4, 207, 0, 11333);
    			add_location(h28, file$4, 208, 0, 11378);
    			attr_dev(span8, "id", "github-page-ile-deploy");
    			add_location(span8, file$4, 209, 0, 11405);
    			add_location(h29, file$4, 210, 0, 11447);
    			add_location(h210, file$4, 211, 0, 11480);
    			add_location(p33, file$4, 213, 4, 11505);
    			add_location(li2, file$4, 213, 0, 11501);
    			attr_dev(a4, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a4, file$4, 215, 7, 11539);
    			add_location(p34, file$4, 215, 4, 11536);
    			add_location(li3, file$4, 215, 0, 11532);
    			add_location(p35, file$4, 217, 4, 11677);
    			add_location(li4, file$4, 217, 0, 11673);
    			attr_dev(a5, "href", "https://svelte.dev/examples/hello-world");
    			add_location(a5, file$4, 219, 7, 11719);
    			add_location(p36, file$4, 219, 4, 11716);
    			add_location(li5, file$4, 219, 0, 11712);
    			attr_dev(a6, "href", "https://svelte.dev/tutorial/basics");
    			add_location(a6, file$4, 221, 7, 11830);
    			add_location(p37, file$4, 221, 4, 11827);
    			add_location(li6, file$4, 221, 0, 11823);
    			attr_dev(a7, "href", "https://svelte.dev/docs");
    			add_location(a7, file$4, 223, 7, 11931);
    			add_location(p38, file$4, 223, 4, 11928);
    			add_location(li7, file$4, 223, 0, 11924);
    			attr_dev(a8, "href", "https://svelte.dev/blog");
    			add_location(a8, file$4, 225, 7, 12010);
    			add_location(p39, file$4, 225, 4, 12007);
    			add_location(li8, file$4, 225, 0, 12003);
    			attr_dev(a9, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a9, file$4, 227, 7, 12089);
    			add_location(p40, file$4, 227, 4, 12086);
    			add_location(li9, file$4, 227, 0, 12082);
    			add_location(ul1, file$4, 212, 0, 11496);
    			add_location(li10, file$4, 231, 0, 12234);
    			add_location(ul2, file$4, 230, 0, 12229);
    			attr_dev(a10, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript");
    			add_location(a10, file$4, 234, 7, 12286);
    			add_location(p41, file$4, 234, 4, 12283);
    			add_location(li11, file$4, 234, 0, 12279);
    			add_location(p42, file$4, 236, 4, 12548);
    			add_location(li12, file$4, 236, 0, 12544);
    			attr_dev(a11, "href", "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/");
    			add_location(a11, file$4, 238, 7, 12582);
    			add_location(p43, file$4, 238, 4, 12579);
    			add_location(li13, file$4, 238, 0, 12575);
    			add_location(ul3, file$4, 233, 0, 12274);
    			add_location(li14, file$4, 242, 0, 12741);
    			add_location(ul4, file$4, 241, 0, 12736);
    			attr_dev(a12, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next");
    			add_location(a12, file$4, 245, 4, 12773);
    			add_location(li15, file$4, 245, 0, 12769);
    			add_location(ul5, file$4, 244, 0, 12764);
    			add_location(li16, file$4, 248, 0, 13047);
    			add_location(ul6, file$4, 247, 0, 13042);
    			attr_dev(a13, "href", "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project");
    			add_location(a13, file$4, 251, 4, 13090);
    			add_location(li17, file$4, 251, 0, 13086);
    			add_location(ul7, file$4, 250, 0, 13081);
    			add_location(code2, file$4, 253, 5, 13344);
    			add_location(pre9, file$4, 253, 0, 13339);
    			add_location(p44, file$4, 255, 0, 13365);
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
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, img0);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t17);
    			append_dev(p3, em1);
    			append_dev(p3, t19);
    			append_dev(p3, em2);
    			append_dev(p3, t21);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t26);
    			append_dev(p4, em3);
    			append_dev(p4, t28);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, a2);
    			append_dev(p5, t31);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t35, anchor);
    			insert_dev(target, p6, anchor);
    			insert_dev(target, t37, anchor);
    			html_tag.m(CODEBLOCK_1$1, target, anchor);
    			insert_dev(target, t38, anchor);
    			insert_dev(target, p7, anchor);
    			insert_dev(target, t40, anchor);
    			html_tag_1.m(CODEBLOCK_2$1, target, anchor);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, p8, anchor);
    			insert_dev(target, t43, anchor);
    			html_tag_2.m(CODEBLOCK_3$1, target, anchor);
    			insert_dev(target, t44, anchor);
    			insert_dev(target, p9, anchor);
    			insert_dev(target, t46, anchor);
    			insert_dev(target, p10, anchor);
    			append_dev(p10, img1);
    			insert_dev(target, t47, anchor);
    			insert_dev(target, span4, anchor);
    			insert_dev(target, t48, anchor);
    			insert_dev(target, h24, anchor);
    			insert_dev(target, t50, anchor);
    			insert_dev(target, p11, anchor);
    			append_dev(p11, t51);
    			append_dev(p11, em4);
    			append_dev(p11, t53);
    			append_dev(p11, em5);
    			append_dev(p11, t55);
    			insert_dev(target, t56, anchor);
    			insert_dev(target, p12, anchor);
    			append_dev(p12, img2);
    			insert_dev(target, t57, anchor);
    			insert_dev(target, p13, anchor);
    			insert_dev(target, t59, anchor);
    			insert_dev(target, span5, anchor);
    			insert_dev(target, t60, anchor);
    			insert_dev(target, h25, anchor);
    			insert_dev(target, t62, anchor);
    			insert_dev(target, ul0, anchor);
    			append_dev(ul0, li0);
    			append_dev(li0, h40);
    			append_dev(li0, t64);
    			append_dev(li0, em6);
    			append_dev(li0, t66);
    			append_dev(li0, em7);
    			append_dev(li0, t68);
    			append_dev(ul0, t69);
    			append_dev(ul0, li1);
    			append_dev(li1, h41);
    			append_dev(li1, t71);
    			insert_dev(target, t72, anchor);
    			insert_dev(target, span6, anchor);
    			insert_dev(target, t73, anchor);
    			insert_dev(target, h26, anchor);
    			insert_dev(target, t75, anchor);
    			insert_dev(target, p14, anchor);
    			append_dev(p14, t76);
    			append_dev(p14, em8);
    			append_dev(p14, t78);
    			append_dev(p14, em9);
    			append_dev(p14, t80);
    			append_dev(p14, em10);
    			append_dev(p14, t82);
    			append_dev(p14, em11);
    			append_dev(p14, t84);
    			append_dev(p14, em12);
    			append_dev(p14, t86);
    			append_dev(p14, em13);
    			append_dev(p14, t88);
    			insert_dev(target, t89, anchor);
    			insert_dev(target, p15, anchor);
    			append_dev(p15, t90);
    			append_dev(p15, em14);
    			append_dev(p15, t92);
    			append_dev(p15, em15);
    			append_dev(p15, t94);
    			append_dev(p15, em16);
    			append_dev(p15, t96);
    			append_dev(p15, em17);
    			append_dev(p15, t98);
    			append_dev(p15, em18);
    			append_dev(p15, t100);
    			insert_dev(target, t101, anchor);
    			insert_dev(target, p16, anchor);
    			append_dev(p16, t102);
    			append_dev(p16, em19);
    			append_dev(p16, t104);
    			append_dev(p16, em20);
    			append_dev(p16, t106);
    			append_dev(p16, em21);
    			append_dev(p16, t108);
    			append_dev(p16, em22);
    			append_dev(p16, t110);
    			insert_dev(target, t111, anchor);
    			insert_dev(target, p17, anchor);
    			append_dev(p17, t112);
    			append_dev(p17, em23);
    			append_dev(p17, t114);
    			append_dev(p17, em24);
    			append_dev(p17, t116);
    			append_dev(p17, code0);
    			append_dev(p17, t118);
    			insert_dev(target, t119, anchor);
    			insert_dev(target, p18, anchor);
    			append_dev(p18, t120);
    			append_dev(p18, code1);
    			append_dev(p18, t122);
    			append_dev(p18, em25);
    			append_dev(p18, t124);
    			insert_dev(target, t125, anchor);
    			insert_dev(target, h27, anchor);
    			insert_dev(target, t127, anchor);
    			insert_dev(target, p19, anchor);
    			insert_dev(target, t129, anchor);
    			insert_dev(target, p20, anchor);
    			append_dev(p20, em26);
    			append_dev(p20, t131);
    			append_dev(p20, em27);
    			append_dev(p20, t133);
    			append_dev(p20, em28);
    			append_dev(p20, t135);
    			append_dev(p20, a3);
    			append_dev(p20, t137);
    			insert_dev(target, t138, anchor);
    			insert_dev(target, h42, anchor);
    			insert_dev(target, t140, anchor);
    			insert_dev(target, p21, anchor);
    			insert_dev(target, t142, anchor);
    			insert_dev(target, p22, anchor);
    			append_dev(p22, em29);
    			insert_dev(target, t144, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, pre0);
    			append_dev(div0, t146);
    			append_dev(div0, pre1);
    			append_dev(div0, t148);
    			append_dev(div0, pre2);
    			insert_dev(target, t150, anchor);
    			insert_dev(target, p23, anchor);
    			append_dev(p23, t151);
    			append_dev(p23, em30);
    			append_dev(p23, t153);
    			append_dev(p23, em31);
    			append_dev(p23, t155);
    			append_dev(p23, em32);
    			append_dev(p23, t157);
    			append_dev(p23, em33);
    			append_dev(p23, t159);
    			insert_dev(target, t160, anchor);
    			insert_dev(target, p24, anchor);
    			append_dev(p24, em34);
    			insert_dev(target, t162, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, pre3);
    			append_dev(div1, t164);
    			append_dev(div1, pre4);
    			append_dev(div1, t166);
    			append_dev(div1, pre5);
    			insert_dev(target, t168, anchor);
    			insert_dev(target, p25, anchor);
    			append_dev(p25, em35);
    			append_dev(p25, t170);
    			insert_dev(target, t171, anchor);
    			insert_dev(target, h43, anchor);
    			insert_dev(target, t173, anchor);
    			insert_dev(target, p26, anchor);
    			insert_dev(target, t175, anchor);
    			insert_dev(target, p27, anchor);
    			append_dev(p27, em36);
    			insert_dev(target, t177, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, pre6);
    			append_dev(div2, t179);
    			append_dev(div2, pre7);
    			append_dev(div2, t181);
    			append_dev(div2, pre8);
    			insert_dev(target, t183, anchor);
    			insert_dev(target, p28, anchor);
    			append_dev(p28, t184);
    			append_dev(p28, em37);
    			append_dev(p28, t186);
    			insert_dev(target, t187, anchor);
    			insert_dev(target, p29, anchor);
    			append_dev(p29, img3);
    			insert_dev(target, t188, anchor);
    			insert_dev(target, h44, anchor);
    			insert_dev(target, t190, anchor);
    			insert_dev(target, p30, anchor);
    			insert_dev(target, t192, anchor);
    			insert_dev(target, p31, anchor);
    			append_dev(p31, img4);
    			insert_dev(target, t193, anchor);
    			insert_dev(target, p32, anchor);
    			insert_dev(target, t195, anchor);
    			insert_dev(target, span7, anchor);
    			insert_dev(target, t196, anchor);
    			insert_dev(target, h28, anchor);
    			insert_dev(target, t198, anchor);
    			insert_dev(target, span8, anchor);
    			insert_dev(target, t199, anchor);
    			insert_dev(target, h29, anchor);
    			insert_dev(target, t201, anchor);
    			insert_dev(target, h210, anchor);
    			insert_dev(target, t203, anchor);
    			insert_dev(target, ul1, anchor);
    			append_dev(ul1, li2);
    			append_dev(li2, p33);
    			append_dev(ul1, t205);
    			append_dev(ul1, li3);
    			append_dev(li3, p34);
    			append_dev(p34, a4);
    			append_dev(ul1, t207);
    			append_dev(ul1, li4);
    			append_dev(li4, p35);
    			append_dev(ul1, t209);
    			append_dev(ul1, li5);
    			append_dev(li5, p36);
    			append_dev(p36, a5);
    			append_dev(ul1, t211);
    			append_dev(ul1, li6);
    			append_dev(li6, p37);
    			append_dev(p37, a6);
    			append_dev(ul1, t213);
    			append_dev(ul1, li7);
    			append_dev(li7, p38);
    			append_dev(p38, a7);
    			append_dev(ul1, t215);
    			append_dev(ul1, li8);
    			append_dev(li8, p39);
    			append_dev(p39, a8);
    			append_dev(ul1, t217);
    			append_dev(ul1, li9);
    			append_dev(li9, p40);
    			append_dev(p40, a9);
    			insert_dev(target, t219, anchor);
    			insert_dev(target, ul2, anchor);
    			append_dev(ul2, li10);
    			insert_dev(target, t221, anchor);
    			insert_dev(target, ul3, anchor);
    			append_dev(ul3, li11);
    			append_dev(li11, p41);
    			append_dev(p41, a10);
    			append_dev(ul3, t223);
    			append_dev(ul3, li12);
    			append_dev(li12, p42);
    			append_dev(ul3, t225);
    			append_dev(ul3, li13);
    			append_dev(li13, p43);
    			append_dev(p43, a11);
    			insert_dev(target, t227, anchor);
    			insert_dev(target, ul4, anchor);
    			append_dev(ul4, li14);
    			insert_dev(target, t229, anchor);
    			insert_dev(target, ul5, anchor);
    			append_dev(ul5, li15);
    			append_dev(li15, a12);
    			insert_dev(target, t231, anchor);
    			insert_dev(target, ul6, anchor);
    			append_dev(ul6, li16);
    			insert_dev(target, t233, anchor);
    			insert_dev(target, ul7, anchor);
    			append_dev(ul7, li17);
    			append_dev(li17, a13);
    			insert_dev(target, t235, anchor);
    			insert_dev(target, pre9, anchor);
    			append_dev(pre9, code2);
    			insert_dev(target, t237, anchor);
    			insert_dev(target, p44, anchor);
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
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t35);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t37);
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t38);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t40);
    			if (detaching) html_tag_1.d();
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t43);
    			if (detaching) html_tag_2.d();
    			if (detaching) detach_dev(t44);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t46);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t47);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t48);
    			if (detaching) detach_dev(h24);
    			if (detaching) detach_dev(t50);
    			if (detaching) detach_dev(p11);
    			if (detaching) detach_dev(t56);
    			if (detaching) detach_dev(p12);
    			if (detaching) detach_dev(t57);
    			if (detaching) detach_dev(p13);
    			if (detaching) detach_dev(t59);
    			if (detaching) detach_dev(span5);
    			if (detaching) detach_dev(t60);
    			if (detaching) detach_dev(h25);
    			if (detaching) detach_dev(t62);
    			if (detaching) detach_dev(ul0);
    			if (detaching) detach_dev(t72);
    			if (detaching) detach_dev(span6);
    			if (detaching) detach_dev(t73);
    			if (detaching) detach_dev(h26);
    			if (detaching) detach_dev(t75);
    			if (detaching) detach_dev(p14);
    			if (detaching) detach_dev(t89);
    			if (detaching) detach_dev(p15);
    			if (detaching) detach_dev(t101);
    			if (detaching) detach_dev(p16);
    			if (detaching) detach_dev(t111);
    			if (detaching) detach_dev(p17);
    			if (detaching) detach_dev(t119);
    			if (detaching) detach_dev(p18);
    			if (detaching) detach_dev(t125);
    			if (detaching) detach_dev(h27);
    			if (detaching) detach_dev(t127);
    			if (detaching) detach_dev(p19);
    			if (detaching) detach_dev(t129);
    			if (detaching) detach_dev(p20);
    			if (detaching) detach_dev(t138);
    			if (detaching) detach_dev(h42);
    			if (detaching) detach_dev(t140);
    			if (detaching) detach_dev(p21);
    			if (detaching) detach_dev(t142);
    			if (detaching) detach_dev(p22);
    			if (detaching) detach_dev(t144);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t150);
    			if (detaching) detach_dev(p23);
    			if (detaching) detach_dev(t160);
    			if (detaching) detach_dev(p24);
    			if (detaching) detach_dev(t162);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t168);
    			if (detaching) detach_dev(p25);
    			if (detaching) detach_dev(t171);
    			if (detaching) detach_dev(h43);
    			if (detaching) detach_dev(t173);
    			if (detaching) detach_dev(p26);
    			if (detaching) detach_dev(t175);
    			if (detaching) detach_dev(p27);
    			if (detaching) detach_dev(t177);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t183);
    			if (detaching) detach_dev(p28);
    			if (detaching) detach_dev(t187);
    			if (detaching) detach_dev(p29);
    			if (detaching) detach_dev(t188);
    			if (detaching) detach_dev(h44);
    			if (detaching) detach_dev(t190);
    			if (detaching) detach_dev(p30);
    			if (detaching) detach_dev(t192);
    			if (detaching) detach_dev(p31);
    			if (detaching) detach_dev(t193);
    			if (detaching) detach_dev(p32);
    			if (detaching) detach_dev(t195);
    			if (detaching) detach_dev(span7);
    			if (detaching) detach_dev(t196);
    			if (detaching) detach_dev(h28);
    			if (detaching) detach_dev(t198);
    			if (detaching) detach_dev(span8);
    			if (detaching) detach_dev(t199);
    			if (detaching) detach_dev(h29);
    			if (detaching) detach_dev(t201);
    			if (detaching) detach_dev(h210);
    			if (detaching) detach_dev(t203);
    			if (detaching) detach_dev(ul1);
    			if (detaching) detach_dev(t219);
    			if (detaching) detach_dev(ul2);
    			if (detaching) detach_dev(t221);
    			if (detaching) detach_dev(ul3);
    			if (detaching) detach_dev(t227);
    			if (detaching) detach_dev(ul4);
    			if (detaching) detach_dev(t229);
    			if (detaching) detach_dev(ul5);
    			if (detaching) detach_dev(t231);
    			if (detaching) detach_dev(ul6);
    			if (detaching) detach_dev(t233);
    			if (detaching) detach_dev(ul7);
    			if (detaching) detach_dev(t235);
    			if (detaching) detach_dev(pre9);
    			if (detaching) detach_dev(t237);
    			if (detaching) detach_dev(p44);
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

    // (22:2) {:else}
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
    		source: "(22:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#if activeLanguage === "Turkish"}
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
    		source: "(20:2) {#if activeLanguage === \\\"Turkish\\\"}",
    		ctx
    	});

    	return block;
    }

    // (29:6) {#each activeLanguage === "Turkish" ? Turkish : English as ContentMap}
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
    			add_location(a, file$2, 30, 10, 751);
    			attr_dev(li, "class", "svelte-1batbae");
    			add_location(li, file$2, 29, 8, 735);
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
    		source: "(29:6) {#each activeLanguage === \\\"Turkish\\\" ? Turkish : English as ContentMap}",
    		ctx
    	});

    	return block;
    }

    // (39:6) {#each languages as language}
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
    			add_location(img, file$2, 40, 10, 1054);
    			add_location(div, file$2, 39, 8, 994);
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
    		source: "(39:6) {#each languages as language}",
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
    			add_location(img, file$2, 26, 4, 582);
    			attr_dev(ul, "class", "svelte-1batbae");
    			add_location(ul, file$2, 27, 4, 643);
    			attr_dev(div0, "class", "flag-capsule svelte-1batbae");
    			add_location(div0, file$2, 37, 4, 921);
    			attr_dev(div1, "class", "content-map svelte-1batbae");
    			add_location(div1, file$2, 25, 2, 551);
    			attr_dev(main, "class", "container svelte-1batbae");
    			add_location(main, file$2, 18, 0, 427);
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

    // (19:34) 
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
    		source: "(19:34) ",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#if activePage === "about"}
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
    		source: "(17:2) {#if activePage === \\\"about\\\"}",
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
    			add_location(main, file, 13, 0, 354);
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
