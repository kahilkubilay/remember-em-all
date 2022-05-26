
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
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
    function empty() {
        return text('');
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
    const file$q = "src\\components\\Playground\\Cards\\CardBack.svelte";

    function create_fragment$r(ctx) {
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
    			attr_dev(img, "class", "single-poke svelte-zflbip");
    			attr_dev(img, "alt", "card back on the playing field");
    			add_location(img, file$q, 9, 2, 215);
    			attr_dev(div, "class", "back svelte-zflbip");
    			add_location(div, file$q, 8, 0, 146);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { pokemon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardBack",
    			options,
    			id: create_fragment$r.name
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

    const file$p = "src\\components\\Playground\\Cards\\CardFront.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + /*pokemonId*/ ctx[0] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "card front on the playing field");
    			attr_dev(img, "class", "single-poke svelte-1punsq8");
    			attr_dev(img, "pokemondetail", /*pokemonId*/ ctx[0]);
    			add_location(img, file$p, 7, 2, 101);
    			attr_dev(div, "class", "front svelte-1punsq8");
    			add_location(div, file$p, 6, 0, 78);
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { pokemon: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardFront",
    			options,
    			id: create_fragment$q.name
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

    const file$o = "src\\components\\Playground\\Cards\\Card.svelte";

    function create_fragment$p(ctx) {
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
    			attr_dev(div, "class", "flipper svelte-43yf2a");
    			toggle_class(div, "hover", /*$cardFlipperCapsule*/ ctx[4].includes(/*pokemonNo*/ ctx[1]) || /*$catchEmAll*/ ctx[3].includes(/*pokemonId*/ ctx[2]));
    			add_location(div, file$o, 47, 2, 1266);
    			attr_dev(main, "class", "flip-container svelte-43yf2a");
    			add_location(main, file$o, 46, 0, 1233);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { pokemon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$p.name
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
        constructor(name = writable(''), avatar = writable(''), 
        // public score: Writable<number> = writable(0),
        isStart = writable(false)) {
            this.name = name;
            this.avatar = avatar;
            this.isStart = isStart;
        }
    }
    const userInfo = new UserInfo();

    /* src\components\User\name\UserName.svelte generated by Svelte v3.48.0 */
    const file$n = "src\\components\\User\\name\\UserName.svelte";

    function create_fragment$o(ctx) {
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
    			add_location(input, file$n, 7, 2, 128);
    			attr_dev(div, "class", "user");
    			add_location(div, file$n, 6, 0, 106);
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserName",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\components\User\Header.svelte generated by Svelte v3.48.0 */

    const file$m = "src\\components\\User\\Header.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "select your best pokemon and start catching!";
    			add_location(h2, file$m, 1, 2, 24);
    			attr_dev(div, "class", "header svelte-1tuqxk");
    			add_location(div, file$m, 0, 0, 0);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\components\User\Avatar\ImageAvatar.svelte generated by Svelte v3.48.0 */
    const file$l = "src\\components\\User\\Avatar\\ImageAvatar.svelte";

    function create_fragment$m(ctx) {
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
    			add_location(img, file$l, 10, 0, 209);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { userSelectAvatar: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageAvatar",
    			options,
    			id: create_fragment$m.name
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
    const file$k = "src\\components\\User\\Avatar\\Avatars.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (15:2) {#each avatars as userSelectAvatar}
    function create_each_block$4(ctx) {
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(15:2) {#each avatars as userSelectAvatar}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let current;
    	let each_value = /*avatars*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
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
    			add_location(div, file$k, 13, 0, 332);
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
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avatars",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\components\User\Start.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file$j = "src\\components\\User\\Start.svelte";

    function create_fragment$k(ctx) {
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
    			add_location(button, file$j, 27, 2, 504);
    			attr_dev(span0, "class", "unvisible svelte-j6c731");
    			toggle_class(span0, "visible", /*$avatar*/ ctx[3] === "" && /*isAvatarEmpty*/ ctx[0]);
    			add_location(span0, file$j, 29, 4, 590);
    			attr_dev(div0, "class", "avatarError visible svelte-j6c731");
    			add_location(div0, file$j, 28, 2, 551);
    			attr_dev(span1, "class", "unvisible svelte-j6c731");
    			toggle_class(span1, "visible", /*$name*/ ctx[2] === "" && /*isNameEmpty*/ ctx[1]);
    			add_location(span1, file$j, 34, 4, 759);
    			attr_dev(div1, "class", "nameError visible svelte-j6c731");
    			add_location(div1, file$j, 33, 2, 722);
    			attr_dev(div2, "class", "start svelte-j6c731");
    			add_location(div2, file$j, 26, 0, 481);
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Start> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Start",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\components\User\UserGround.svelte generated by Svelte v3.48.0 */
    const file$i = "src\\components\\User\\UserGround.svelte";

    function create_fragment$j(ctx) {
    	let main;
    	let header;
    	let t0;
    	let avatars;
    	let t1;
    	let username;
    	let t2;
    	let start;
    	let current;
    	header = new Header$1({ $$inline: true });
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
    			add_location(main, file$i, 6, 0, 203);
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
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserGround', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserGround> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ UserName, Header: Header$1, Avatars, Start });
    	return [];
    }

    class UserGround extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserGround",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\components\GameElements\Score.svelte generated by Svelte v3.48.0 */
    const file$h = "src\\components\\GameElements\\Score.svelte";

    function create_fragment$i(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("score: ");
    			t1 = text(/*$score*/ ctx[0]);
    			attr_dev(p, "class", "svelte-15spofw");
    			add_location(p, file$h, 3, 0, 75);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Score",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\components\GameElements\Level.svelte generated by Svelte v3.48.0 */
    const file$g = "src\\components\\GameElements\\Level.svelte";

    function create_fragment$h(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("level: ");
    			t1 = text(/*$level*/ ctx[0]);
    			attr_dev(p, "class", "svelte-15spofw");
    			add_location(p, file$g, 3, 0, 75);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\User\name\UserSelectName.svelte generated by Svelte v3.48.0 */
    const file$f = "src\\components\\User\\name\\UserSelectName.svelte";

    function create_fragment$g(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*$name*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-5vegqh");
    			add_location(h3, file$f, 4, 0, 108);
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSelectName",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\User\Avatar\UserSelectAvatar.svelte generated by Svelte v3.48.0 */
    const file$e = "src\\components\\User\\Avatar\\UserSelectAvatar.svelte";

    function create_fragment$f(ctx) {
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
    			add_location(image, file$e, 20, 6, 832);
    			attr_dev(pattern, "id", "image");
    			attr_dev(pattern, "patternUnits", "userSpaceOnUse");
    			attr_dev(pattern, "height", "150");
    			attr_dev(pattern, "width", "150");
    			add_location(pattern, file$e, 19, 4, 749);
    			add_location(defs, file$e, 18, 2, 737);
    			attr_dev(circle, "id", "top");
    			attr_dev(circle, "cx", "75");
    			attr_dev(circle, "cy", "60");
    			attr_dev(circle, "r", "50");
    			attr_dev(circle, "fill", "url(#image)");
    			attr_dev(circle, "stroke", "#6a0dad");
    			attr_dev(circle, "stroke-width", "8");
    			add_location(circle, file$e, 23, 2, 932);
    			attr_dev(svg, "width", "150");
    			attr_dev(svg, "height", "120");
    			attr_dev(svg, "stroke-dashoffset", /*scoreDegree*/ ctx[0]);
    			attr_dev(svg, "class", "svelte-1cs56u2");
    			add_location(svg, file$e, 17, 0, 671);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSelectAvatar",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\User\UserDetail.svelte generated by Svelte v3.48.0 */
    const file$d = "src\\components\\User\\UserDetail.svelte";

    function create_fragment$e(ctx) {
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
    			add_location(main, file$d, 6, 0, 249);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserDetail",
    			options,
    			id: create_fragment$e.name
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
    const file$c = "src\\components\\Playground\\Wrapper\\Playground.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (22:2) {:else}
    function create_else_block$2(ctx) {
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(22:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if $isStart}
    function create_if_block$8(ctx) {
    	let t;
    	let userdetail;
    	let current;
    	let each_value = /*mixedListOfPokemon*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(16:2) {#if $isStart}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#each mixedListOfPokemon as pokemon}
    function create_each_block$3(ctx) {
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(17:4) {#each mixedListOfPokemon as pokemon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$2];
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
    			add_location(main, file$c, 14, 0, 525);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playground",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    var name="memory-game";var component="Content";var description="content in the documents section";var detail={selamlar:{id:"selam-sana",header:"Selamlaaaaar 👋",text:"Herşeyden önce umuyorum ki bu basit döküman Svelte yolculuğunda rehber olabilir. Son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte'in yapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu dökümanı oluşturdum. Döküman içerisinde adım adım _Game_ bağlantısında görebileğin oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsan aynı adımları takip ederek benzer bir uygulama oluşturabilir, veya küçük bir kaynak modelinde kullanabilirsin. Svelte içeriği iyi ayrıntılanmış dökümantasyonlara ([docs](https://svelte.dev/docs 'Svelte Documentation'), [examples](https://svelte.dev/examples/hello-world 'Svelte Examples')) sahip, dökümantasyonları inceledikten sonra uygulamayı takip etmen daha faydalı olabilir.",image:"assets/documentation/squirtle-squad.webp",alternativeText:"Selamlar",description:"İçeriğin detaylarını sol tarafta yer alan haritalandırma ile takip edebilirsin. İlk bölümlerde Svelte'i nasıl kullanabileceğine dair bilgilendirmeler yer alıyor. Bu kısımlara hakimsen, atlayarak [Start Game](#start-game 'Access Start Game section') bölümünden devam edebilirsin."},oyunHakkinda:{id:"oyun-hakkinda",header:"Oyun hakkında",text:"Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre arayüz üzerinde kartlar bulunacak. Kartlara click eventi gerçekleştiğinde kartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar. Eşleşen kartlar açık bir şekilde arayüz üzerinde dururken başarılı eşleşme sonucunda kullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar bulundukları yerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, bir sonraki seviyede yer alan kartlar arayüze kapalı olarak yeniden gelecektir.",image:"assets/documentation/playground.png",alternativeText:"view of cards on the playground",description:"Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde yer alan görsellerden birini seçmesi beklenecektir (Avatarlar ne kadar evcil gözükseler de, güç içlerinde gizli 🐱‍👤). Bu seçilen değerler oyunun arayüzünde kartların yer aldığı bölümün altında _score & level_ değerleri ile birlikte gösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak tutulurken, _score & level_ değerleri dinamik olarak kullanıcı davranışına göre güncellenecektir."},svelteNedir:{id:"svelte-nedir",header:"Svelte nedir?",text:"Svelte günümüz modern library ve framework habitatının komplex yapılarını azaltarak daha basit şekilde yüksek verimliliğe sahip uygulamalar geliştirilmesini sağlamayı amaçlayan bir derleyicidir. Modern framework/library ile birlikte geride bıraktığımız her süreçte farklı ihtiyaçlar için yeni bir öğrenme süreci ortaya çıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin karşısına çıkması bir süre sonrasında illallah dedirtmeye başladığı gayet aşikar. Svelte alışık olduğumuz _html & css & js_ kod yapılarına benzer bir sözdizimine sahip olması, props ve state/stores güncellemeleri için 40 takla atılmasına gerek kalınmaması gibi özellikleri ile bu döngünün dışına çıkmayı başarabilmiş.. ve umuyorum ki bu şekilde sadeliğini korumaya devam edebilir.",description:"[Stack Overflow Developer Survey 2021](https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks 'Stack Overflow Developer Survey 2021') anketinde geliştiriciler tarafından %71.47 oranıyla en çok sevilen web framework Svelte olarak seçildi."},basitIfadeler:{id:"basit-ifadeler",header:"Basit İfadeler",text:"Bazı bölümlerde aynı kelimeleri tekrar etmemek için, bazı kısayol ifadeleri kullandım(tamamen salladım). Sayısı çok fazla değil, sorun yaşayacağını düşünmüyorum.",material:[{command:"_Playground_",description:"Playground.svelte Component"},{command:"+ User.svelte",description:"_User.svelte_ dosyası oluşturuldu."},{command:"Avatar/",description:"_Avatar_ klasörü oluşturuldu."},{command:"+ User.svelte + Header.svelte + Avatars.svelte",description:"_User.svelte, Header.svelte, Avatars.svelte_ dosyaları oluşturuldu."},{command:"+ User > Avatar.svelte",description:"_User_ klasörü içerisinde _Avatar.svelte_ dosyası oluşturuldu."},{command:"+ public > assets > images > pasa.jpg, sabuha.jpg",description:"_public > assets > images_ klasörü içerisinde _pasa.jpg_, _sabuha.jpg_ dosyaları oluşturuldu."}]},svelteProjesiOlusturma:{id:"svelte-projesi-olusturma",header:"Svelte projesi oluşturma",child:{text:"Bu komutlar sonrasında konsol üzerinde projenin hangi port üzerinde çalıştığını görebilirsin. Windows işletim sistemlerinde varsayılan 8080 portu işaretli iken, bu port üzerinde çalışan proje bulunuyorsa veya farklı işletim sistemi kullanıyorsan port numarası değişkenlik gösterebilir.",image:"assets/documentation/console-logs.png",alternativeText:"Port where Svelte is running on the console"},custom:{list:[{command:"npx degit sveltejs/template remember-em-all",description:"Npx ile yeni bir proje oluşturma:"},{command:"cd remember-em-all, node scripts/setupTypeScript.js",description:"Svelte Typescript notasyonunu desteklemektedir. Typescript üzerinde yapabileceğiniz bütün işlemleri Svelte projelerinde kullanabilirsin."},{command:"npm install, npm run dev",description:"Gerekli olan bağımlılıkları projemize ekleyerek ayağa kaldırabiliriz."}]}},svelteNasilCalisir:{id:"svelte-nasil-calisir",header:"Svelte nasıl çalışır?",text:"Svelte bileşenleri _.svelte_ uzantılı dosyalar ile oluşturulur. HTML'e benzer olarak _script, style, html_ kod yapılarını oluşturabilirdiğiniz üç farklı bölüm bulunuyor.",image:"/assets/documentation/build-map.png",alternativeText:"Svelte Build map",description:"Uygulama oluşturduğumuzda bu bileşenler derlenerek, pure _Javascript_ kodlarına dönüştürülür. Svelte derleme işlemini runtime üzerinde gerçekleştiriyor. Bu derleme işlemiyle birlikte Virtual DOM bağımlılığını ortadan kalkıyor."},bagimliliklar:{id:"bagimliliklar",header:"Proje bağımlılıkları",material:[{command:"Typescript",description:"Typescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı hataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Projenizde yer alan _.svelte_ uzantılı dosyalarda kullanabileceğiniz gibi, _.ts_ dosyalarını da destekler."},{command:"Rollup",description:"Svelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası oluşturulacaktır. Rollup Javascript uygulamalar için kullanılan bir modül paketleyicidir, uygulamamızda yer alan kodları tarayıcının anlayabileceği şekilde ayrıştırır. Svelte kurulumunda default olarak projenize eklenir."}]},svelteYapisiniInceleme:{id:"svelte-yapisini-inceleme",header:"Svelte yapısını inceleme",text:"Varsayılan _src/App.svelte_ dosyasını kontrol ettiğimizde daha önce değindiğimiz gibi _Javascript_ kodları için _script_, _html_ kodları için _main_ ve stillendirme için _style_ tagları bulunuyor.",list:["_script_ etiketinde _lang_ özelliği Typescript bağımlılığını eklediğimiz için _ts_ değerinde bulunmaktadır. Typescript kullanmak istediğin _svelte_ dosyalarında _lang_ özelliğine _ts_ değerini vermen yeterli olacaktır.","_main_ etiketinde _html_ kodlarını tanımlayabileceğin gibi, bu etiketin dışında da dilediğin gibi _html_ kodlarını tanımlayabilirsin. Svelte tanımladığın kodları _html_ kodu olarak derlemesine rağmen, proje yapısının daha okunabilir olabilmesi için kapsayıcı bir etiketin altında toplanması daha iyi olabilir.","_style_ etiketi altında tanımladığın stil özelliklerinden, aynı dosyada bulunan _html_ alanında seçiciler etkilenir. Global seçicileri tanımlayabilir veya global olarak tanımlamak istediğin seçicileri `public/global.css` dosyasında düzenleyebilirsin.","Proje içerisinde compile edilen bütün yapılar `/public/build/bundle.js` dosyasında yer almaktadir. _index.html_ dosyası buradaki yapıyı referans alarak Svelte projesini kullanıcı karşısına getirmektedir."]},birazPratik:{id:"biraz-pratik",header:"Biraz Pratik",text:"Birkaç örnek yaparak Svelte'i anlamaya, yorumlamaya çalışalım. Kod örnekleri oyun üzerinde sıkça kullanacağımız yapılar için bir temel oluşturacak.",description:"_App.svelte_ dosyasında _name_ isminde bir değişken tanımlanmış. Typescript notasyonu baz alındığı için değer tipi olarak _string_ verilmiş. Bu notasyon ile anlatım biraz daha uzun olabileceği için kullanmamayı tercih edicem. Github üzerinde bulunan kodlar ile, burada birlikte oluşturacaklarımız farklılık gösterebilir.. panik yok, Typescript'e [hakim olabileceğine](https://youtube.com/shorts/oyIO1_8uNPc 'senin kocaman kalbin <33') eminim."}};var ContentData = {name:name,component:component,description:description,detail:detail};

    /* src\components\Docs\Section\Templates\Paragraph.svelte generated by Svelte v3.48.0 */

    const file$b = "src\\components\\Docs\\Section\\Templates\\Paragraph.svelte";

    // (8:0) {#if textData !== "" && typeof textData === "string"}
    function create_if_block$7(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${/*textData*/ ctx[0]}`;
    			add_location(p, file$b, 8, 2, 170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(8:0) {#if textData !== \\\"\\\" && typeof textData === \\\"string\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;
    	let if_block = /*textData*/ ctx[0] !== "" && typeof /*textData*/ ctx[0] === "string" && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*textData*/ ctx[0] !== "" && typeof /*textData*/ ctx[0] === "string") if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Paragraph', slots, []);
    	let { text } = $$props;
    	let { description } = $$props;
    	const textData = text || description;
    	const writable_props = ['text', 'description'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Paragraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    	};

    	$$self.$capture_state = () => ({ text, description, textData });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [textData, text, description];
    }

    class Paragraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { text: 1, description: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paragraph",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<Paragraph> was created without expected prop 'text'");
    		}

    		if (/*description*/ ctx[2] === undefined && !('description' in props)) {
    			console.warn("<Paragraph> was created without expected prop 'description'");
    		}
    	}

    	get text() {
    		throw new Error("<Paragraph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Paragraph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Paragraph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Paragraph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\Header.svelte generated by Svelte v3.48.0 */

    const file$a = "src\\components\\Docs\\Section\\Templates\\Header.svelte";

    // (5:0) {#if header !== "" && typeof header === "string"}
    function create_if_block$6(ctx) {
    	let h2;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text("🪁 ");
    			t1 = text(/*header*/ ctx[0]);
    			add_location(h2, file$a, 5, 2, 98);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*header*/ 1) set_data_dev(t1, /*header*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(5:0) {#if header !== \\\"\\\" && typeof header === \\\"string\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;
    	let if_block = /*header*/ ctx[0] !== "" && typeof /*header*/ ctx[0] === "string" && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*header*/ ctx[0] !== "" && typeof /*header*/ ctx[0] === "string") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	validate_slots('Header', slots, []);
    	let { header } = $$props;
    	const writable_props = ['header'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    	};

    	$$self.$capture_state = () => ({ header });

    	$$self.$inject_state = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [header];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { header: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*header*/ ctx[0] === undefined && !('header' in props)) {
    			console.warn("<Header> was created without expected prop 'header'");
    		}
    	}

    	get header() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\Image.svelte generated by Svelte v3.48.0 */

    const file$9 = "src\\components\\Docs\\Section\\Templates\\Image.svelte";

    // (6:0) {#if image !== "" && typeof image === "string" && alternativeText !== "" && typeof alternativeText === "string"}
    function create_if_block$5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alternativeText*/ ctx[1]);
    			attr_dev(img, "title", /*alternativeText*/ ctx[1]);
    			attr_dev(img, "class", "svelte-1568p5j");
    			add_location(img, file$9, 6, 2, 191);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*image*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alternativeText*/ 2) {
    				attr_dev(img, "alt", /*alternativeText*/ ctx[1]);
    			}

    			if (dirty & /*alternativeText*/ 2) {
    				attr_dev(img, "title", /*alternativeText*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(6:0) {#if image !== \\\"\\\" && typeof image === \\\"string\\\" && alternativeText !== \\\"\\\" && typeof alternativeText === \\\"string\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let if_block = /*image*/ ctx[0] !== "" && typeof /*image*/ ctx[0] === "string" && /*alternativeText*/ ctx[1] !== "" && typeof /*alternativeText*/ ctx[1] === "string" && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*image*/ ctx[0] !== "" && typeof /*image*/ ctx[0] === "string" && /*alternativeText*/ ctx[1] !== "" && typeof /*alternativeText*/ ctx[1] === "string") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { image } = $$props;
    	let { alternativeText } = $$props;
    	const writable_props = ['image', 'alternativeText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('image' in $$props) $$invalidate(0, image = $$props.image);
    		if ('alternativeText' in $$props) $$invalidate(1, alternativeText = $$props.alternativeText);
    	};

    	$$self.$capture_state = () => ({ image, alternativeText });

    	$$self.$inject_state = $$props => {
    		if ('image' in $$props) $$invalidate(0, image = $$props.image);
    		if ('alternativeText' in $$props) $$invalidate(1, alternativeText = $$props.alternativeText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [image, alternativeText];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { image: 0, alternativeText: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*image*/ ctx[0] === undefined && !('image' in props)) {
    			console.warn("<Image> was created without expected prop 'image'");
    		}

    		if (/*alternativeText*/ ctx[1] === undefined && !('alternativeText' in props)) {
    			console.warn("<Image> was created without expected prop 'alternativeText'");
    		}
    	}

    	get image() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alternativeText() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alternativeText(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\List.svelte generated by Svelte v3.48.0 */

    const file$8 = "src\\components\\Docs\\Section\\Templates\\List.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (5:0) {#if material !== "" && material !== undefined}
    function create_if_block$4(ctx) {
    	let ul;
    	let each_value = /*material*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$8, 5, 2, 98);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*material*/ 1) {
    				each_value = /*material*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(5:0) {#if material !== \\\"\\\" && material !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (7:4) {#each material as matter}
    function create_each_block$2(ctx) {
    	let li;
    	let t0_value = /*matter*/ ctx[1].command + "";
    	let t0;
    	let t1;
    	let t2_value = /*matter*/ ctx[1].description + "";
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = text(": ");
    			t2 = text(t2_value);
    			add_location(li, file$8, 7, 6, 142);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*material*/ 1 && t0_value !== (t0_value = /*matter*/ ctx[1].command + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*material*/ 1 && t2_value !== (t2_value = /*matter*/ ctx[1].description + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(7:4) {#each material as matter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;
    	let if_block = /*material*/ ctx[0] !== "" && /*material*/ ctx[0] !== undefined && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*material*/ ctx[0] !== "" && /*material*/ ctx[0] !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	let { material } = $$props;
    	const writable_props = ['material'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('material' in $$props) $$invalidate(0, material = $$props.material);
    	};

    	$$self.$capture_state = () => ({ material });

    	$$self.$inject_state = $$props => {
    		if ('material' in $$props) $$invalidate(0, material = $$props.material);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [material];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { material: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*material*/ ctx[0] === undefined && !('material' in props)) {
    			console.warn("<List> was created without expected prop 'material'");
    		}
    	}

    	get material() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set material(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\ArrayList.svelte generated by Svelte v3.48.0 */

    const file$7 = "src\\components\\Docs\\Section\\Templates\\ArrayList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (5:0) {#if list !== "" && list !== undefined}
    function create_if_block$3(ctx) {
    	let ul;
    	let each_value = /*list*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$7, 5, 2, 86);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list*/ 1) {
    				each_value = /*list*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(5:0) {#if list !== \\\"\\\" && list !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (7:4) {#each list as matter}
    function create_each_block$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*matter*/ ctx[1] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("🎈 ");
    			t1 = text(t1_value);
    			add_location(li, file$7, 7, 6, 126);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list*/ 1 && t1_value !== (t1_value = /*matter*/ ctx[1] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(7:4) {#each list as matter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let if_block = /*list*/ ctx[0] !== "" && /*list*/ ctx[0] !== undefined && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*list*/ ctx[0] !== "" && /*list*/ ctx[0] !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrayList', slots, []);
    	let { list } = $$props;
    	const writable_props = ['list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArrayList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	$$self.$capture_state = () => ({ list });

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [list];
    }

    class ArrayList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { list: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrayList",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*list*/ ctx[0] === undefined && !('list' in props)) {
    			console.warn("<ArrayList> was created without expected prop 'list'");
    		}
    	}

    	get list() {
    		throw new Error("<ArrayList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<ArrayList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\Section.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\components\\Docs\\Section\\Templates\\Section.svelte";

    function create_fragment$7(ctx) {
    	let main;
    	let header_1;
    	let t0;
    	let paragraph0;
    	let t1;
    	let image_1;
    	let t2;
    	let paragraph1;
    	let t3;
    	let list_1;
    	let t4;
    	let arraylist;
    	let current;

    	header_1 = new Header({
    			props: { header: /*header*/ ctx[0] },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*text*/ ctx[1] },
    			$$inline: true
    		});

    	image_1 = new Image({
    			props: {
    				image: /*image*/ ctx[2],
    				alternativeText: /*alternativeText*/ ctx[3]
    			},
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: { description: /*description*/ ctx[4] },
    			$$inline: true
    		});

    	list_1 = new List({
    			props: { material: /*material*/ ctx[5] },
    			$$inline: true
    		});

    	arraylist = new ArrayList({
    			props: { list: /*list*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header_1.$$.fragment);
    			t0 = space();
    			create_component(paragraph0.$$.fragment);
    			t1 = space();
    			create_component(image_1.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(list_1.$$.fragment);
    			t4 = space();
    			create_component(arraylist.$$.fragment);
    			attr_dev(main, "class", "svelte-1llcncq");
    			add_location(main, file$6, 18, 0, 611);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header_1, main, null);
    			append_dev(main, t0);
    			mount_component(paragraph0, main, null);
    			append_dev(main, t1);
    			mount_component(image_1, main, null);
    			append_dev(main, t2);
    			mount_component(paragraph1, main, null);
    			append_dev(main, t3);
    			mount_component(list_1, main, null);
    			append_dev(main, t4);
    			mount_component(arraylist, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_1.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(image_1.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(list_1.$$.fragment, local);
    			transition_in(arraylist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_1.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(image_1.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(list_1.$$.fragment, local);
    			transition_out(arraylist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header_1);
    			destroy_component(paragraph0);
    			destroy_component(image_1);
    			destroy_component(paragraph1);
    			destroy_component(list_1);
    			destroy_component(arraylist);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section', slots, []);
    	let { detail } = $$props;
    	const header = (detail || {}).header || "";
    	const text = (detail || {}).text || "";
    	const image = (detail || {}).image || "";
    	const alternativeText = (detail || {}).alternativeText || "";
    	const description = (detail || {}).description || "";
    	const material = (detail || {}).material || "";
    	const list = (detail || {}).list || "";
    	const writable_props = ['detail'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('detail' in $$props) $$invalidate(7, detail = $$props.detail);
    	};

    	$$self.$capture_state = () => ({
    		Paragraph,
    		Header,
    		Image,
    		List,
    		ArrayList,
    		detail,
    		header,
    		text,
    		image,
    		alternativeText,
    		description,
    		material,
    		list
    	});

    	$$self.$inject_state = $$props => {
    		if ('detail' in $$props) $$invalidate(7, detail = $$props.detail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [header, text, image, alternativeText, description, material, list, detail];
    }

    class Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { detail: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*detail*/ ctx[7] === undefined && !('detail' in props)) {
    			console.warn("<Section> was created without expected prop 'detail'");
    		}
    	}

    	get detail() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detail(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    if (window.Prism)
        console.warn('Prism has already been initiated. Please ensure that svelte-prism is imported first.');

    window.Prism = window.Prism || {};
    window.Prism.manual = true;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var prism$1 = createCommonjsModule(function (module) {
    /* **********************************************
         Begin prism-core.js
    ********************************************** */

    /// <reference lib="WebWorker"/>

    var _self = (typeof window !== 'undefined')
    	? window   // if in browser
    	: (
    		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    			? self // if in worker
    			: {}   // if in node js
    	);

    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     *
     * @license MIT <https://opensource.org/licenses/MIT>
     * @author Lea Verou <https://lea.verou.me>
     * @namespace
     * @public
     */
    var Prism = (function (_self) {

    	// Private helper vars
    	var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
    	var uniqueId = 0;

    	// The grammar object for plaintext
    	var plainTextGrammar = {};


    	var _ = {
    		/**
    		 * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
    		 * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
    		 * additional languages or plugins yourself.
    		 *
    		 * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
    		 *
    		 * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
    		 * empty Prism object into the global scope before loading the Prism script like this:
    		 *
    		 * ```js
    		 * window.Prism = window.Prism || {};
    		 * Prism.manual = true;
    		 * // add a new <script> to load Prism's script
    		 * ```
    		 *
    		 * @default false
    		 * @type {boolean}
    		 * @memberof Prism
    		 * @public
    		 */
    		manual: _self.Prism && _self.Prism.manual,
    		/**
    		 * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
    		 * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
    		 * own worker, you don't want it to do this.
    		 *
    		 * By setting this value to `true`, Prism will not add its own listeners to the worker.
    		 *
    		 * You obviously have to change this value before Prism executes. To do this, you can add an
    		 * empty Prism object into the global scope before loading the Prism script like this:
    		 *
    		 * ```js
    		 * window.Prism = window.Prism || {};
    		 * Prism.disableWorkerMessageHandler = true;
    		 * // Load Prism's script
    		 * ```
    		 *
    		 * @default false
    		 * @type {boolean}
    		 * @memberof Prism
    		 * @public
    		 */
    		disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

    		/**
    		 * A namespace for utility methods.
    		 *
    		 * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
    		 * change or disappear at any time.
    		 *
    		 * @namespace
    		 * @memberof Prism
    		 */
    		util: {
    			encode: function encode(tokens) {
    				if (tokens instanceof Token) {
    					return new Token(tokens.type, encode(tokens.content), tokens.alias);
    				} else if (Array.isArray(tokens)) {
    					return tokens.map(encode);
    				} else {
    					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
    				}
    			},

    			/**
    			 * Returns the name of the type of the given value.
    			 *
    			 * @param {any} o
    			 * @returns {string}
    			 * @example
    			 * type(null)      === 'Null'
    			 * type(undefined) === 'Undefined'
    			 * type(123)       === 'Number'
    			 * type('foo')     === 'String'
    			 * type(true)      === 'Boolean'
    			 * type([1, 2])    === 'Array'
    			 * type({})        === 'Object'
    			 * type(String)    === 'Function'
    			 * type(/abc+/)    === 'RegExp'
    			 */
    			type: function (o) {
    				return Object.prototype.toString.call(o).slice(8, -1);
    			},

    			/**
    			 * Returns a unique number for the given object. Later calls will still return the same number.
    			 *
    			 * @param {Object} obj
    			 * @returns {number}
    			 */
    			objId: function (obj) {
    				if (!obj['__id']) {
    					Object.defineProperty(obj, '__id', { value: ++uniqueId });
    				}
    				return obj['__id'];
    			},

    			/**
    			 * Creates a deep clone of the given object.
    			 *
    			 * The main intended use of this function is to clone language definitions.
    			 *
    			 * @param {T} o
    			 * @param {Record<number, any>} [visited]
    			 * @returns {T}
    			 * @template T
    			 */
    			clone: function deepClone(o, visited) {
    				visited = visited || {};

    				var clone; var id;
    				switch (_.util.type(o)) {
    					case 'Object':
    						id = _.util.objId(o);
    						if (visited[id]) {
    							return visited[id];
    						}
    						clone = /** @type {Record<string, any>} */ ({});
    						visited[id] = clone;

    						for (var key in o) {
    							if (o.hasOwnProperty(key)) {
    								clone[key] = deepClone(o[key], visited);
    							}
    						}

    						return /** @type {any} */ (clone);

    					case 'Array':
    						id = _.util.objId(o);
    						if (visited[id]) {
    							return visited[id];
    						}
    						clone = [];
    						visited[id] = clone;

    						(/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {
    							clone[i] = deepClone(v, visited);
    						});

    						return /** @type {any} */ (clone);

    					default:
    						return o;
    				}
    			},

    			/**
    			 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
    			 *
    			 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
    			 *
    			 * @param {Element} element
    			 * @returns {string}
    			 */
    			getLanguage: function (element) {
    				while (element) {
    					var m = lang.exec(element.className);
    					if (m) {
    						return m[1].toLowerCase();
    					}
    					element = element.parentElement;
    				}
    				return 'none';
    			},

    			/**
    			 * Sets the Prism `language-xxxx` class of the given element.
    			 *
    			 * @param {Element} element
    			 * @param {string} language
    			 * @returns {void}
    			 */
    			setLanguage: function (element, language) {
    				// remove all `language-xxxx` classes
    				// (this might leave behind a leading space)
    				element.className = element.className.replace(RegExp(lang, 'gi'), '');

    				// add the new `language-xxxx` class
    				// (using `classList` will automatically clean up spaces for us)
    				element.classList.add('language-' + language);
    			},

    			/**
    			 * Returns the script element that is currently executing.
    			 *
    			 * This does __not__ work for line script element.
    			 *
    			 * @returns {HTMLScriptElement | null}
    			 */
    			currentScript: function () {
    				if (typeof document === 'undefined') {
    					return null;
    				}
    				if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
    					return /** @type {any} */ (document.currentScript);
    				}

    				// IE11 workaround
    				// we'll get the src of the current script by parsing IE11's error stack trace
    				// this will not work for inline scripts

    				try {
    					throw new Error();
    				} catch (err) {
    					// Get file src url from stack. Specifically works with the format of stack traces in IE.
    					// A stack will look like this:
    					//
    					// Error
    					//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
    					//    at Global code (http://localhost/components/prism-core.js:606:1)

    					var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
    					if (src) {
    						var scripts = document.getElementsByTagName('script');
    						for (var i in scripts) {
    							if (scripts[i].src == src) {
    								return scripts[i];
    							}
    						}
    					}
    					return null;
    				}
    			},

    			/**
    			 * Returns whether a given class is active for `element`.
    			 *
    			 * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
    			 * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
    			 * given class is just the given class with a `no-` prefix.
    			 *
    			 * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
    			 * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
    			 * ancestors have the given class or the negated version of it, then the default activation will be returned.
    			 *
    			 * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
    			 * version of it, the class is considered active.
    			 *
    			 * @param {Element} element
    			 * @param {string} className
    			 * @param {boolean} [defaultActivation=false]
    			 * @returns {boolean}
    			 */
    			isActive: function (element, className, defaultActivation) {
    				var no = 'no-' + className;

    				while (element) {
    					var classList = element.classList;
    					if (classList.contains(className)) {
    						return true;
    					}
    					if (classList.contains(no)) {
    						return false;
    					}
    					element = element.parentElement;
    				}
    				return !!defaultActivation;
    			}
    		},

    		/**
    		 * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
    		 *
    		 * @namespace
    		 * @memberof Prism
    		 * @public
    		 */
    		languages: {
    			/**
    			 * The grammar for plain, unformatted text.
    			 */
    			plain: plainTextGrammar,
    			plaintext: plainTextGrammar,
    			text: plainTextGrammar,
    			txt: plainTextGrammar,

    			/**
    			 * Creates a deep copy of the language with the given id and appends the given tokens.
    			 *
    			 * If a token in `redef` also appears in the copied language, then the existing token in the copied language
    			 * will be overwritten at its original position.
    			 *
    			 * ## Best practices
    			 *
    			 * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
    			 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
    			 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
    			 *
    			 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
    			 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
    			 *
    			 * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
    			 * @param {Grammar} redef The new tokens to append.
    			 * @returns {Grammar} The new language created.
    			 * @public
    			 * @example
    			 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
    			 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
    			 *     // at its original position
    			 *     'comment': { ... },
    			 *     // CSS doesn't have a 'color' token, so this token will be appended
    			 *     'color': /\b(?:red|green|blue)\b/
    			 * });
    			 */
    			extend: function (id, redef) {
    				var lang = _.util.clone(_.languages[id]);

    				for (var key in redef) {
    					lang[key] = redef[key];
    				}

    				return lang;
    			},

    			/**
    			 * Inserts tokens _before_ another token in a language definition or any other grammar.
    			 *
    			 * ## Usage
    			 *
    			 * This helper method makes it easy to modify existing languages. For example, the CSS language definition
    			 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
    			 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
    			 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
    			 * this:
    			 *
    			 * ```js
    			 * Prism.languages.markup.style = {
    			 *     // token
    			 * };
    			 * ```
    			 *
    			 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
    			 * before existing tokens. For the CSS example above, you would use it like this:
    			 *
    			 * ```js
    			 * Prism.languages.insertBefore('markup', 'cdata', {
    			 *     'style': {
    			 *         // token
    			 *     }
    			 * });
    			 * ```
    			 *
    			 * ## Special cases
    			 *
    			 * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
    			 * will be ignored.
    			 *
    			 * This behavior can be used to insert tokens after `before`:
    			 *
    			 * ```js
    			 * Prism.languages.insertBefore('markup', 'comment', {
    			 *     'comment': Prism.languages.markup.comment,
    			 *     // tokens after 'comment'
    			 * });
    			 * ```
    			 *
    			 * ## Limitations
    			 *
    			 * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
    			 * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
    			 * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
    			 * deleting properties which is necessary to insert at arbitrary positions.
    			 *
    			 * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
    			 * Instead, it will create a new object and replace all references to the target object with the new one. This
    			 * can be done without temporarily deleting properties, so the iteration order is well-defined.
    			 *
    			 * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
    			 * you hold the target object in a variable, then the value of the variable will not change.
    			 *
    			 * ```js
    			 * var oldMarkup = Prism.languages.markup;
    			 * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
    			 *
    			 * assert(oldMarkup !== Prism.languages.markup);
    			 * assert(newMarkup === Prism.languages.markup);
    			 * ```
    			 *
    			 * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
    			 * object to be modified.
    			 * @param {string} before The key to insert before.
    			 * @param {Grammar} insert An object containing the key-value pairs to be inserted.
    			 * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
    			 * object to be modified.
    			 *
    			 * Defaults to `Prism.languages`.
    			 * @returns {Grammar} The new grammar object.
    			 * @public
    			 */
    			insertBefore: function (inside, before, insert, root) {
    				root = root || /** @type {any} */ (_.languages);
    				var grammar = root[inside];
    				/** @type {Grammar} */
    				var ret = {};

    				for (var token in grammar) {
    					if (grammar.hasOwnProperty(token)) {

    						if (token == before) {
    							for (var newToken in insert) {
    								if (insert.hasOwnProperty(newToken)) {
    									ret[newToken] = insert[newToken];
    								}
    							}
    						}

    						// Do not insert token which also occur in insert. See #1525
    						if (!insert.hasOwnProperty(token)) {
    							ret[token] = grammar[token];
    						}
    					}
    				}

    				var old = root[inside];
    				root[inside] = ret;

    				// Update references in other language definitions
    				_.languages.DFS(_.languages, function (key, value) {
    					if (value === old && key != inside) {
    						this[key] = ret;
    					}
    				});

    				return ret;
    			},

    			// Traverse a language definition with Depth First Search
    			DFS: function DFS(o, callback, type, visited) {
    				visited = visited || {};

    				var objId = _.util.objId;

    				for (var i in o) {
    					if (o.hasOwnProperty(i)) {
    						callback.call(o, i, o[i], type || i);

    						var property = o[i];
    						var propertyType = _.util.type(property);

    						if (propertyType === 'Object' && !visited[objId(property)]) {
    							visited[objId(property)] = true;
    							DFS(property, callback, null, visited);
    						} else if (propertyType === 'Array' && !visited[objId(property)]) {
    							visited[objId(property)] = true;
    							DFS(property, callback, i, visited);
    						}
    					}
    				}
    			}
    		},

    		plugins: {},

    		/**
    		 * This is the most high-level function in Prism’s API.
    		 * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
    		 * each one of them.
    		 *
    		 * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
    		 *
    		 * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
    		 * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
    		 * @memberof Prism
    		 * @public
    		 */
    		highlightAll: function (async, callback) {
    			_.highlightAllUnder(document, async, callback);
    		},

    		/**
    		 * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
    		 * {@link Prism.highlightElement} on each one of them.
    		 *
    		 * The following hooks will be run:
    		 * 1. `before-highlightall`
    		 * 2. `before-all-elements-highlight`
    		 * 3. All hooks of {@link Prism.highlightElement} for each element.
    		 *
    		 * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
    		 * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
    		 * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
    		 * @memberof Prism
    		 * @public
    		 */
    		highlightAllUnder: function (container, async, callback) {
    			var env = {
    				callback: callback,
    				container: container,
    				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
    			};

    			_.hooks.run('before-highlightall', env);

    			env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

    			_.hooks.run('before-all-elements-highlight', env);

    			for (var i = 0, element; (element = env.elements[i++]);) {
    				_.highlightElement(element, async === true, env.callback);
    			}
    		},

    		/**
    		 * Highlights the code inside a single element.
    		 *
    		 * The following hooks will be run:
    		 * 1. `before-sanity-check`
    		 * 2. `before-highlight`
    		 * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
    		 * 4. `before-insert`
    		 * 5. `after-highlight`
    		 * 6. `complete`
    		 *
    		 * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
    		 * the element's language.
    		 *
    		 * @param {Element} element The element containing the code.
    		 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
    		 * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
    		 * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
    		 * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
    		 *
    		 * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
    		 * asynchronous highlighting to work. You can build your own bundle on the
    		 * [Download page](https://prismjs.com/download.html).
    		 * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
    		 * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
    		 * @memberof Prism
    		 * @public
    		 */
    		highlightElement: function (element, async, callback) {
    			// Find language
    			var language = _.util.getLanguage(element);
    			var grammar = _.languages[language];

    			// Set language on the element, if not present
    			_.util.setLanguage(element, language);

    			// Set language on the parent, for styling
    			var parent = element.parentElement;
    			if (parent && parent.nodeName.toLowerCase() === 'pre') {
    				_.util.setLanguage(parent, language);
    			}

    			var code = element.textContent;

    			var env = {
    				element: element,
    				language: language,
    				grammar: grammar,
    				code: code
    			};

    			function insertHighlightedCode(highlightedCode) {
    				env.highlightedCode = highlightedCode;

    				_.hooks.run('before-insert', env);

    				env.element.innerHTML = env.highlightedCode;

    				_.hooks.run('after-highlight', env);
    				_.hooks.run('complete', env);
    				callback && callback.call(env.element);
    			}

    			_.hooks.run('before-sanity-check', env);

    			// plugins may change/add the parent/element
    			parent = env.element.parentElement;
    			if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
    				parent.setAttribute('tabindex', '0');
    			}

    			if (!env.code) {
    				_.hooks.run('complete', env);
    				callback && callback.call(env.element);
    				return;
    			}

    			_.hooks.run('before-highlight', env);

    			if (!env.grammar) {
    				insertHighlightedCode(_.util.encode(env.code));
    				return;
    			}

    			if (async && _self.Worker) {
    				var worker = new Worker(_.filename);

    				worker.onmessage = function (evt) {
    					insertHighlightedCode(evt.data);
    				};

    				worker.postMessage(JSON.stringify({
    					language: env.language,
    					code: env.code,
    					immediateClose: true
    				}));
    			} else {
    				insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
    			}
    		},

    		/**
    		 * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
    		 * and the language definitions to use, and returns a string with the HTML produced.
    		 *
    		 * The following hooks will be run:
    		 * 1. `before-tokenize`
    		 * 2. `after-tokenize`
    		 * 3. `wrap`: On each {@link Token}.
    		 *
    		 * @param {string} text A string with the code to be highlighted.
    		 * @param {Grammar} grammar An object containing the tokens to use.
    		 *
    		 * Usually a language definition like `Prism.languages.markup`.
    		 * @param {string} language The name of the language definition passed to `grammar`.
    		 * @returns {string} The highlighted HTML.
    		 * @memberof Prism
    		 * @public
    		 * @example
    		 * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
    		 */
    		highlight: function (text, grammar, language) {
    			var env = {
    				code: text,
    				grammar: grammar,
    				language: language
    			};
    			_.hooks.run('before-tokenize', env);
    			if (!env.grammar) {
    				throw new Error('The language "' + env.language + '" has no grammar.');
    			}
    			env.tokens = _.tokenize(env.code, env.grammar);
    			_.hooks.run('after-tokenize', env);
    			return Token.stringify(_.util.encode(env.tokens), env.language);
    		},

    		/**
    		 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
    		 * and the language definitions to use, and returns an array with the tokenized code.
    		 *
    		 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
    		 *
    		 * This method could be useful in other contexts as well, as a very crude parser.
    		 *
    		 * @param {string} text A string with the code to be highlighted.
    		 * @param {Grammar} grammar An object containing the tokens to use.
    		 *
    		 * Usually a language definition like `Prism.languages.markup`.
    		 * @returns {TokenStream} An array of strings and tokens, a token stream.
    		 * @memberof Prism
    		 * @public
    		 * @example
    		 * let code = `var foo = 0;`;
    		 * let tokens = Prism.tokenize(code, Prism.languages.javascript);
    		 * tokens.forEach(token => {
    		 *     if (token instanceof Prism.Token && token.type === 'number') {
    		 *         console.log(`Found numeric literal: ${token.content}`);
    		 *     }
    		 * });
    		 */
    		tokenize: function (text, grammar) {
    			var rest = grammar.rest;
    			if (rest) {
    				for (var token in rest) {
    					grammar[token] = rest[token];
    				}

    				delete grammar.rest;
    			}

    			var tokenList = new LinkedList();
    			addAfter(tokenList, tokenList.head, text);

    			matchGrammar(text, tokenList, grammar, tokenList.head, 0);

    			return toArray(tokenList);
    		},

    		/**
    		 * @namespace
    		 * @memberof Prism
    		 * @public
    		 */
    		hooks: {
    			all: {},

    			/**
    			 * Adds the given callback to the list of callbacks for the given hook.
    			 *
    			 * The callback will be invoked when the hook it is registered for is run.
    			 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
    			 *
    			 * One callback function can be registered to multiple hooks and the same hook multiple times.
    			 *
    			 * @param {string} name The name of the hook.
    			 * @param {HookCallback} callback The callback function which is given environment variables.
    			 * @public
    			 */
    			add: function (name, callback) {
    				var hooks = _.hooks.all;

    				hooks[name] = hooks[name] || [];

    				hooks[name].push(callback);
    			},

    			/**
    			 * Runs a hook invoking all registered callbacks with the given environment variables.
    			 *
    			 * Callbacks will be invoked synchronously and in the order in which they were registered.
    			 *
    			 * @param {string} name The name of the hook.
    			 * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
    			 * @public
    			 */
    			run: function (name, env) {
    				var callbacks = _.hooks.all[name];

    				if (!callbacks || !callbacks.length) {
    					return;
    				}

    				for (var i = 0, callback; (callback = callbacks[i++]);) {
    					callback(env);
    				}
    			}
    		},

    		Token: Token
    	};
    	_self.Prism = _;


    	// Typescript note:
    	// The following can be used to import the Token type in JSDoc:
    	//
    	//   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

    	/**
    	 * Creates a new token.
    	 *
    	 * @param {string} type See {@link Token#type type}
    	 * @param {string | TokenStream} content See {@link Token#content content}
    	 * @param {string|string[]} [alias] The alias(es) of the token.
    	 * @param {string} [matchedStr=""] A copy of the full string this token was created from.
    	 * @class
    	 * @global
    	 * @public
    	 */
    	function Token(type, content, alias, matchedStr) {
    		/**
    		 * The type of the token.
    		 *
    		 * This is usually the key of a pattern in a {@link Grammar}.
    		 *
    		 * @type {string}
    		 * @see GrammarToken
    		 * @public
    		 */
    		this.type = type;
    		/**
    		 * The strings or tokens contained by this token.
    		 *
    		 * This will be a token stream if the pattern matched also defined an `inside` grammar.
    		 *
    		 * @type {string | TokenStream}
    		 * @public
    		 */
    		this.content = content;
    		/**
    		 * The alias(es) of the token.
    		 *
    		 * @type {string|string[]}
    		 * @see GrammarToken
    		 * @public
    		 */
    		this.alias = alias;
    		// Copy of the full string this token was created from
    		this.length = (matchedStr || '').length | 0;
    	}

    	/**
    	 * A token stream is an array of strings and {@link Token Token} objects.
    	 *
    	 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
    	 * them.
    	 *
    	 * 1. No adjacent strings.
    	 * 2. No empty strings.
    	 *
    	 *    The only exception here is the token stream that only contains the empty string and nothing else.
    	 *
    	 * @typedef {Array<string | Token>} TokenStream
    	 * @global
    	 * @public
    	 */

    	/**
    	 * Converts the given token or token stream to an HTML representation.
    	 *
    	 * The following hooks will be run:
    	 * 1. `wrap`: On each {@link Token}.
    	 *
    	 * @param {string | Token | TokenStream} o The token or token stream to be converted.
    	 * @param {string} language The name of current language.
    	 * @returns {string} The HTML representation of the token or token stream.
    	 * @memberof Token
    	 * @static
    	 */
    	Token.stringify = function stringify(o, language) {
    		if (typeof o == 'string') {
    			return o;
    		}
    		if (Array.isArray(o)) {
    			var s = '';
    			o.forEach(function (e) {
    				s += stringify(e, language);
    			});
    			return s;
    		}

    		var env = {
    			type: o.type,
    			content: stringify(o.content, language),
    			tag: 'span',
    			classes: ['token', o.type],
    			attributes: {},
    			language: language
    		};

    		var aliases = o.alias;
    		if (aliases) {
    			if (Array.isArray(aliases)) {
    				Array.prototype.push.apply(env.classes, aliases);
    			} else {
    				env.classes.push(aliases);
    			}
    		}

    		_.hooks.run('wrap', env);

    		var attributes = '';
    		for (var name in env.attributes) {
    			attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    		}

    		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
    	};

    	/**
    	 * @param {RegExp} pattern
    	 * @param {number} pos
    	 * @param {string} text
    	 * @param {boolean} lookbehind
    	 * @returns {RegExpExecArray | null}
    	 */
    	function matchPattern(pattern, pos, text, lookbehind) {
    		pattern.lastIndex = pos;
    		var match = pattern.exec(text);
    		if (match && lookbehind && match[1]) {
    			// change the match to remove the text matched by the Prism lookbehind group
    			var lookbehindLength = match[1].length;
    			match.index += lookbehindLength;
    			match[0] = match[0].slice(lookbehindLength);
    		}
    		return match;
    	}

    	/**
    	 * @param {string} text
    	 * @param {LinkedList<string | Token>} tokenList
    	 * @param {any} grammar
    	 * @param {LinkedListNode<string | Token>} startNode
    	 * @param {number} startPos
    	 * @param {RematchOptions} [rematch]
    	 * @returns {void}
    	 * @private
    	 *
    	 * @typedef RematchOptions
    	 * @property {string} cause
    	 * @property {number} reach
    	 */
    	function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
    		for (var token in grammar) {
    			if (!grammar.hasOwnProperty(token) || !grammar[token]) {
    				continue;
    			}

    			var patterns = grammar[token];
    			patterns = Array.isArray(patterns) ? patterns : [patterns];

    			for (var j = 0; j < patterns.length; ++j) {
    				if (rematch && rematch.cause == token + ',' + j) {
    					return;
    				}

    				var patternObj = patterns[j];
    				var inside = patternObj.inside;
    				var lookbehind = !!patternObj.lookbehind;
    				var greedy = !!patternObj.greedy;
    				var alias = patternObj.alias;

    				if (greedy && !patternObj.pattern.global) {
    					// Without the global flag, lastIndex won't work
    					var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
    					patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
    				}

    				/** @type {RegExp} */
    				var pattern = patternObj.pattern || patternObj;

    				for ( // iterate the token list and keep track of the current token/string position
    					var currentNode = startNode.next, pos = startPos;
    					currentNode !== tokenList.tail;
    					pos += currentNode.value.length, currentNode = currentNode.next
    				) {

    					if (rematch && pos >= rematch.reach) {
    						break;
    					}

    					var str = currentNode.value;

    					if (tokenList.length > text.length) {
    						// Something went terribly wrong, ABORT, ABORT!
    						return;
    					}

    					if (str instanceof Token) {
    						continue;
    					}

    					var removeCount = 1; // this is the to parameter of removeBetween
    					var match;

    					if (greedy) {
    						match = matchPattern(pattern, pos, text, lookbehind);
    						if (!match || match.index >= text.length) {
    							break;
    						}

    						var from = match.index;
    						var to = match.index + match[0].length;
    						var p = pos;

    						// find the node that contains the match
    						p += currentNode.value.length;
    						while (from >= p) {
    							currentNode = currentNode.next;
    							p += currentNode.value.length;
    						}
    						// adjust pos (and p)
    						p -= currentNode.value.length;
    						pos = p;

    						// the current node is a Token, then the match starts inside another Token, which is invalid
    						if (currentNode.value instanceof Token) {
    							continue;
    						}

    						// find the last node which is affected by this match
    						for (
    							var k = currentNode;
    							k !== tokenList.tail && (p < to || typeof k.value === 'string');
    							k = k.next
    						) {
    							removeCount++;
    							p += k.value.length;
    						}
    						removeCount--;

    						// replace with the new match
    						str = text.slice(pos, p);
    						match.index -= pos;
    					} else {
    						match = matchPattern(pattern, 0, str, lookbehind);
    						if (!match) {
    							continue;
    						}
    					}

    					// eslint-disable-next-line no-redeclare
    					var from = match.index;
    					var matchStr = match[0];
    					var before = str.slice(0, from);
    					var after = str.slice(from + matchStr.length);

    					var reach = pos + str.length;
    					if (rematch && reach > rematch.reach) {
    						rematch.reach = reach;
    					}

    					var removeFrom = currentNode.prev;

    					if (before) {
    						removeFrom = addAfter(tokenList, removeFrom, before);
    						pos += before.length;
    					}

    					removeRange(tokenList, removeFrom, removeCount);

    					var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
    					currentNode = addAfter(tokenList, removeFrom, wrapped);

    					if (after) {
    						addAfter(tokenList, currentNode, after);
    					}

    					if (removeCount > 1) {
    						// at least one Token object was removed, so we have to do some rematching
    						// this can only happen if the current pattern is greedy

    						/** @type {RematchOptions} */
    						var nestedRematch = {
    							cause: token + ',' + j,
    							reach: reach
    						};
    						matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

    						// the reach might have been extended because of the rematching
    						if (rematch && nestedRematch.reach > rematch.reach) {
    							rematch.reach = nestedRematch.reach;
    						}
    					}
    				}
    			}
    		}
    	}

    	/**
    	 * @typedef LinkedListNode
    	 * @property {T} value
    	 * @property {LinkedListNode<T> | null} prev The previous node.
    	 * @property {LinkedListNode<T> | null} next The next node.
    	 * @template T
    	 * @private
    	 */

    	/**
    	 * @template T
    	 * @private
    	 */
    	function LinkedList() {
    		/** @type {LinkedListNode<T>} */
    		var head = { value: null, prev: null, next: null };
    		/** @type {LinkedListNode<T>} */
    		var tail = { value: null, prev: head, next: null };
    		head.next = tail;

    		/** @type {LinkedListNode<T>} */
    		this.head = head;
    		/** @type {LinkedListNode<T>} */
    		this.tail = tail;
    		this.length = 0;
    	}

    	/**
    	 * Adds a new node with the given value to the list.
    	 *
    	 * @param {LinkedList<T>} list
    	 * @param {LinkedListNode<T>} node
    	 * @param {T} value
    	 * @returns {LinkedListNode<T>} The added node.
    	 * @template T
    	 */
    	function addAfter(list, node, value) {
    		// assumes that node != list.tail && values.length >= 0
    		var next = node.next;

    		var newNode = { value: value, prev: node, next: next };
    		node.next = newNode;
    		next.prev = newNode;
    		list.length++;

    		return newNode;
    	}
    	/**
    	 * Removes `count` nodes after the given node. The given node will not be removed.
    	 *
    	 * @param {LinkedList<T>} list
    	 * @param {LinkedListNode<T>} node
    	 * @param {number} count
    	 * @template T
    	 */
    	function removeRange(list, node, count) {
    		var next = node.next;
    		for (var i = 0; i < count && next !== list.tail; i++) {
    			next = next.next;
    		}
    		node.next = next;
    		next.prev = node;
    		list.length -= i;
    	}
    	/**
    	 * @param {LinkedList<T>} list
    	 * @returns {T[]}
    	 * @template T
    	 */
    	function toArray(list) {
    		var array = [];
    		var node = list.head.next;
    		while (node !== list.tail) {
    			array.push(node.value);
    			node = node.next;
    		}
    		return array;
    	}


    	if (!_self.document) {
    		if (!_self.addEventListener) {
    			// in Node.js
    			return _;
    		}

    		if (!_.disableWorkerMessageHandler) {
    			// In worker
    			_self.addEventListener('message', function (evt) {
    				var message = JSON.parse(evt.data);
    				var lang = message.language;
    				var code = message.code;
    				var immediateClose = message.immediateClose;

    				_self.postMessage(_.highlight(code, _.languages[lang], lang));
    				if (immediateClose) {
    					_self.close();
    				}
    			}, false);
    		}

    		return _;
    	}

    	// Get current script and highlight
    	var script = _.util.currentScript();

    	if (script) {
    		_.filename = script.src;

    		if (script.hasAttribute('data-manual')) {
    			_.manual = true;
    		}
    	}

    	function highlightAutomaticallyCallback() {
    		if (!_.manual) {
    			_.highlightAll();
    		}
    	}

    	if (!_.manual) {
    		// If the document state is "loading", then we'll use DOMContentLoaded.
    		// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
    		// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
    		// might take longer one animation frame to execute which can create a race condition where only some plugins have
    		// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
    		// See https://github.com/PrismJS/prism/issues/2102
    		var readyState = document.readyState;
    		if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
    			document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
    		} else {
    			if (window.requestAnimationFrame) {
    				window.requestAnimationFrame(highlightAutomaticallyCallback);
    			} else {
    				window.setTimeout(highlightAutomaticallyCallback, 16);
    			}
    		}
    	}

    	return _;

    }(_self));

    if (module.exports) {
    	module.exports = Prism;
    }

    // hack for components to work correctly in node.js
    if (typeof commonjsGlobal !== 'undefined') {
    	commonjsGlobal.Prism = Prism;
    }

    // some additional documentation/types

    /**
     * The expansion of a simple `RegExp` literal to support additional properties.
     *
     * @typedef GrammarToken
     * @property {RegExp} pattern The regular expression of the token.
     * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
     * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
     * @property {boolean} [greedy=false] Whether the token is greedy.
     * @property {string|string[]} [alias] An optional alias or list of aliases.
     * @property {Grammar} [inside] The nested grammar of this token.
     *
     * The `inside` grammar will be used to tokenize the text value of each token of this kind.
     *
     * This can be used to make nested and even recursive language definitions.
     *
     * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
     * each another.
     * @global
     * @public
     */

    /**
     * @typedef Grammar
     * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
     * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
     * @global
     * @public
     */

    /**
     * A function which will invoked after an element was successfully highlighted.
     *
     * @callback HighlightCallback
     * @param {Element} element The element successfully highlighted.
     * @returns {void}
     * @global
     * @public
     */

    /**
     * @callback HookCallback
     * @param {Object<string, any>} env The environment variables of the hook.
     * @returns {void}
     * @global
     * @public
     */


    /* **********************************************
         Begin prism-markup.js
    ********************************************** */

    Prism.languages.markup = {
    	'comment': {
    		pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    		greedy: true
    	},
    	'prolog': {
    		pattern: /<\?[\s\S]+?\?>/,
    		greedy: true
    	},
    	'doctype': {
    		// https://www.w3.org/TR/xml/#NT-doctypedecl
    		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    		greedy: true,
    		inside: {
    			'internal-subset': {
    				pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
    				lookbehind: true,
    				greedy: true,
    				inside: null // see below
    			},
    			'string': {
    				pattern: /"[^"]*"|'[^']*'/,
    				greedy: true
    			},
    			'punctuation': /^<!|>$|[[\]]/,
    			'doctype-tag': /^DOCTYPE/i,
    			'name': /[^\s<>'"]+/
    		}
    	},
    	'cdata': {
    		pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    		greedy: true
    	},
    	'tag': {
    		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    		greedy: true,
    		inside: {
    			'tag': {
    				pattern: /^<\/?[^\s>\/]+/,
    				inside: {
    					'punctuation': /^<\/?/,
    					'namespace': /^[^\s>\/:]+:/
    				}
    			},
    			'special-attr': [],
    			'attr-value': {
    				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
    				inside: {
    					'punctuation': [
    						{
    							pattern: /^=/,
    							alias: 'attr-equals'
    						},
    						/"|'/
    					]
    				}
    			},
    			'punctuation': /\/?>/,
    			'attr-name': {
    				pattern: /[^\s>\/]+/,
    				inside: {
    					'namespace': /^[^\s>\/:]+:/
    				}
    			}

    		}
    	},
    	'entity': [
    		{
    			pattern: /&[\da-z]{1,8};/i,
    			alias: 'named-entity'
    		},
    		/&#x?[\da-f]{1,8};/i
    	]
    };

    Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
    	Prism.languages.markup['entity'];
    Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function (env) {

    	if (env.type === 'entity') {
    		env.attributes['title'] = env.content.replace(/&amp;/, '&');
    	}
    });

    Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    	/**
    	 * Adds an inlined language to markup.
    	 *
    	 * An example of an inlined language is CSS with `<style>` tags.
    	 *
    	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
    	 * case insensitive.
    	 * @param {string} lang The language key.
    	 * @example
    	 * addInlined('style', 'css');
    	 */
    	value: function addInlined(tagName, lang) {
    		var includedCdataInside = {};
    		includedCdataInside['language-' + lang] = {
    			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
    			lookbehind: true,
    			inside: Prism.languages[lang]
    		};
    		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

    		var inside = {
    			'included-cdata': {
    				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    				inside: includedCdataInside
    			}
    		};
    		inside['language-' + lang] = {
    			pattern: /[\s\S]+/,
    			inside: Prism.languages[lang]
    		};

    		var def = {};
    		def[tagName] = {
    			pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () { return tagName; }), 'i'),
    			lookbehind: true,
    			greedy: true,
    			inside: inside
    		};

    		Prism.languages.insertBefore('markup', 'cdata', def);
    	}
    });
    Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
    	/**
    	 * Adds an pattern to highlight languages embedded in HTML attributes.
    	 *
    	 * An example of an inlined language is CSS with `style` attributes.
    	 *
    	 * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
    	 * case insensitive.
    	 * @param {string} lang The language key.
    	 * @example
    	 * addAttribute('style', 'css');
    	 */
    	value: function (attrName, lang) {
    		Prism.languages.markup.tag.inside['special-attr'].push({
    			pattern: RegExp(
    				/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
    				'i'
    			),
    			lookbehind: true,
    			inside: {
    				'attr-name': /^[^\s=]+/,
    				'attr-value': {
    					pattern: /=[\s\S]+/,
    					inside: {
    						'value': {
    							pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
    							lookbehind: true,
    							alias: [lang, 'language-' + lang],
    							inside: Prism.languages[lang]
    						},
    						'punctuation': [
    							{
    								pattern: /^=/,
    								alias: 'attr-equals'
    							},
    							/"|'/
    						]
    					}
    				}
    			}
    		});
    	}
    });

    Prism.languages.html = Prism.languages.markup;
    Prism.languages.mathml = Prism.languages.markup;
    Prism.languages.svg = Prism.languages.markup;

    Prism.languages.xml = Prism.languages.extend('markup', {});
    Prism.languages.ssml = Prism.languages.xml;
    Prism.languages.atom = Prism.languages.xml;
    Prism.languages.rss = Prism.languages.xml;


    /* **********************************************
         Begin prism-css.js
    ********************************************** */

    (function (Prism) {

    	var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;

    	Prism.languages.css = {
    		'comment': /\/\*[\s\S]*?\*\//,
    		'atrule': {
    			pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
    			inside: {
    				'rule': /^@[\w-]+/,
    				'selector-function-argument': {
    					pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
    					lookbehind: true,
    					alias: 'selector'
    				},
    				'keyword': {
    					pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
    					lookbehind: true
    				}
    				// See rest below
    			}
    		},
    		'url': {
    			// https://drafts.csswg.org/css-values-3/#urls
    			pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
    			greedy: true,
    			inside: {
    				'function': /^url/i,
    				'punctuation': /^\(|\)$/,
    				'string': {
    					pattern: RegExp('^' + string.source + '$'),
    					alias: 'url'
    				}
    			}
    		},
    		'selector': {
    			pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
    			lookbehind: true
    		},
    		'string': {
    			pattern: string,
    			greedy: true
    		},
    		'property': {
    			pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
    			lookbehind: true
    		},
    		'important': /!important\b/i,
    		'function': {
    			pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
    			lookbehind: true
    		},
    		'punctuation': /[(){};:,]/
    	};

    	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

    	var markup = Prism.languages.markup;
    	if (markup) {
    		markup.tag.addInlined('style', 'css');
    		markup.tag.addAttribute('style', 'css');
    	}

    }(Prism));


    /* **********************************************
         Begin prism-clike.js
    ********************************************** */

    Prism.languages.clike = {
    	'comment': [
    		{
    			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    			lookbehind: true,
    			greedy: true
    		},
    		{
    			pattern: /(^|[^\\:])\/\/.*/,
    			lookbehind: true,
    			greedy: true
    		}
    	],
    	'string': {
    		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    		greedy: true
    	},
    	'class-name': {
    		pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    		lookbehind: true,
    		inside: {
    			'punctuation': /[.\\]/
    		}
    	},
    	'keyword': /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    	'boolean': /\b(?:false|true)\b/,
    	'function': /\b\w+(?=\()/,
    	'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    	'punctuation': /[{}[\];(),.:]/
    };


    /* **********************************************
         Begin prism-javascript.js
    ********************************************** */

    Prism.languages.javascript = Prism.languages.extend('clike', {
    	'class-name': [
    		Prism.languages.clike['class-name'],
    		{
    			pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
    			lookbehind: true
    		}
    	],
    	'keyword': [
    		{
    			pattern: /((?:^|\})\s*)catch\b/,
    			lookbehind: true
    		},
    		{
    			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    			lookbehind: true
    		},
    	],
    	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    	'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    	'number': {
    		pattern: RegExp(
    			/(^|[^\w$])/.source +
    			'(?:' +
    			(
    				// constant
    				/NaN|Infinity/.source +
    				'|' +
    				// binary integer
    				/0[bB][01]+(?:_[01]+)*n?/.source +
    				'|' +
    				// octal integer
    				/0[oO][0-7]+(?:_[0-7]+)*n?/.source +
    				'|' +
    				// hexadecimal integer
    				/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
    				'|' +
    				// decimal bigint
    				/\d+(?:_\d+)*n/.source +
    				'|' +
    				// decimal number (integer or float) but no bigint
    				/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source
    			) +
    			')' +
    			/(?![\w$])/.source
    		),
    		lookbehind: true
    	},
    	'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    });

    Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;

    Prism.languages.insertBefore('javascript', 'keyword', {
    	'regex': {
    		pattern: RegExp(
    			// lookbehind
    			// eslint-disable-next-line regexp/no-dupe-characters-character-class
    			/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
    			// Regex pattern:
    			// There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
    			// classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
    			// with the only syntax, so we have to define 2 different regex patterns.
    			/\//.source +
    			'(?:' +
    			/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
    			'|' +
    			// `v` flag syntax. This supports 3 levels of nested character classes.
    			/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source +
    			')' +
    			// lookahead
    			/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
    		),
    		lookbehind: true,
    		greedy: true,
    		inside: {
    			'regex-source': {
    				pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
    				lookbehind: true,
    				alias: 'language-regex',
    				inside: Prism.languages.regex
    			},
    			'regex-delimiter': /^\/|\/$/,
    			'regex-flags': /^[a-z]+$/,
    		}
    	},
    	// This must be declared before keyword because we use "function" inside the look-forward
    	'function-variable': {
    		pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    		alias: 'function'
    	},
    	'parameter': [
    		{
    			pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		}
    	],
    	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    });

    Prism.languages.insertBefore('javascript', 'string', {
    	'hashbang': {
    		pattern: /^#!.*/,
    		greedy: true,
    		alias: 'comment'
    	},
    	'template-string': {
    		pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    		greedy: true,
    		inside: {
    			'template-punctuation': {
    				pattern: /^`|`$/,
    				alias: 'string'
    			},
    			'interpolation': {
    				pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
    				lookbehind: true,
    				inside: {
    					'interpolation-punctuation': {
    						pattern: /^\$\{|\}$/,
    						alias: 'punctuation'
    					},
    					rest: Prism.languages.javascript
    				}
    			},
    			'string': /[\s\S]+/
    		}
    	},
    	'string-property': {
    		pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    		lookbehind: true,
    		greedy: true,
    		alias: 'property'
    	}
    });

    Prism.languages.insertBefore('javascript', 'operator', {
    	'literal-property': {
    		pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    		lookbehind: true,
    		alias: 'property'
    	},
    });

    if (Prism.languages.markup) {
    	Prism.languages.markup.tag.addInlined('script', 'javascript');

    	// add attribute support for all DOM events.
    	// https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
    	Prism.languages.markup.tag.addAttribute(
    		/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
    		'javascript'
    	);
    }

    Prism.languages.js = Prism.languages.javascript;


    /* **********************************************
         Begin prism-file-highlight.js
    ********************************************** */

    (function () {

    	if (typeof Prism === 'undefined' || typeof document === 'undefined') {
    		return;
    	}

    	// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
    	if (!Element.prototype.matches) {
    		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    	}

    	var LOADING_MESSAGE = 'Loading…';
    	var FAILURE_MESSAGE = function (status, message) {
    		return '✖ Error ' + status + ' while fetching file: ' + message;
    	};
    	var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';

    	var EXTENSIONS = {
    		'js': 'javascript',
    		'py': 'python',
    		'rb': 'ruby',
    		'ps1': 'powershell',
    		'psm1': 'powershell',
    		'sh': 'bash',
    		'bat': 'batch',
    		'h': 'c',
    		'tex': 'latex'
    	};

    	var STATUS_ATTR = 'data-src-status';
    	var STATUS_LOADING = 'loading';
    	var STATUS_LOADED = 'loaded';
    	var STATUS_FAILED = 'failed';

    	var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])'
    		+ ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';

    	/**
    	 * Loads the given file.
    	 *
    	 * @param {string} src The URL or path of the source file to load.
    	 * @param {(result: string) => void} success
    	 * @param {(reason: string) => void} error
    	 */
    	function loadFile(src, success, error) {
    		var xhr = new XMLHttpRequest();
    		xhr.open('GET', src, true);
    		xhr.onreadystatechange = function () {
    			if (xhr.readyState == 4) {
    				if (xhr.status < 400 && xhr.responseText) {
    					success(xhr.responseText);
    				} else {
    					if (xhr.status >= 400) {
    						error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
    					} else {
    						error(FAILURE_EMPTY_MESSAGE);
    					}
    				}
    			}
    		};
    		xhr.send(null);
    	}

    	/**
    	 * Parses the given range.
    	 *
    	 * This returns a range with inclusive ends.
    	 *
    	 * @param {string | null | undefined} range
    	 * @returns {[number, number | undefined] | undefined}
    	 */
    	function parseRange(range) {
    		var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || '');
    		if (m) {
    			var start = Number(m[1]);
    			var comma = m[2];
    			var end = m[3];

    			if (!comma) {
    				return [start, start];
    			}
    			if (!end) {
    				return [start, undefined];
    			}
    			return [start, Number(end)];
    		}
    		return undefined;
    	}

    	Prism.hooks.add('before-highlightall', function (env) {
    		env.selector += ', ' + SELECTOR;
    	});

    	Prism.hooks.add('before-sanity-check', function (env) {
    		var pre = /** @type {HTMLPreElement} */ (env.element);
    		if (pre.matches(SELECTOR)) {
    			env.code = ''; // fast-path the whole thing and go to complete

    			pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading

    			// add code element with loading message
    			var code = pre.appendChild(document.createElement('CODE'));
    			code.textContent = LOADING_MESSAGE;

    			var src = pre.getAttribute('data-src');

    			var language = env.language;
    			if (language === 'none') {
    				// the language might be 'none' because there is no language set;
    				// in this case, we want to use the extension as the language
    				var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
    				language = EXTENSIONS[extension] || extension;
    			}

    			// set language classes
    			Prism.util.setLanguage(code, language);
    			Prism.util.setLanguage(pre, language);

    			// preload the language
    			var autoloader = Prism.plugins.autoloader;
    			if (autoloader) {
    				autoloader.loadLanguages(language);
    			}

    			// load file
    			loadFile(
    				src,
    				function (text) {
    					// mark as loaded
    					pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

    					// handle data-range
    					var range = parseRange(pre.getAttribute('data-range'));
    					if (range) {
    						var lines = text.split(/\r\n?|\n/g);

    						// the range is one-based and inclusive on both ends
    						var start = range[0];
    						var end = range[1] == null ? lines.length : range[1];

    						if (start < 0) { start += lines.length; }
    						start = Math.max(0, Math.min(start - 1, lines.length));
    						if (end < 0) { end += lines.length; }
    						end = Math.max(0, Math.min(end, lines.length));

    						text = lines.slice(start, end).join('\n');

    						// add data-start for line numbers
    						if (!pre.hasAttribute('data-start')) {
    							pre.setAttribute('data-start', String(start + 1));
    						}
    					}

    					// highlight code
    					code.textContent = text;
    					Prism.highlightElement(code);
    				},
    				function (error) {
    					// mark as failed
    					pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

    					code.textContent = error;
    				}
    			);
    		}
    	});

    	Prism.plugins.fileHighlight = {
    		/**
    		 * Executes the File Highlight plugin for all matching `pre` elements under the given container.
    		 *
    		 * Note: Elements which are already loaded or currently loading will not be touched by this method.
    		 *
    		 * @param {ParentNode} [container=document]
    		 */
    		highlight: function highlight(container) {
    			var elements = (container || document).querySelectorAll(SELECTOR);

    			for (var i = 0, element; (element = elements[i++]);) {
    				Prism.highlightElement(element);
    			}
    		}
    	};

    	var logged = false;
    	/** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */
    	Prism.fileHighlight = function () {
    		if (!logged) {
    			console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
    			logged = true;
    		}
    		Prism.plugins.fileHighlight.highlight.apply(this, arguments);
    	};

    }());
    });

    const blocks = '(if|else if|await|then|catch|each|html|debug)';

    Prism.languages.svelte = Prism.languages.extend('markup', {
    	each: {
    		pattern: new RegExp(
    			'{[#/]each' +
    				'(?:(?:\\{(?:(?:\\{(?:[^{}])*\\})|(?:[^{}]))*\\})|(?:[^{}]))*}'
    		),
    		inside: {
    			'language-javascript': [
    				{
    					pattern: /(as[\s\S]*)\([\s\S]*\)(?=\s*\})/,
    					lookbehind: true,
    					inside: Prism.languages['javascript'],
    				},
    				{
    					pattern: /(as[\s]*)[\s\S]*(?=\s*)/,
    					lookbehind: true,
    					inside: Prism.languages['javascript'],
    				},
    				{
    					pattern: /(#each[\s]*)[\s\S]*(?=as)/,
    					lookbehind: true,
    					inside: Prism.languages['javascript'],
    				},
    			],
    			keyword: /[#/]each|as/,
    			punctuation: /{|}/,
    		},
    	},
    	block: {
    		pattern: new RegExp(
    			'{[#:/@]/s' +
    				blocks +
    				'(?:(?:\\{(?:(?:\\{(?:[^{}])*\\})|(?:[^{}]))*\\})|(?:[^{}]))*}'
    		),
    		inside: {
    			punctuation: /^{|}$/,
    			keyword: [new RegExp('[#:/@]' + blocks + '( )*'), /as/, /then/],
    			'language-javascript': {
    				pattern: /[\s\S]*/,
    				inside: Prism.languages['javascript'],
    			},
    		},
    	},
    	tag: {
    		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?:"[^"]*"|'[^']*'|{[\s\S]+?}(?=[\s/>])))|(?=[\s/>])))+)?\s*\/?>/i,
    		greedy: true,
    		inside: {
    			tag: {
    				pattern: /^<\/?[^\s>\/]+/i,
    				inside: {
    					punctuation: /^<\/?/,
    					namespace: /^[^\s>\/:]+:/,
    				},
    			},
    			'language-javascript': {
    				pattern: /\{(?:(?:\{(?:(?:\{(?:[^{}])*\})|(?:[^{}]))*\})|(?:[^{}]))*\}/,
    				inside: Prism.languages['javascript'],
    			},
    			'attr-value': {
    				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
    				inside: {
    					punctuation: [
    						/^=/,
    						{
    							pattern: /^(\s*)["']|["']$/,
    							lookbehind: true,
    						},
    					],
    					'language-javascript': {
    						pattern: /{[\s\S]+}/,
    						inside: Prism.languages['javascript'],
    					},
    				},
    			},
    			punctuation: /\/?>/,
    			'attr-name': {
    				pattern: /[^\s>\/]+/,
    				inside: {
    					namespace: /^[^\s>\/:]+:/,
    				},
    			},
    		},
    	},
    	'language-javascript': {
    		pattern: /\{(?:(?:\{(?:(?:\{(?:[^{}])*\})|(?:[^{}]))*\})|(?:[^{}]))*\}/,
    		lookbehind: true,
    		inside: Prism.languages['javascript'],
    	},
    });

    Prism.languages.svelte['tag'].inside['attr-value'].inside['entity'] =
    	Prism.languages.svelte['entity'];

    Prism.hooks.add('wrap', env => {
    	if (env.type === 'entity') {
    		env.attributes['title'] = env.content.replace(/&amp;/, '&');
    	}
    });

    Object.defineProperty(Prism.languages.svelte.tag, 'addInlined', {
    	value: function addInlined(tagName, lang) {
    		const includedCdataInside = {};
    		includedCdataInside['language-' + lang] = {
    			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
    			lookbehind: true,
    			inside: Prism.languages[lang],
    		};
    		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

    		const inside = {
    			'included-cdata': {
    				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    				inside: includedCdataInside,
    			},
    		};
    		inside['language-' + lang] = {
    			pattern: /[\s\S]+/,
    			inside: Prism.languages[lang],
    		};

    		const def = {};
    		def[tagName] = {
    			pattern: RegExp(
    				/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(
    					/__/g,
    					tagName
    				),
    				'i'
    			),
    			lookbehind: true,
    			greedy: true,
    			inside,
    		};

    		Prism.languages.insertBefore('svelte', 'cdata', def);
    	},
    });

    Prism.languages.svelte.tag.addInlined('style', 'css');
    Prism.languages.svelte.tag.addInlined('script', 'javascript');

    /* node_modules\svelte-prism\src\Prism.svelte generated by Svelte v3.48.0 */
    const file$5 = "node_modules\\svelte-prism\\src\\Prism.svelte";

    // (32:45) {:else}
    function create_else_block$1(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*formattedCode*/ ctx[2], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formattedCode*/ 4) html_tag.p(/*formattedCode*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(32:45) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:5) {#if language === "none"}
    function create_if_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*formattedCode*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formattedCode*/ 4) set_data_dev(t, /*formattedCode*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(32:5) {#if language === \\\"none\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let code0;
    	let t;
    	let pre;
    	let code1;
    	let code1_class_value;
    	let pre_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	function select_block_type(ctx, dirty) {
    		if (/*language*/ ctx[0] === "none") return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			code0 = element("code");
    			if (default_slot) default_slot.c();
    			t = space();
    			pre = element("pre");
    			code1 = element("code");
    			if_block.c();
    			set_style(code0, "display", "none");
    			add_location(code0, file$5, 26, 0, 727);
    			attr_dev(code1, "class", code1_class_value = "language-" + /*language*/ ctx[0]);
    			add_location(code1, file$5, 30, 65, 860);
    			attr_dev(pre, "class", pre_class_value = "language-" + /*language*/ ctx[0]);
    			attr_dev(pre, "command-line", "");
    			attr_dev(pre, "data-output", "2-17");
    			add_location(pre, file$5, 30, 0, 795);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, code0, anchor);

    			if (default_slot) {
    				default_slot.m(code0, null);
    			}

    			/*code0_binding*/ ctx[7](code0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, pre, anchor);
    			append_dev(pre, code1);
    			if_block.m(code1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(code1, null);
    				}
    			}

    			if (!current || dirty & /*language*/ 1 && code1_class_value !== (code1_class_value = "language-" + /*language*/ ctx[0])) {
    				attr_dev(code1, "class", code1_class_value);
    			}

    			if (!current || dirty & /*language*/ 1 && pre_class_value !== (pre_class_value = "language-" + /*language*/ ctx[0])) {
    				attr_dev(pre, "class", pre_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(code0);
    			if (default_slot) default_slot.d(detaching);
    			/*code0_binding*/ ctx[7](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(pre);
    			if_block.d();
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

    const prism = prism$1;
    const highlight = prism$1.highlightElement;
    const globalConfig = { transform: x => x };

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Prism', slots, ['default']);
    	let { language = "javascript" } = $$props;
    	let { source = "" } = $$props;
    	let { transform = x => x } = $$props;
    	let element, formattedCode;

    	function highlightCode() {
    		const grammar = prism.languages[language];
    		let body = source || element.textContent;
    		body = globalConfig.transform(body);
    		body = transform(body);

    		$$invalidate(2, formattedCode = language === "none"
    		? body
    		: prism.highlight(body, grammar, language));
    	}

    	function code0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('language' in $$new_props) $$invalidate(0, language = $$new_props.language);
    		if ('source' in $$new_props) $$invalidate(3, source = $$new_props.source);
    		if ('transform' in $$new_props) $$invalidate(4, transform = $$new_props.transform);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_prism: prism$1,
    		prism,
    		highlight,
    		globalConfig,
    		language,
    		source,
    		transform,
    		element,
    		formattedCode,
    		highlightCode
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    		if ('language' in $$props) $$invalidate(0, language = $$new_props.language);
    		if ('source' in $$props) $$invalidate(3, source = $$new_props.source);
    		if ('transform' in $$props) $$invalidate(4, transform = $$new_props.transform);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    		if ('formattedCode' in $$props) $$invalidate(2, formattedCode = $$new_props.formattedCode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$props && (source || element) && highlightCode();
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		language,
    		element,
    		formattedCode,
    		source,
    		transform,
    		$$scope,
    		slots,
    		code0_binding
    	];
    }

    class Prism$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { language: 0, source: 3, transform: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prism",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get language() {
    		throw new Error("<Prism>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set language(value) {
    		throw new Error("<Prism>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get source() {
    		throw new Error("<Prism>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<Prism>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transform() {
    		throw new Error("<Prism>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transform(value) {
    		throw new Error("<Prism>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Codes = {
      "1": `
  <script>
    const user = "sabuha";
  <\/script>
  
  <span>{user} seni izliyor!</span>
  
  <style>
    h1 {
      color: rebeccapurple;
    }
  </style>`,
      "2": `
  <script>
    const user = "sabuha";
  <\/script>

  <span>{user === "sabuha" ? "bir kedi gördüm sanki!" : "seni izliyor!"}</span>
  `,
      "3": `
  <script>
    let number = 0;
  
    const randomNumber = () => {
      number = Math.round(Math.random() \* 15);
    };
  <\/script>

  <main>
    <h3>{number}</h3>
    <button on:click={randomNumber}>Update Number</button>
  </main>

  <style>
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
    </style>
  `,
      "4": `
    <script>
      let number = 0;
  
      const randomNumber = () => {
        number = Math.round(Math.random() \* 15);
      };
  <\/script>
  
  <div class="random-number-capsule">
    <h3>{number}</h3>
    <button on:click={randomNumber}>Update Number</button>
  </div>
  
  <style>
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
  </style>
  `,
      "5": `
  <script>
    import RandomNumber from "./components/Content/RandomNumber/RandomNumber.svelte";  
  <\/script>

  <main>
    <RandomNumber />
    <RandomNumber />
    <RandomNumber />
    <RandomNumber />
  </main>
  `

    };

    /* src\components\Docs\Documentation.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;

    function create_fragment$5(ctx) {
    	let section0;
    	let t0;
    	let section1;
    	let t1;
    	let section2;
    	let t2;
    	let section3;
    	let t3;
    	let section4;
    	let t4;
    	let section5;
    	let t5;
    	let section6;
    	let t6;
    	let section7;
    	let current;

    	section0 = new Section({
    			props: { detail: /*detail*/ ctx[0].selamlar },
    			$$inline: true
    		});

    	section1 = new Section({
    			props: { detail: /*detail*/ ctx[0].oyunHakkinda },
    			$$inline: true
    		});

    	section2 = new Section({
    			props: { detail: /*detail*/ ctx[0].svelteNedir },
    			$$inline: true
    		});

    	section3 = new Section({
    			props: { detail: /*detail*/ ctx[0].basitIfadeler },
    			$$inline: true
    		});

    	section4 = new Section({
    			props: {
    				detail: /*detail*/ ctx[0].svelteNasilCalisir
    			},
    			$$inline: true
    		});

    	section5 = new Section({
    			props: { detail: /*detail*/ ctx[0].bagimliliklar },
    			$$inline: true
    		});

    	section6 = new Section({
    			props: {
    				detail: /*detail*/ ctx[0].svelteYapisiniInceleme
    			},
    			$$inline: true
    		});

    	section7 = new Section({
    			props: { detail: /*detail*/ ctx[0].birazPratik },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section0.$$.fragment);
    			t0 = space();
    			create_component(section1.$$.fragment);
    			t1 = space();
    			create_component(section2.$$.fragment);
    			t2 = space();
    			create_component(section3.$$.fragment);
    			t3 = space();
    			create_component(section4.$$.fragment);
    			t4 = space();
    			create_component(section5.$$.fragment);
    			t5 = space();
    			create_component(section6.$$.fragment);
    			t6 = space();
    			create_component(section7.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(section1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(section2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(section3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(section4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(section5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(section6, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(section7, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section0.$$.fragment, local);
    			transition_in(section1.$$.fragment, local);
    			transition_in(section2.$$.fragment, local);
    			transition_in(section3.$$.fragment, local);
    			transition_in(section4.$$.fragment, local);
    			transition_in(section5.$$.fragment, local);
    			transition_in(section6.$$.fragment, local);
    			transition_in(section7.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section0.$$.fragment, local);
    			transition_out(section1.$$.fragment, local);
    			transition_out(section2.$$.fragment, local);
    			transition_out(section3.$$.fragment, local);
    			transition_out(section4.$$.fragment, local);
    			transition_out(section5.$$.fragment, local);
    			transition_out(section6.$$.fragment, local);
    			transition_out(section7.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(section1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(section2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(section3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(section4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(section5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(section6, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(section7, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Documentation', slots, []);
    	const { detail } = ContentData;
    	console.log("here=>", detail.selamlar);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Documentation> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ContentData,
    		Paragraph,
    		Section,
    		Prism: Prism$1,
    		Codes,
    		detail
    	});

    	return [detail];
    }

    class Documentation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Documentation",
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
    	let t12;
    	let a2;
    	let t14;
    	let t15;
    	let span1;
    	let t16;
    	let h21;
    	let t18;
    	let p3;
    	let t20;
    	let p4;
    	let img1;
    	let img1_src_value;
    	let t21;
    	let p5;
    	let t22;
    	let em1;
    	let t24;
    	let em2;
    	let t26;
    	let t27;
    	let span2;
    	let t28;
    	let h22;
    	let t30;
    	let p6;
    	let t31;
    	let em3;
    	let t33;
    	let t34;
    	let p7;
    	let a3;
    	let t36;
    	let t37;
    	let h23;
    	let t39;
    	let p8;
    	let t41;
    	let ul6;
    	let li1;
    	let code0;
    	let ul0;
    	let li0;
    	let t44;
    	let li3;
    	let code1;
    	let ul1;
    	let li2;
    	let em4;
    	let t47;
    	let t48;
    	let li5;
    	let code2;
    	let ul2;
    	let li4;
    	let em5;
    	let t51;
    	let t52;
    	let li7;
    	let code3;
    	let ul3;
    	let li6;
    	let em6;
    	let t55;
    	let t56;
    	let li9;
    	let code4;
    	let ul4;
    	let li8;
    	let em7;
    	let t59;
    	let em8;
    	let t61;
    	let t62;
    	let li11;
    	let code5;
    	let ul5;
    	let li10;
    	let em9;
    	let t65;
    	let em10;
    	let t67;
    	let em11;
    	let t69;
    	let t70;
    	let span3;
    	let t71;
    	let h24;
    	let t73;
    	let p9;
    	let t75;
    	let html_tag;
    	let t76;
    	let p10;
    	let t78;
    	let html_tag_1;
    	let t79;
    	let p11;
    	let t81;
    	let html_tag_2;
    	let t82;
    	let p12;
    	let t84;
    	let p13;
    	let img2;
    	let img2_src_value;
    	let t85;
    	let span4;
    	let t86;
    	let h25;
    	let t88;
    	let p14;
    	let t89;
    	let em12;
    	let t91;
    	let em13;
    	let t93;
    	let t94;
    	let p15;
    	let t95;
    	let em14;
    	let t97;
    	let t98;
    	let p16;
    	let img3;
    	let img3_src_value;
    	let t99;
    	let span5;
    	let t100;
    	let h26;
    	let t102;
    	let ul7;
    	let li12;
    	let h40;
    	let t104;
    	let em15;
    	let t106;
    	let em16;
    	let t108;
    	let t109;
    	let li13;
    	let h41;
    	let t111;
    	let t112;
    	let span6;
    	let t113;
    	let h27;
    	let t115;
    	let p17;
    	let t116;
    	let em17;
    	let t118;
    	let em18;
    	let t120;
    	let em19;
    	let t122;
    	let em20;
    	let t124;
    	let em21;
    	let t126;
    	let em22;
    	let t128;
    	let t129;
    	let p18;
    	let t130;
    	let em23;
    	let t132;
    	let em24;
    	let t134;
    	let em25;
    	let t136;
    	let em26;
    	let t138;
    	let em27;
    	let t140;
    	let em28;
    	let t142;
    	let t143;
    	let p19;
    	let t144;
    	let em29;
    	let t146;
    	let em30;
    	let t148;
    	let em31;
    	let t150;
    	let em32;
    	let t152;
    	let t153;
    	let p20;
    	let t154;
    	let em33;
    	let t156;
    	let em34;
    	let t158;
    	let code6;
    	let t160;
    	let t161;
    	let p21;
    	let t162;
    	let code7;
    	let t164;
    	let em35;
    	let t166;
    	let t167;
    	let h28;
    	let t169;
    	let p22;
    	let t171;
    	let p23;
    	let em36;
    	let t173;
    	let em37;
    	let t175;
    	let em38;
    	let t177;
    	let a4;
    	let t179;
    	let t180;
    	let h30;
    	let t182;
    	let p24;
    	let t184;
    	let p25;
    	let em39;
    	let t186;
    	let div0;
    	let pre0;
    	let t188;
    	let pre1;
    	let t190;
    	let pre2;
    	let t192;
    	let p26;
    	let t193;
    	let em40;
    	let t195;
    	let em41;
    	let t197;
    	let em42;
    	let t199;
    	let em43;
    	let t201;
    	let t202;
    	let p27;
    	let em44;
    	let t204;
    	let div1;
    	let pre3;
    	let t206;
    	let pre4;
    	let t208;
    	let pre5;
    	let t210;
    	let p28;
    	let em45;
    	let t212;
    	let t213;
    	let h31;
    	let t215;
    	let p29;
    	let t217;
    	let p30;
    	let em46;
    	let t219;
    	let div2;
    	let pre6;
    	let t221;
    	let pre7;
    	let t223;
    	let pre8;
    	let t225;
    	let p31;
    	let t226;
    	let em47;
    	let t228;
    	let t229;
    	let p32;
    	let img4;
    	let img4_src_value;
    	let t230;
    	let h32;
    	let t232;
    	let p33;
    	let t234;
    	let p34;
    	let img5;
    	let img5_src_value;
    	let t235;
    	let p35;
    	let t236;
    	let code8;
    	let t238;
    	let code9;
    	let t240;
    	let code10;
    	let t242;
    	let t243;
    	let p36;
    	let em48;
    	let t245;
    	let div3;
    	let pre9;
    	let t247;
    	let pre10;
    	let t249;
    	let pre11;
    	let t251;
    	let p37;
    	let code11;
    	let t253;
    	let t254;
    	let p38;
    	let em49;
    	let t256;
    	let div4;
    	let pre12;
    	let t258;
    	let pre13;
    	let t260;
    	let pre14;
    	let t262;
    	let p39;
    	let img6;
    	let img6_src_value;
    	let t263;
    	let h33;
    	let t265;
    	let p40;
    	let img7;
    	let img7_src_value;
    	let t266;
    	let p41;
    	let t268;
    	let h42;
    	let t270;
    	let p42;
    	let t272;
    	let h43;
    	let t274;
    	let p43;
    	let t276;
    	let h44;
    	let t278;
    	let p44;
    	let t280;
    	let h45;
    	let t282;
    	let p45;
    	let t284;
    	let h46;
    	let t286;
    	let p46;
    	let t288;
    	let h29;
    	let t290;
    	let span7;
    	let t291;
    	let h210;
    	let t293;
    	let p47;
    	let t294;
    	let a5;
    	let t296;
    	let em50;
    	let t298;
    	let em51;
    	let t300;
    	let t301;
    	let p48;
    	let img8;
    	let img8_src_value;
    	let t302;
    	let h34;
    	let t304;
    	let p49;
    	let em52;
    	let t306;
    	let em53;
    	let t308;
    	let em54;
    	let t310;
    	let em55;
    	let t312;
    	let em56;
    	let t314;
    	let t315;
    	let p50;
    	let em57;
    	let t317;
    	let em58;
    	let t319;
    	let em59;
    	let t321;
    	let t322;
    	let p51;
    	let t323;
    	let em60;
    	let t325;
    	let t326;
    	let p52;
    	let em61;
    	let t328;
    	let div5;
    	let pre15;
    	let t330;
    	let pre16;
    	let t332;
    	let pre17;
    	let t334;
    	let p53;
    	let em62;
    	let t336;
    	let div6;
    	let pre18;
    	let t338;
    	let pre19;
    	let t340;
    	let pre20;
    	let t342;
    	let p54;
    	let em63;
    	let t344;
    	let t345;
    	let p55;
    	let img9;
    	let img9_src_value;
    	let t346;
    	let p56;
    	let t348;
    	let ul8;
    	let li14;
    	let t350;
    	let li15;
    	let t352;
    	let li16;
    	let t354;
    	let li17;
    	let t356;
    	let p57;
    	let img10;
    	let img10_src_value;
    	let t357;
    	let h35;
    	let t359;
    	let p58;
    	let t360;
    	let em64;
    	let t362;
    	let em65;
    	let t364;
    	let em66;
    	let t366;
    	let em67;
    	let t368;
    	let t369;
    	let p59;
    	let em68;
    	let t371;
    	let div7;
    	let pre21;
    	let t373;
    	let pre22;
    	let t375;
    	let pre23;
    	let t377;
    	let p60;
    	let em69;
    	let t379;
    	let div8;
    	let pre24;
    	let t381;
    	let pre25;
    	let t383;
    	let pre26;
    	let t385;
    	let p61;
    	let img11;
    	let img11_src_value;
    	let t386;
    	let p62;
    	let t388;
    	let p63;
    	let em70;
    	let t390;
    	let div9;
    	let pre27;
    	let t392;
    	let pre28;
    	let t394;
    	let pre29;
    	let t396;
    	let p64;
    	let t398;
    	let h36;
    	let t400;
    	let p65;
    	let t402;
    	let ul9;
    	let li18;
    	let code12;
    	let t404;
    	let li19;
    	let code13;
    	let t406;
    	let li20;
    	let code14;
    	let t408;
    	let li21;
    	let a6;
    	let t410;
    	let p66;
    	let em71;
    	let t412;
    	let em72;
    	let t414;
    	let em73;
    	let t416;
    	let em74;
    	let t418;
    	let em75;
    	let t420;
    	let t421;
    	let p67;
    	let em76;
    	let t423;
    	let div10;
    	let pre30;
    	let t425;
    	let pre31;
    	let t427;
    	let pre32;
    	let t429;
    	let p68;
    	let em77;
    	let t431;
    	let em78;
    	let t433;
    	let t434;
    	let p69;
    	let img12;
    	let img12_src_value;
    	let t435;
    	let p70;
    	let em79;
    	let t437;
    	let t438;
    	let p71;
    	let em80;
    	let t440;
    	let div11;
    	let pre33;
    	let t442;
    	let pre34;
    	let t444;
    	let pre35;
    	let t446;
    	let p72;
    	let t447;
    	let code15;
    	let t449;
    	let em81;
    	let t451;
    	let em82;
    	let t453;
    	let t454;
    	let p73;
    	let em83;
    	let t456;
    	let div12;
    	let pre36;
    	let t458;
    	let pre37;
    	let t460;
    	let pre38;
    	let t462;
    	let p74;
    	let t464;
    	let p75;
    	let img13;
    	let img13_src_value;
    	let t465;
    	let h37;
    	let t467;
    	let p76;
    	let t469;
    	let p77;
    	let code16;
    	let t471;
    	let p78;
    	let code17;
    	let t473;
    	let p79;
    	let em84;
    	let t475;
    	let div13;
    	let pre39;
    	let t477;
    	let pre40;
    	let t479;
    	let pre41;
    	let t481;
    	let p80;
    	let t482;
    	let em85;
    	let t484;
    	let em86;
    	let t486;
    	let t487;
    	let p81;
    	let t488;
    	let em87;
    	let t490;
    	let em88;
    	let t492;
    	let em89;
    	let t494;
    	let t495;
    	let p82;
    	let t497;
    	let p83;
    	let img14;
    	let img14_src_value;
    	let t498;
    	let h211;
    	let t500;
    	let p84;
    	let t501;
    	let em90;
    	let t503;
    	let em91;
    	let t505;
    	let em92;
    	let t507;
    	let em93;
    	let t509;
    	let em94;
    	let t511;
    	let t512;
    	let p85;
    	let code18;
    	let t514;
    	let code19;
    	let t516;
    	let p86;
    	let em95;
    	let t518;
    	let div14;
    	let pre42;
    	let t520;
    	let p87;
    	let em96;
    	let t522;
    	let em97;
    	let t524;
    	let t525;
    	let p88;
    	let t526;
    	let em98;
    	let t528;
    	let t529;
    	let p89;
    	let em99;
    	let t531;
    	let div15;
    	let pre43;
    	let t533;
    	let p90;
    	let t534;
    	let em100;
    	let t536;
    	let em101;
    	let t538;
    	let t539;
    	let p91;
    	let t541;
    	let p92;
    	let code20;
    	let t543;
    	let p93;
    	let em102;
    	let t545;
    	let div16;
    	let pre44;
    	let t547;
    	let p94;
    	let t548;
    	let em103;
    	let t550;
    	let em104;
    	let t552;
    	let t553;
    	let h212;
    	let t555;
    	let p95;
    	let t556;
    	let em105;
    	let t558;
    	let t559;
    	let p96;
    	let em106;
    	let t561;
    	let code21;
    	let t563;
    	let t564;
    	let p97;
    	let em107;
    	let t566;
    	let div17;
    	let pre45;
    	let t568;
    	let pre46;
    	let t570;
    	let p98;
    	let code22;
    	let t572;
    	let code23;
    	let t574;
    	let t575;
    	let p99;
    	let em108;
    	let t577;
    	let div18;
    	let pre47;
    	let t579;
    	let pre48;
    	let t581;
    	let p100;
    	let t582;
    	let code24;
    	let t584;
    	let code25;
    	let t586;
    	let em109;
    	let t588;
    	let code26;
    	let t590;
    	let code27;
    	let t592;
    	let t593;
    	let div19;
    	let pre49;
    	let t595;
    	let p101;
    	let t596;
    	let code28;
    	let t598;
    	let t599;
    	let p102;
    	let img15;
    	let img15_src_value;
    	let t600;
    	let p103;
    	let t602;
    	let p104;
    	let em110;
    	let t604;
    	let div20;
    	let pre50;
    	let t606;
    	let pre51;
    	let t608;
    	let p105;
    	let t609;
    	let code29;
    	let t611;
    	let t612;
    	let p106;
    	let t614;
    	let p107;
    	let t615;
    	let code30;
    	let t617;
    	let code31;
    	let t619;
    	let em111;
    	let t621;
    	let t622;
    	let p108;
    	let em112;
    	let t624;
    	let div21;
    	let pre52;
    	let t626;
    	let pre53;
    	let t628;
    	let p109;
    	let t629;
    	let code32;
    	let t631;
    	let code33;
    	let t633;
    	let t634;
    	let p110;
    	let em113;
    	let t636;
    	let div22;
    	let pre54;
    	let t638;
    	let pre55;
    	let t640;
    	let p111;
    	let img16;
    	let img16_src_value;
    	let t641;
    	let p112;
    	let t642;
    	let em114;
    	let t644;
    	let em115;
    	let t646;
    	let em116;
    	let t648;
    	let em117;
    	let t650;
    	let t651;
    	let div23;
    	let pre56;
    	let t653;
    	let pre57;
    	let t655;
    	let pre58;
    	let t657;
    	let p113;
    	let t658;
    	let em118;
    	let t660;
    	let em119;
    	let t662;
    	let code34;
    	let t664;
    	let code35;
    	let t666;
    	let t667;
    	let h38;
    	let t669;
    	let p114;
    	let t671;
    	let h39;
    	let t673;
    	let p115;
    	let t675;
    	let p116;
    	let code36;
    	let t677;
    	let p117;
    	let code37;
    	let t679;
    	let code38;
    	let t681;
    	let code39;
    	let t683;
    	let code40;
    	let t685;
    	let t686;
    	let p118;
    	let code41;
    	let t688;
    	let code42;
    	let t690;
    	let code43;
    	let t692;
    	let em120;
    	let t694;
    	let t695;
    	let p119;
    	let em121;
    	let t697;
    	let div24;
    	let pre59;
    	let t699;
    	let pre60;
    	let t701;
    	let pre61;
    	let t703;
    	let p120;
    	let code44;
    	let t705;
    	let code45;
    	let t707;
    	let t708;
    	let p121;
    	let code46;
    	let t710;
    	let code47;
    	let t712;
    	let code48;
    	let t714;
    	let code49;
    	let t716;
    	let code50;
    	let t718;
    	let t719;
    	let p122;
    	let em122;
    	let t721;
    	let div25;
    	let pre62;
    	let t723;
    	let pre63;
    	let t725;
    	let pre64;
    	let t727;
    	let p123;
    	let code51;
    	let t729;
    	let code52;
    	let t731;
    	let code53;
    	let t733;
    	let code54;
    	let t735;
    	let t736;
    	let p124;
    	let img17;
    	let img17_src_value;
    	let t737;
    	let p125;
    	let code55;
    	let t739;
    	let code56;
    	let t741;
    	let code57;
    	let t743;
    	let code58;
    	let t745;
    	let t746;
    	let p126;
    	let em123;
    	let t748;
    	let div26;
    	let pre65;
    	let t750;
    	let pre66;
    	let t752;
    	let pre67;
    	let t754;
    	let p127;
    	let code59;
    	let t756;
    	let em124;
    	let t758;
    	let code60;
    	let t760;
    	let t761;
    	let p128;
    	let img18;
    	let img18_src_value;
    	let t762;
    	let p129;
    	let t763;
    	let code61;
    	let t765;
    	let code62;
    	let t767;
    	let code63;
    	let t769;
    	let code64;
    	let t771;
    	let t772;
    	let p130;
    	let em125;
    	let t774;
    	let div27;
    	let pre68;
    	let t776;
    	let p131;
    	let code65;
    	let t778;
    	let code66;
    	let t780;
    	let code67;
    	let t782;
    	let t783;
    	let p132;
    	let em126;
    	let t785;
    	let div28;
    	let pre69;
    	let t787;
    	let pre70;
    	let t789;
    	let pre71;
    	let t791;
    	let p133;
    	let code68;
    	let t793;
    	let em127;
    	let t795;
    	let t796;
    	let p134;
    	let em128;
    	let t798;
    	let div29;
    	let pre72;
    	let t800;
    	let pre73;
    	let t802;
    	let pre74;
    	let t804;
    	let p135;
    	let t805;
    	let code69;
    	let t807;
    	let code70;
    	let t809;
    	let code71;
    	let t811;
    	let t812;
    	let p136;
    	let img19;
    	let img19_src_value;
    	let t813;
    	let p137;
    	let img20;
    	let img20_src_value;
    	let t814;
    	let span8;
    	let t815;
    	let span9;
    	let t816;
    	let h213;
    	let t818;
    	let h214;
    	let t820;
    	let ul10;
    	let li22;
    	let p138;
    	let t822;
    	let li23;
    	let p139;
    	let a7;
    	let t824;
    	let li24;
    	let p140;
    	let t826;
    	let li25;
    	let p141;
    	let a8;
    	let t828;
    	let li26;
    	let p142;
    	let a9;
    	let t830;
    	let li27;
    	let p143;
    	let a10;
    	let t832;
    	let li28;
    	let p144;
    	let a11;
    	let t834;
    	let li29;
    	let p145;
    	let a12;
    	let t836;
    	let ul11;
    	let li30;
    	let t838;
    	let ul12;
    	let li31;
    	let p146;
    	let a13;
    	let t840;
    	let li32;
    	let p147;
    	let t842;
    	let li33;
    	let p148;
    	let a14;
    	let t844;
    	let ul13;
    	let li34;
    	let t846;
    	let ul14;
    	let li35;
    	let a15;
    	let t848;
    	let ul15;
    	let li36;
    	let t850;
    	let ul16;
    	let li37;
    	let a16;
    	let t852;
    	let ul17;
    	let li38;
    	let t854;
    	let ul18;
    	let li39;
    	let a17;
    	let t856;
    	let li40;
    	let a18;
    	let t858;
    	let pre75;
    	let code72;
    	let t860;
    	let p149;

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
    			t12 = text("İçeriğin detaylarını sol tarafta yer alan haritalandırma ile takip\nedebilirsin. İlk bölümlerde Svelte'i nasıl kullanabileceğine dair\nbilgilendirmeler yer alıyor. Bu kısımlara hakimsen, atlayarak\n");
    			a2 = element("a");
    			a2.textContent = "Start Game";
    			t14 = text(" bölümünden devam\nedebilirsin.");
    			t15 = space();
    			span1 = element("span");
    			t16 = space();
    			h21 = element("h2");
    			h21.textContent = "🪁 Oyun hakkında";
    			t18 = space();
    			p3 = element("p");
    			p3.textContent = "Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre\narayüz üzerinde kartlar bulunacak. Kartlara click eventi gerçekleştiğinde\nkartlar açılacak, kullanıcılar açılan kartları eşleştirmeye çalışacaklar.\nEşleşen kartlar açık bir şekilde arayüz üzerinde dururken başarılı eşleşme\nsonucunda kullanıcıya puan kazandıracak, başarısız her eşleşmede kartlar\nbulundukları yerde yeniden kapatılacaklar. Bütün kartlar eşleştiklerinde, bir\nsonraki seviyede yer alan kartlar arayüze kapalı olarak yeniden gelecektir.";
    			t20 = space();
    			p4 = element("p");
    			img1 = element("img");
    			t21 = space();
    			p5 = element("p");
    			t22 = text("Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde\nyer alan görsellerden birini seçmesi beklenecektir (Avatarlar ne kadar evcil\ngözükseler de, güç içlerinde gizli 🐱‍👤). Bu seçilen değerler oyunun arayüzünde\nkartların yer aldığı bölümün altında ");
    			em1 = element("em");
    			em1.textContent = "score & level";
    			t24 = text(" değerleri ile\nbirlikte gösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak\ntutulurken, ");
    			em2 = element("em");
    			em2.textContent = "score & level";
    			t26 = text(" değerleri dinamik olarak kullanıcı davranışına göre\ngüncellenecektir.");
    			t27 = space();
    			span2 = element("span");
    			t28 = space();
    			h22 = element("h2");
    			h22.textContent = "🪁 Svelte nedir?";
    			t30 = space();
    			p6 = element("p");
    			t31 = text("Svelte günümüz modern library ve framework habitatının komplex yapılarını\nazaltarak daha basit şekilde yüksek verimliliğe sahip uygulamalar\ngeliştirilmesini sağlamayı amaçlayan bir derleyicidir. Modern framework/library\nile birlikte geride bıraktığımız her süreçte farklı ihtiyaçlar için yeni bir\nöğrenme süreci ortaya çıktı. Öğrenme döngüsünün sürekli olarak geliştiricilerin\nkarşısına çıkması bir süre sonrasında illallah dedirtmeye başladığı gayet\naşikar. Svelte alışık olduğumuz ");
    			em3 = element("em");
    			em3.textContent = "html & css & js";
    			t33 = text(" kod yapılarına benzer bir\nsözdizimine sahip olması, props ve state/stores güncellemeleri için 40 takla\natılmasına gerek kalınmaması gibi özellikleri ile bu döngünün dışına çıkmayı\nbaşarabilmiş.. ve umuyorum ki bu şekilde sadeliğini korumaya devam edebilir.");
    			t34 = space();
    			p7 = element("p");
    			a3 = element("a");
    			a3.textContent = "Stack Overflow Developer Survey 2021";
    			t36 = text(" anketinde geliştiriciler tarafından %71.47 oranıyla en çok sevilen\nweb framework Svelte olarak seçildi.");
    			t37 = space();
    			h23 = element("h2");
    			h23.textContent = "🪁 Basit ifadeler";
    			t39 = space();
    			p8 = element("p");
    			p8.textContent = "Bazı bölümlerde aynı kelimeleri tekrar etmemek için, bazı kısayol ifadeleri\nkullandım(tamamen salladım). Sayısı çok fazla değil, sorun yaşayacağını\ndüşünmüyorum.";
    			t41 = space();
    			ul6 = element("ul");
    			li1 = element("li");
    			code0 = element("code");
    			code0.textContent = "_Playground_";
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Playground.svelte Component";
    			t44 = space();
    			li3 = element("li");
    			code1 = element("code");
    			code1.textContent = "+ User.svelte";
    			ul1 = element("ul");
    			li2 = element("li");
    			em4 = element("em");
    			em4.textContent = "User.svelte";
    			t47 = text(" dosyası oluşturuldu.");
    			t48 = space();
    			li5 = element("li");
    			code2 = element("code");
    			code2.textContent = "Avatar/";
    			ul2 = element("ul");
    			li4 = element("li");
    			em5 = element("em");
    			em5.textContent = "Avatar";
    			t51 = text(" klasörü oluşturuldu.");
    			t52 = space();
    			li7 = element("li");
    			code3 = element("code");
    			code3.textContent = "+ User.svelte + Header.svelte + Avatars.svelte";
    			ul3 = element("ul");
    			li6 = element("li");
    			em6 = element("em");
    			em6.textContent = "User.svelte, Header.svelte, Avatars.svelte";
    			t55 = text(" dosyaları oluşturuldu.");
    			t56 = space();
    			li9 = element("li");
    			code4 = element("code");
    			code4.textContent = "+ User > Avatar.svelte";
    			ul4 = element("ul");
    			li8 = element("li");
    			em7 = element("em");
    			em7.textContent = "User";
    			t59 = text(" klasörü içerisinde ");
    			em8 = element("em");
    			em8.textContent = "Avatar.svelte";
    			t61 = text(" dosyası oluşturuldu.");
    			t62 = space();
    			li11 = element("li");
    			code5 = element("code");
    			code5.textContent = "+ public > assets > images > pasa.jpg, sabuha.jpg";
    			ul5 = element("ul");
    			li10 = element("li");
    			em9 = element("em");
    			em9.textContent = "public > assets > images";
    			t65 = text(" klasörü içerisinde ");
    			em10 = element("em");
    			em10.textContent = "pasa.jpg";
    			t67 = text(", ");
    			em11 = element("em");
    			em11.textContent = "sabuha.jpg";
    			t69 = text("\ndosyaları oluşturuldu.");
    			t70 = space();
    			span3 = element("span");
    			t71 = space();
    			h24 = element("h2");
    			h24.textContent = "🪁 Svelte projesi oluşturma";
    			t73 = space();
    			p9 = element("p");
    			p9.textContent = "Npx ile yeni bir proje oluşturma:";
    			t75 = space();
    			html_tag = new HtmlTag(false);
    			t76 = space();
    			p10 = element("p");
    			p10.textContent = "Svelte Typescript notasyonunu desteklemektedir. Typescript üzerinde\nyapabileceğiniz bütün işlemleri Svelte projelerinde kullanabilirsin.";
    			t78 = space();
    			html_tag_1 = new HtmlTag(false);
    			t79 = space();
    			p11 = element("p");
    			p11.textContent = "Gerekli olan bağımlılıkları projemize ekleyerek ayağa kaldırabiliriz.";
    			t81 = space();
    			html_tag_2 = new HtmlTag(false);
    			t82 = space();
    			p12 = element("p");
    			p12.textContent = "Bu komutlar sonrasında konsol üzerinde projenin hangi port üzerinde çalıştığını\ngörebilirsin. Windows işletim sistemlerinde varsayılan 8080 portu işaretli\niken, bu port üzerinde çalışan proje bulunuyorsa veya farklı işletim sistemi\nkullanıyorsan port numarası değişkenlik gösterebilir.";
    			t84 = space();
    			p13 = element("p");
    			img2 = element("img");
    			t85 = space();
    			span4 = element("span");
    			t86 = space();
    			h25 = element("h2");
    			h25.textContent = "🪁 Svelte nasıl çalışır?";
    			t88 = space();
    			p14 = element("p");
    			t89 = text("Svelte bileşenleri ");
    			em12 = element("em");
    			em12.textContent = ".svelte";
    			t91 = text(" uzantılı dosyalar ile oluşturulur. HTML'e benzer\nolarak ");
    			em13 = element("em");
    			em13.textContent = "script, style, html";
    			t93 = text(" kod yapılarını oluşturabilirdiğiniz üç farklı bölüm\nbulunuyor.");
    			t94 = space();
    			p15 = element("p");
    			t95 = text("Uygulama oluşturduğumuzda bu bileşenler derlenerek, pure ");
    			em14 = element("em");
    			em14.textContent = "Javascript";
    			t97 = text("\nkodlarına dönüştürülür. Svelte derleme işlemini runtime üzerinde\ngerçekleştiriyor. Bu derleme işlemiyle birlikte Virtual DOM bağımlılığını\nortadan kalkıyor.");
    			t98 = space();
    			p16 = element("p");
    			img3 = element("img");
    			t99 = space();
    			span5 = element("span");
    			t100 = space();
    			h26 = element("h2");
    			h26.textContent = "🪁 Proje bağımlılıkları";
    			t102 = space();
    			ul7 = element("ul");
    			li12 = element("li");
    			h40 = element("h4");
    			h40.textContent = "Typescript";
    			t104 = text("\nTypescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı\nhataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Projenizde\nyer alan ");
    			em15 = element("em");
    			em15.textContent = ".svelte";
    			t106 = text(" uzantılı dosyalarda kullanabileceğiniz gibi, ");
    			em16 = element("em");
    			em16.textContent = ".ts";
    			t108 = text("\ndosyalarını da destekler.");
    			t109 = space();
    			li13 = element("li");
    			h41 = element("h4");
    			h41.textContent = "Rollup";
    			t111 = text("\nSvelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası\noluşturulacaktır. Rollup Javascript uygulamalar için kullanılan bir modül\npaketleyicidir, uygulamamızda yer alan kodları tarayıcının anlayabileceği\nşekilde ayrıştırır. Svelte kurulumunda default olarak projenize eklenir.");
    			t112 = space();
    			span6 = element("span");
    			t113 = space();
    			h27 = element("h2");
    			h27.textContent = "🪁 Svelte yapısını inceleme";
    			t115 = space();
    			p17 = element("p");
    			t116 = text("Varsayılan ");
    			em17 = element("em");
    			em17.textContent = "src/App.svelte";
    			t118 = text(" dosyasını kontrol ettiğimizde daha önce\ndeğindiğimiz gibi ");
    			em18 = element("em");
    			em18.textContent = "Javascript";
    			t120 = text(" kodları için ");
    			em19 = element("em");
    			em19.textContent = "script";
    			t122 = text(", ");
    			em20 = element("em");
    			em20.textContent = "html";
    			t124 = text(" kodları için ");
    			em21 = element("em");
    			em21.textContent = "main";
    			t126 = text("\nve stillendirme için ");
    			em22 = element("em");
    			em22.textContent = "style";
    			t128 = text(" tagları bulunuyor.");
    			t129 = space();
    			p18 = element("p");
    			t130 = text("🎈 ");
    			em23 = element("em");
    			em23.textContent = "script";
    			t132 = text(" etiketinde ");
    			em24 = element("em");
    			em24.textContent = "lang";
    			t134 = text(" özelliği Typescript bağımlılığını eklediğimiz\niçin ");
    			em25 = element("em");
    			em25.textContent = "ts";
    			t136 = text(" değerinde bulunmaktadır. Typescript kullanmak istediğin ");
    			em26 = element("em");
    			em26.textContent = "svelte";
    			t138 = text("\ndosyalarında ");
    			em27 = element("em");
    			em27.textContent = "lang";
    			t140 = text(" özelliğine ");
    			em28 = element("em");
    			em28.textContent = "ts";
    			t142 = text(" değerini vermen yeterli olacaktır.");
    			t143 = space();
    			p19 = element("p");
    			t144 = text("🎈 ");
    			em29 = element("em");
    			em29.textContent = "main";
    			t146 = text(" etiketinde ");
    			em30 = element("em");
    			em30.textContent = "html";
    			t148 = text(" kodlarını tanımlayabileceğin gibi, bu etiketin\ndışında da dilediğin gibi ");
    			em31 = element("em");
    			em31.textContent = "html";
    			t150 = text(" kodlarını tanımlayabilirsin. Svelte\ntanımladığın kodları ");
    			em32 = element("em");
    			em32.textContent = "html";
    			t152 = text(" kodu olarak derlemesine rağmen, proje yapısının\ndaha okunabilir olabilmesi için kapsayıcı bir etiketin altında toplanması daha\niyi olabilir.");
    			t153 = space();
    			p20 = element("p");
    			t154 = text("🎈 ");
    			em33 = element("em");
    			em33.textContent = "style";
    			t156 = text(" etiketi altında tanımladığın stil özelliklerinden, aynı dosyada\nbulunan ");
    			em34 = element("em");
    			em34.textContent = "html";
    			t158 = text(" alanında seçiciler etkilenir. Global seçicileri\ntanımlayabilir veya global olarak tanımlamak istediğin seçicileri\n");
    			code6 = element("code");
    			code6.textContent = "public/global.css";
    			t160 = text(" dosyasında düzenleyebilirsin.");
    			t161 = space();
    			p21 = element("p");
    			t162 = text("🎈 Proje içerisinde compile edilen bütün yapılar ");
    			code7 = element("code");
    			code7.textContent = "/public/build/bundle.js";
    			t164 = text("\ndosyasında yer almaktadir. ");
    			em35 = element("em");
    			em35.textContent = "index.html";
    			t166 = text(" dosyası buradaki yapıyı referans alarak\nSvelte projesini kullanıcı karşısına getirmektedir.");
    			t167 = space();
    			h28 = element("h2");
    			h28.textContent = "🪁 Biraz pratik";
    			t169 = space();
    			p22 = element("p");
    			p22.textContent = "Birkaç örnek yaparak Svelte'i anlamaya, yorumlamaya çalışalım. Kod örnekleri\noyun üzerinde sıkça kullanacağımız yapılar için bir temel oluşturacak.";
    			t171 = space();
    			p23 = element("p");
    			em36 = element("em");
    			em36.textContent = "App.svelte";
    			t173 = text(" dosyasında ");
    			em37 = element("em");
    			em37.textContent = "name";
    			t175 = text(" isminde bir değişken tanımlanmış. Typescript\nnotasyonu baz alındığı için değer tipi olarak ");
    			em38 = element("em");
    			em38.textContent = "string";
    			t177 = text(" verilmiş. Bu notasyon ile\nanlatım biraz daha uzun olabileceği için kullanmamayı tercih edicem. Github\nüzerinde bulunan kodlar ile, burada birlikte oluşturacaklarımız farklılık\ngösterebilir.. panik yok, Typescript'e ");
    			a4 = element("a");
    			a4.textContent = "hakim olabileceğine";
    			t179 = text("\neminim.");
    			t180 = space();
    			h30 = element("h3");
    			h30.textContent = "🎈 Variable erişimi";
    			t182 = space();
    			p24 = element("p");
    			p24.textContent = "Script üzerinde tanımlanan değerleri html içerisinde çağırabilmek için\n{ } kullanılmalıdır. Bu template ile değer tipi farketmeksizin\ndeğişkenleri çağırarak işlemler gerçekleştirilebilir.";
    			t184 = space();
    			p25 = element("p");
    			em39 = element("em");
    			em39.textContent = "app.svelte";
    			t186 = space();
    			div0 = element("div");
    			pre0 = element("pre");
    			pre0.textContent = "const user = \"sabuha\";";
    			t188 = space();
    			pre1 = element("pre");

    			pre1.textContent = `${`\<span>{user} seni izliyor!</span>
`}`;

    			t190 = space();
    			pre2 = element("pre");

    			pre2.textContent = `${`\<style>
  h1 {
    color: rebeccapurple;
  }
</style>`}`;

    			t192 = space();
    			p26 = element("p");
    			t193 = text("Bu tanımlama ile birlikte ");
    			em40 = element("em");
    			em40.textContent = "user";
    			t195 = text(" değerine tanımlanan her değeri dinamik olarak\n");
    			em41 = element("em");
    			em41.textContent = "html";
    			t197 = text(" içerisinde çağırabilirsin. biraz daha biraz daha karıştıralım..\n");
    			em42 = element("em");
    			em42.textContent = "user";
    			t199 = text(" tanımlaması ");
    			em43 = element("em");
    			em43.textContent = "sabuha";
    			t201 = text(" değerine eşit olduğu durumlarda 'seni izliyor!'\nyerine 'bir kedi gördüm sanki!' değerini ekrana getirelim.");
    			t202 = space();
    			p27 = element("p");
    			em44 = element("em");
    			em44.textContent = "app.svelte";
    			t204 = space();
    			div1 = element("div");
    			pre3 = element("pre");

    			pre3.textContent = `${`\<script>
  const user = "sabuha";
</>`}`;

    			t206 = space();
    			pre4 = element("pre");

    			pre4.textContent = `${`\<span>{user === "sabuha" ? "bir kedi gördüm sanki!" : "seni izliyor!"}</span>
`}`;

    			t208 = space();
    			pre5 = element("pre");
    			pre5.textContent = `${`\<style></style>`}`;
    			t210 = space();
    			p28 = element("p");
    			em45 = element("em");
    			em45.textContent = "html";
    			t212 = text(" içerisinde kullandığımız { } tagları arasında condition\nyapıları gibi döngü, fonksiyon çağırma işlemleri gerçekleştirebilirsin. Bu\nyapılara sahip birçok işlemi birlikte gerçekleştireceğiz.");
    			t213 = space();
    			h31 = element("h3");
    			h31.textContent = "🎈 Reaktif değişkenler";
    			t215 = space();
    			p29 = element("p");
    			p29.textContent = "Değişkenlik gösterebilecek dinamik verilerin güncellendiğinde, DOM üzerinde\nyer alan referansı benzer olarak güncellenir.";
    			t217 = space();
    			p30 = element("p");
    			em46 = element("em");
    			em46.textContent = "app.svelte";
    			t219 = space();
    			div2 = element("div");
    			pre6 = element("pre");

    			pre6.textContent = `${`\<script>
  let number = 0;
  
  const randomNumber = () => {
    number = Math.round(Math.random() \* 15);
  };
</script>`}`;

    			t221 = space();
    			pre7 = element("pre");

    			pre7.textContent = `${`\
<main>
  <h3>{number}</h3>
  <button on:click={randomNumber}>Update Number</button>
</main>
`}`;

    			t223 = space();
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

    			t225 = space();
    			p31 = element("p");
    			t226 = text("Tanımladığımız ");
    			em47 = element("em");
    			em47.textContent = "numb";
    			t228 = text(" değeri her güncellendiğinde, DOM üzerinde bu değer\nyeniden ve sıkılmadan güncellenmeye devam edecektir.");
    			t229 = space();
    			p32 = element("p");
    			img4 = element("img");
    			t230 = space();
    			h32 = element("h3");
    			h32.textContent = "🎈 Component kullanımı";
    			t232 = space();
    			p33 = element("p");
    			p33.textContent = "Uygulamalarımızda yer alan bileşenleri parçalayarak istediğimiz gibi bir bütün\nhaline getirebilmek üzerinde çalışırken kolaylık sağlar, tekrar eden bileşen\nparçalarında yeniden çağırabilmek daha az efor sarfettirir.";
    			t234 = space();
    			p34 = element("p");
    			img5 = element("img");
    			t235 = space();
    			p35 = element("p");
    			t236 = text("Bir önceki örnekte yaptığımız random sayı üreten basit yapıyı bir component\nhaline getirelim. ");
    			code8 = element("code");
    			code8.textContent = "components/Content/";
    			t238 = text(" dizininde ");
    			code9 = element("code");
    			code9.textContent = "RandomNumber.svelte";
    			t240 = text(" dosyasını oluşturalım.\nBu yeni componentimizi ");
    			code10 = element("code");
    			code10.textContent = "App.svelte";
    			t242 = text(" dosyasında kullanalım.");
    			t243 = space();
    			p36 = element("p");
    			em48 = element("em");
    			em48.textContent = "Components > Content > RandomNumber.svelte";
    			t245 = space();
    			div3 = element("div");
    			pre9 = element("pre");

    			pre9.textContent = `${`\<script>
  let number = 0;
  
  const randomNumber = () => {
    number = Math.round(Math.random() \* 15);
  };
</script>`}`;

    			t247 = space();
    			pre10 = element("pre");

    			pre10.textContent = `${`\
<div class="random-number-capsule">
  <h3>{number}</h3>
  <button on:click={randomNumber}>Update Number</button>
</div>
`}`;

    			t249 = space();
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

    			t251 = space();
    			p37 = element("p");
    			code11 = element("code");
    			code11.textContent = "RandomNumber";
    			t253 = text(" componentini istediğimiz gibi çağırarak kullanmaya\nbaşlayabiliriz.");
    			t254 = space();
    			p38 = element("p");
    			em49 = element("em");
    			em49.textContent = "App.svelte";
    			t256 = space();
    			div4 = element("div");
    			pre12 = element("pre");

    			pre12.textContent = `${`\<script>
  \import RandomNumber from "./components/Content/RandomNumber/RandomNumber.svelte";  
</script>`}`;

    			t258 = space();
    			pre13 = element("pre");

    			pre13.textContent = `${`\
<main>
  <RandomNumber />
  <RandomNumber />
  <RandomNumber />
  <RandomNumber />
</main>
`}`;

    			t260 = space();
    			pre14 = element("pre");

    			pre14.textContent = `${`\<style>
</style>`}`;

    			t262 = space();
    			p39 = element("p");
    			img6 = element("img");
    			t263 = space();
    			h33 = element("h3");
    			h33.textContent = "🎈 Componentler Arası İletişim";
    			t265 = space();
    			p40 = element("p");
    			img7 = element("img");
    			t266 = space();
    			p41 = element("p");
    			p41.textContent = "Küçük yapılı projelerden, komplex yapılılara kadar birçok component üzerinden\nalıp farklı bir yerde kullanma, güncelleme gibi ihtiyaçlarımız olacak.\nKullanılan framework, library veya compiler'in bu ihtiyacınıza esnek çözümler\nsağlayabilmesi gerekiyor. Svelte bu ihtiyaçlarınız için birden fazla ve basit\nyapılara sahip çözümler barındırıyor.";
    			t268 = space();
    			h42 = element("h4");
    			h42.textContent = "🎈🎈 Props";
    			t270 = space();
    			p42 = element("p");
    			p42.textContent = "Props kullanarak dataları bir component üzerinden farklı componentlere\naktarabilirsiniz. Componentler arası bu ilişki parent-child ile ifade edilir.\nParent üzerinden child componentlere veri aktarabiliyorken, aynı zamanda child\ncomponent üzerinden parent componente veri iletebilirsiniz.";
    			t272 = space();
    			h43 = element("h4");
    			h43.textContent = "🎈🎈 Slots";
    			t274 = space();
    			p43 = element("p");
    			p43.textContent = "Parent-child ilişkisinde olduğu gibi verilerin alt componente\naktarılmasında kullanabilirsin. Bir template dahilinde (html içeririkleri gibi)\nverilerin aktarılmasına izin verir.";
    			t276 = space();
    			h44 = element("h4");
    			h44.textContent = "🎈🎈 Context";
    			t278 = space();
    			p44 = element("p");
    			p44.textContent = "Bir veriyi iletmeniz gereken component sayısı arttıkça, yapısını kurgulamak ve\ntakibini sağlamak zor ve bir yerden sonra da oldukça sıkıcı bir duruma\ndönüşebilir. Context ile dataların parent üzerinden child componentler\nüzerinde erişilmesini sağlar.";
    			t280 = space();
    			h45 = element("h4");
    			h45.textContent = "🎈🎈 Module Context";
    			t282 = space();
    			p45 = element("p");
    			p45.textContent = "Component üzerinde kullandığınız veri farklı bir Component'da yer alıyorsa ve\nçalışmaları birbirlerine bağımlı olduğu senaryolarda Module Context Componentlar\narasında bu senaryonun uygulanmasını sağlıyor. Verileri birden çok component ile\npaylaşılmasını olanak tanır.";
    			t284 = space();
    			h46 = element("h4");
    			h46.textContent = "🎈🎈 Store";
    			t286 = space();
    			p46 = element("p");
    			p46.textContent = "Veri taşımacılık ltd. şti.'nin joker kartı.. Verilerinizi her yerde\ngüncellenmesini, çağırılmasını sağlar. Kullanımı için bir hiyerarşi içerisinde\nolmasına gereksinimi bulunmuyor.";
    			t288 = space();
    			h29 = element("h2");
    			h29.textContent = "🪁 Svelte lifecycle";
    			t290 = space();
    			span7 = element("span");
    			t291 = space();
    			h210 = element("h2");
    			h210.textContent = "🪁 Start Game";
    			t293 = space();
    			p47 = element("p");
    			t294 = text("Svelte'i biraz daha yakından tanıyoruz, birlikte uygulamamızı oluşturabilmek\niçin yeteri kadar bilgi sahibi olduk. Kullanıcının arayüz olarak görebileceği\niki Component bulunuyor. Kullanıcı adı ve avatar seçtiği User Component, bu\nseçimler sonrasında erişilen Playground Component. User Componenti ile oyunumuzu\noluşturmaya başlayalım. ");
    			a5 = element("a");
    			a5.textContent = "Yeni bir proje oluşturabilir";
    			t296 = text("\nveya pratik yapabilmek için şuana kadarki kodları kaldırabilirsin.\n");
    			em50 = element("em");
    			em50.textContent = "src > components > User";
    			t298 = text(" ve ");
    			em51 = element("em");
    			em51.textContent = "src > components > Playground";
    			t300 = text(" klasörlerini\noluşturalım.");
    			t301 = space();
    			p48 = element("p");
    			img8 = element("img");
    			t302 = space();
    			h34 = element("h3");
    			h34.textContent = "🎈 User Component";
    			t304 = space();
    			p49 = element("p");
    			em52 = element("em");
    			em52.textContent = "User";
    			t306 = text(" klasörü altında Kullanıcıdan alacağımız her değer için ");
    			em53 = element("em");
    			em53.textContent = "Avatar";
    			t308 = text(" ve\n");
    			em54 = element("em");
    			em54.textContent = "Name";
    			t310 = text(" klasörlerini oluşturalım. Root klasörde ");
    			em55 = element("em");
    			em55.textContent = "User";
    			t312 = text(" Component altında\ntanımlanan bütün yapıların yer alacağı bir kapsayıcı dahil edeceğiz.\n");
    			em56 = element("em");
    			em56.textContent = "UserGround.svelte";
    			t314 = text(" isminde bir dosya oluşturuyorum, parçaladığımız bütün\ncomponentler burada yer alacak.");
    			t315 = space();
    			p50 = element("p");
    			em57 = element("em");
    			em57.textContent = "Playground";
    			t317 = text(" klasörü içerisinde buna benzer bir yapıyı oluşturarak, oyun\niçerisindeki bütün componentleri aynı dosya üzerinde çağıracağız.\n");
    			em58 = element("em");
    			em58.textContent = "Playground";
    			t319 = text(" altında ");
    			em59 = element("em");
    			em59.textContent = "Wrapper > Playground.svelte";
    			t321 = text(" dizin ve dosyasını\noluşturalım.");
    			t322 = space();
    			p51 = element("p");
    			t323 = text("User Componenti üzerinde çalışırken, yapacağımız değişiklikleri inceleyebilmek\niçin User Component'ini ");
    			em60 = element("em");
    			em60.textContent = "Playground > Wrapper > Playground.svelte";
    			t325 = text(" dosyasında\nçağıralım.");
    			t326 = space();
    			p52 = element("p");
    			em61 = element("em");
    			em61.textContent = "User > UserGround.svelte";
    			t328 = space();
    			div5 = element("div");
    			pre15 = element("pre");

    			pre15.textContent = `${`\<script>
  const componentDetail = "User";
</script>`}`;

    			t330 = space();
    			pre16 = element("pre");

    			pre16.textContent = `${`\
<main>
  <h2>{componentDetail} Component</h2>
</main>
`}`;

    			t332 = space();
    			pre17 = element("pre");

    			pre17.textContent = `${`\<style>
  h2 {
    color: white;
    background-color: orangered;
    text-align: center;
  }
</style>`}`;

    			t334 = space();
    			p53 = element("p");
    			em62 = element("em");
    			em62.textContent = "Playground > Wrapper > Playground.svelte";
    			t336 = space();
    			div6 = element("div");
    			pre18 = element("pre");

    			pre18.textContent = `${`\<script>
  \import Userground from "../../User/Userground.svelte";
</script>`}`;

    			t338 = space();
    			pre19 = element("pre");

    			pre19.textContent = `${`\
<main>
   <UserGround />
</main>
`}`;

    			t340 = space();
    			pre20 = element("pre");

    			pre20.textContent = `${`\<style>
  h2 {
    color: white;
    background-color: orangered;
    text-align: center;
  }
</style>`}`;

    			t342 = space();
    			p54 = element("p");
    			em63 = element("em");
    			em63.textContent = "User Component";
    			t344 = text(" çağırdıktan sonra üzerinde geliştirme yapmaya başlayalım.");
    			t345 = space();
    			p55 = element("p");
    			img9 = element("img");
    			t346 = space();
    			p56 = element("p");
    			p56.textContent = "Component üzerinde 4 farklı bölüm yer alıyor.";
    			t348 = space();
    			ul8 = element("ul");
    			li14 = element("li");
    			li14.textContent = "Kullanıcıyı bilgilendiren bir header yazısı";
    			t350 = space();
    			li15 = element("li");
    			li15.textContent = "Kullanıcının görseller üzerinden avatar seçimi yapabildiği bir bölüm";
    			t352 = space();
    			li16 = element("li");
    			li16.textContent = "Kullanıcı adının girilebilmesi için alan";
    			t354 = space();
    			li17 = element("li");
    			li17.textContent = "Ve bütün bunlar tamamlandığında oyuna start veren bir button elementi\nbulunuyor.";
    			t356 = space();
    			p57 = element("p");
    			img10 = element("img");
    			t357 = space();
    			h35 = element("h3");
    			h35.textContent = "🎈 Header Component";
    			t359 = space();
    			p58 = element("p");
    			t360 = text("Root folder üzerinde ");
    			em64 = element("em");
    			em64.textContent = "Header.svelte";
    			t362 = text(" isminde bir Component oluşturuyorum.\nÖnceki örneklerde gerçekleştirdiğimiz gibi, ");
    			em65 = element("em");
    			em65.textContent = "Header.svelte";
    			t364 = text(" Componentini\n");
    			em66 = element("em");
    			em66.textContent = "Userground.svelte";
    			t366 = text(" componenti üzerinde çağıralım. Oluşturduğumuz\n");
    			em67 = element("em");
    			em67.textContent = "Header.svelte";
    			t368 = text(" componentinin basit bir görevi bulunuyor, statik bir metin\nbarındırıyor.");
    			t369 = space();
    			p59 = element("p");
    			em68 = element("em");
    			em68.textContent = "User > Header.svelte";
    			t371 = space();
    			div7 = element("div");
    			pre21 = element("pre");
    			pre21.textContent = `${`\<script></script>`}`;
    			t373 = space();
    			pre22 = element("pre");

    			pre22.textContent = `${`\
<div class="header">
  <h2>select your best pokemon and start catching!</h2>
</div>
`}`;

    			t375 = space();
    			pre23 = element("pre");

    			pre23.textContent = `${`\<style>
  .header {
    padding: 5px 0;
    margin-bottom: 15px;
    border-bottom: 3px solid white;
  }
</style>`}`;

    			t377 = space();
    			p60 = element("p");
    			em69 = element("em");
    			em69.textContent = "User > UserGround.svelte";
    			t379 = space();
    			div8 = element("div");
    			pre24 = element("pre");

    			pre24.textContent = `${`\<script>
  \import Header from "./Header.svelte";
</script>`}`;

    			t381 = space();
    			pre25 = element("pre");

    			pre25.textContent = `${`\
<main>
  <Header />
</main>
`}`;

    			t383 = space();
    			pre26 = element("pre");

    			pre26.textContent = `${`\<style>
  main {
    background-color: #f5f5f5;
    border-radius: 5px;
    padding-bottom: 15px;
  }
</style>`}`;

    			t385 = space();
    			p61 = element("p");
    			img11 = element("img");
    			t386 = space();
    			p62 = element("p");
    			p62.textContent = "Süper iğrenç gözüküyor, öyle değil mi? İyi ki CSS var..";
    			t388 = space();
    			p63 = element("p");
    			em70 = element("em");
    			em70.textContent = "Playground > Wrapper > Playground.svelte";
    			t390 = space();
    			div9 = element("div");
    			pre27 = element("pre");

    			pre27.textContent = `${`\<script>
  \import Userground from "../../User/Userground.svelte";
</script>`}`;

    			t392 = space();
    			pre28 = element("pre");

    			pre28.textContent = `${`\
<main class="playground">
   <Userground />
</main>
`}`;

    			t394 = space();
    			pre29 = element("pre");

    			pre29.textContent = `${`\<style>
  .playground {
    width: 900px;
    margin: 0 auto;
    text-align: center;
  }
</style>`}`;

    			t396 = space();
    			p64 = element("p");
    			p64.textContent = "Ehh... şimdi biraz daha az kötü gözüktüğü söylenebilir💩💩💩";
    			t398 = space();
    			h36 = element("h3");
    			h36.textContent = "🎈 Avatar Component";
    			t400 = space();
    			p65 = element("p");
    			p65.textContent = "Bu Component içerisinde birden fazla bileşene ihtiyaç duyduğu için, bir klasör\noluşturarak bütün gereksinim duyduğu yapıları klasör içerisinde tanımlayalım.";
    			t402 = space();
    			ul9 = element("ul");
    			li18 = element("li");
    			code12 = element("code");
    			code12.textContent = "Avatar/";
    			t404 = space();
    			li19 = element("li");
    			code13 = element("code");
    			code13.textContent = "+ User > Avatar > Avatars.svelte, ImageAvatar.svelte";
    			t406 = space();
    			li20 = element("li");
    			code14 = element("code");
    			code14.textContent = "+ public > assets > images > pasa.jpg, sabuha.jpg, mohito.jpg, limon.jpg, susi.jpg";
    			t408 = space();
    			li21 = element("li");
    			a6 = element("a");
    			a6.textContent = "images";
    			t410 = space();
    			p66 = element("p");
    			em71 = element("em");
    			em71.textContent = "Avatars.svelte";
    			t412 = space();
    			em72 = element("em");
    			em72.textContent = "Userground.svelte";
    			t414 = text(" içerisinde çağıralım. ");
    			em73 = element("em");
    			em73.textContent = "Avatars.svelte";
    			t416 = text(",\n");
    			em74 = element("em");
    			em74.textContent = "ImageAvatar.svelte";
    			t418 = text(" bir kapsayıcı görevi görecek. Bununla birlikte\n");
    			em75 = element("em");
    			em75.textContent = "ImageAvatar.svelte";
    			t420 = text(" componentine data gönderecek.");
    			t421 = space();
    			p67 = element("p");
    			em76 = element("em");
    			em76.textContent = "User > Avatar > Avatars.svelte";
    			t423 = space();
    			div10 = element("div");
    			pre30 = element("pre");

    			pre30.textContent = `${`\<script>
  // avatar list
  let sabuha = "/asset/images/sabuha.jpg";
  let pasa = "/asset/images/pasa.jpg";
</script>`}`;

    			t425 = space();
    			pre31 = element("pre");

    			pre31.textContent = `${`\
<div class="avatars">
  <img src={sabuha} alt="" />
  <img src={pasa} alt="" />
</div>
`}`;

    			t427 = space();
    			pre32 = element("pre");

    			pre32.textContent = `${`\<style>
 img {
    width: 100px;
  }
</style>`}`;

    			t429 = space();
    			p68 = element("p");
    			em77 = element("em");
    			em77.textContent = "Avatars";
    			t431 = text(", ");
    			em78 = element("em");
    			em78.textContent = "Userground";
    			t433 = text(" üzerinde çağırdığımda karşıma bu iki güzellik gelecek.");
    			t434 = space();
    			p69 = element("p");
    			img12 = element("img");
    			t435 = space();
    			p70 = element("p");
    			em79 = element("em");
    			em79.textContent = "Avatars";
    			t437 = text(" biraz daha işlevli bir yapıya büründürelim.");
    			t438 = space();
    			p71 = element("p");
    			em80 = element("em");
    			em80.textContent = "User > Avatar > Avatars.svelte";
    			t440 = space();
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

    			t442 = space();
    			pre34 = element("pre");

    			pre34.textContent = `${`\
<div class="avatars">
 { #each avatars as userAvatar}
    <ImageAvatar {userAvatar} />
{ /each}

</div>
`}`;

    			t444 = space();
    			pre35 = element("pre");

    			pre35.textContent = `${`\<style>
 .avatars {
    display: flex;
    justify-content: center;
  }
</style>`}`;

    			t446 = space();
    			p72 = element("p");
    			t447 = text("Oluşturduğumuz ");
    			code15 = element("code");
    			code15.textContent = "avatars";
    			t449 = text(" dizisine ait her elemana ");
    			em81 = element("em");
    			em81.textContent = "html";
    			t451 = text(" üzerinde #each\ndöngüsünde erişiyoruz. Erişilen her elemanının bilgisini ");
    			em82 = element("em");
    			em82.textContent = "ImageAvatar";
    			t453 = text("\ncomponentine aktarıyoruz. Componente aktarılan bu değerlerle birlikte,\ndizi içerisinde bulunan her elamanın görüntüsünü elde edeceğiz.");
    			t454 = space();
    			p73 = element("p");
    			em83 = element("em");
    			em83.textContent = "User > Avatar > ImageAvatar.svelte";
    			t456 = space();
    			div12 = element("div");
    			pre36 = element("pre");

    			pre36.textContent = `${`\<script>
  \export let userAvatar;
</script>`}`;

    			t458 = space();
    			pre37 = element("pre");

    			pre37.textContent = `${`\
<img src={avatar} class="avatar unpicked" alt="avatar" />
`}`;

    			t460 = space();
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

    			t462 = space();
    			p74 = element("p");
    			p74.textContent = "Daha güzel bir görüntüyü hak ettik. Avatarlar üzerinde CSS ile biraz\ndüzenlemeler yapmamız gerekti.";
    			t464 = space();
    			p75 = element("p");
    			img13 = element("img");
    			t465 = space();
    			h37 = element("h3");
    			h37.textContent = "🎈 Name Component";
    			t467 = space();
    			p76 = element("p");
    			p76.textContent = "Pokemon eğitmenimizin bir isim girebilmesi için gerekli olan componenti\noluşturalım.";
    			t469 = space();
    			p77 = element("p");
    			code16 = element("code");
    			code16.textContent = "+ /components/User/Avatar/Name";
    			t471 = space();
    			p78 = element("p");
    			code17 = element("code");
    			code17.textContent = "+ /components/User/Avatar/Name/UserName.svelte";
    			t473 = space();
    			p79 = element("p");
    			em84 = element("em");
    			em84.textContent = "User > Avatar > Name > UserName.svelte";
    			t475 = space();
    			div13 = element("div");
    			pre39 = element("pre");
    			pre39.textContent = `${`\<script></script>`}`;
    			t477 = space();
    			pre40 = element("pre");

    			pre40.textContent = `${`\
<div class="user">
  <input type="text" class="name" name="name" placeholder="pika pika" />
</div>
`}`;

    			t479 = space();
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

    			t481 = space();
    			p80 = element("p");
    			t482 = text("Diğer componentlerde yaptığımız gibi, ");
    			em85 = element("em");
    			em85.textContent = "UserName";
    			t484 = text(" componentinin ");
    			em86 = element("em");
    			em86.textContent = "Userground";
    			t486 = text("\ncomponentinde kullanalım.");
    			t487 = space();
    			p81 = element("p");
    			t488 = text("Geriye son bir componentimiz kaldı. \"Start\" yazısına sahip bir buton\ncomponentini oluşturarak, ");
    			em87 = element("em");
    			em87.textContent = "User";
    			t490 = text(" klasöründe ");
    			em88 = element("em");
    			em88.textContent = "Start.svelte";
    			t492 = text(" ismiyle kaydedererek\n");
    			em89 = element("em");
    			em89.textContent = "UserGround";
    			t494 = text(" componentinde çağıralım.");
    			t495 = space();
    			p82 = element("p");
    			p82.textContent = "Ta daaaa... Şuana kadar yaptığımız componentler dinamik işlemler\ngerçekleştirmedi. Arayüzü oluşturmak için yeteri kadar malzememiz ortaya çıktı,\nve bunları istediğin gibi stillendirebilirsin. Bundan sonraki aşamalarda bu\ncomponentlara dinamik özellikler kazandıracağız.";
    			t497 = space();
    			p83 = element("p");
    			img14 = element("img");
    			t498 = space();
    			h211 = element("h2");
    			h211.textContent = "🪁 Oyun Gereksinimleri";
    			t500 = space();
    			p84 = element("p");
    			t501 = text("Kullanıcının isim, avatar gibi aldığımız değerlerin yanı sıra oyunda kullanılan\nstandart değerler bulunabilir. Geliştireceğimiz oyun için bu değerlerden ");
    			em90 = element("em");
    			em90.textContent = "level";
    			t503 = text("\nve ");
    			em91 = element("em");
    			em91.textContent = "score";
    			t505 = text(" gibi iki değer tanımlayacağız. Kullanıcı, isim ve avatar seçiminin\nardından ");
    			em92 = element("em");
    			em92.textContent = "start";
    			t507 = text(" butonuna tıkladığında bu değerlerden ");
    			em93 = element("em");
    			em93.textContent = "level 1";
    			t509 = text(",\n");
    			em94 = element("em");
    			em94.textContent = "score 0";
    			t511 = text(" değerlerini oluşturacağız. Kullanıcı seviye atladıkça burada yer alan\ndeğerler dinamik olarak güncellenecek.");
    			t512 = space();
    			p85 = element("p");
    			code18 = element("code");
    			code18.textContent = "+ /Store/Level.ts";
    			t514 = space();
    			code19 = element("code");
    			code19.textContent = "+ /Store/Score.ts";
    			t516 = space();
    			p86 = element("p");
    			em95 = element("em");
    			em95.textContent = "Store > Level.ts";
    			t518 = space();
    			div14 = element("div");
    			pre42 = element("pre");

    			pre42.textContent = `${`\<script>
  \import { Writable, writable } from "svelte/store";
  
  export const level:Writable<number> = writable(1);
</script>`}`;

    			t520 = space();
    			p87 = element("p");
    			em96 = element("em");
    			em96.textContent = "level";
    			t522 = text(" isminde bir değer oluşturduk ve gezegenin iyiliği için uygulamamız\niçerisinde kullanacağız. Bu değeri kullanıcı arayüz üzerindeki bütün kartları\neşleştirebildiğinde güncelleyeceğiz. Bir store değeri oluşturmak için\n");
    			em97 = element("em");
    			em97.textContent = "writable";
    			t524 = text(" interface ile Store değerlerini oluşturabilir ve güncelleyebilirsin.");
    			t525 = space();
    			p88 = element("p");
    			t526 = text("Her eşleşme sonrasında kullanıcının puan kazanabildiği ");
    			em98 = element("em");
    			em98.textContent = "score";
    			t528 = text(" değeri\ntanımlayalım.");
    			t529 = space();
    			p89 = element("p");
    			em99 = element("em");
    			em99.textContent = "Store > Score.ts";
    			t531 = space();
    			div15 = element("div");
    			pre43 = element("pre");

    			pre43.textContent = `${`\<script>
  \import { Writable, writable } from "svelte/store";
  
  export const score:Writable<number> = writable(0);
</script>`}`;

    			t533 = space();
    			p90 = element("p");
    			t534 = text("Bu değerleri farklı dosyalarda tanımlayabildiğin gibi tek bir tek bir dosya\niçerisinde de ");
    			em100 = element("em");
    			em100.textContent = "score&level";
    			t536 = text(" değerlerini tanımlayabilirsin. Bir kullanıcı\noluşturarak ");
    			em101 = element("em");
    			em101.textContent = "name & avatar & score & level";
    			t538 = text(" değerlerini birlikte\nkullanabilirsin.");
    			t539 = space();
    			p91 = element("p");
    			p91.textContent = "Kullanıcıya ait statik bilgileri tutacağımız yeni bir class oluşturalım.";
    			t541 = space();
    			p92 = element("p");
    			code20 = element("code");
    			code20.textContent = "+ /Store/User.ts";
    			t543 = space();
    			p93 = element("p");
    			em102 = element("em");
    			em102.textContent = "Store > User.ts";
    			t545 = space();
    			div16 = element("div");
    			pre44 = element("pre");

    			pre44.textContent = `${`\<script>
  \import { Writable, writable } from "svelte/store";
  
  export class UserInfo {
    constructor (
      public name: Writable<string> = writable(''),
      public avatar: Writable<string> = writable(''),
      public isStart: Writable<boolean> = writable(false)
    ) // ---> burada süslüüüüüü parantezler var
  }
  
  export const userInfo = new UserInfo();
</script>`}`;

    			t547 = space();
    			p94 = element("p");
    			t548 = text("Oluşturduğumuz UserInfo class'ını kullanıcının isim, avatar değerlerini set\nedeceğiz. Bu değerlere default olarak boş String atadım, farklı içerikle\ndoldurabilirsin. İki değerde bir hata yoksa ");
    			em103 = element("em");
    			em103.textContent = "isStart";
    			t550 = text(" değerine ");
    			em104 = element("em");
    			em104.textContent = "true";
    			t552 = text(" olarak\ngüncelleyerek oyunu başlatacağız.");
    			t553 = space();
    			h212 = element("h2");
    			h212.textContent = "🪁 User Component";
    			t555 = space();
    			p95 = element("p");
    			t556 = text("Yarım kalmış bir User Component'imiz bulunuyordu.\nTanımladığımız ");
    			em105 = element("em");
    			em105.textContent = "Store";
    			t558 = text(" değerlerini User componenti değerlerinde kullanalım.\nBurada yapacağımız son rötüşlar ile birlikte kullanıcının oyun arayüzüne\nerişmesini sağlayalım.");
    			t559 = space();
    			p96 = element("p");
    			em106 = element("em");
    			em106.textContent = "ImageAvatar.svelte";
    			t561 = text(" componenti üzerinde, kullanıcı avatar'a click eventini\ngerçekleştirdiğinde, ");
    			code21 = element("code");
    			code21.textContent = "userInfo";
    			t563 = text(" classinda oluşturduğumuz avatar değerini\ngüncelleyelim.");
    			t564 = space();
    			p97 = element("p");
    			em107 = element("em");
    			em107.textContent = "componenets > User > Avatars > ImageAvatar.svelte";
    			t566 = space();
    			div17 = element("div");
    			pre45 = element("pre");

    			pre45.textContent = `${`\<script>
  \import { userInfo } from "../../../Store/User";

const { avatar } = userInfo;

export let userAvatar;

const setAvatar = () => {
console.log("focus on avatar => ", userAvatar);

$avatar = userAvatar;

console.log($avatar);
};
</script>`}`;

    			t568 = space();
    			pre46 = element("pre");

    			pre46.textContent = `${`\
<img
  src={userAvatar}
  class="avatar unpicked"
  alt="avatar"
  on:click={setAvatar}
/>
`}`;

    			t570 = space();
    			p98 = element("p");
    			code22 = element("code");
    			code22.textContent = "on:click";
    			t572 = text(" metoduna bağladığımız fonksiyon ile kullanıcının tıkladığı avatar\nüzerinde bilgiyi kolay bir şekilde elde edebiliyoruz. Konsolu açarak, logları\ninceleyebilirsin.");
    			code23 = element("code");
    			code23.textContent = "ImageAvatar";
    			t574 = text(" componentine parametre olarak gönderdiğimiz\navatar bilgisine erişebiliyoruz, bunu kullanarak fonksiyonu biraz daha basit\nhale getirelim.");
    			t575 = space();
    			p99 = element("p");
    			em108 = element("em");
    			em108.textContent = "componenets > User > Avatars > ImageAvatar.svelte";
    			t577 = space();
    			div18 = element("div");
    			pre47 = element("pre");

    			pre47.textContent = `${`\<script>
  \import { userInfo } from "../../../Store/User";
  
  const { avatar } = userInfo;
  
  export let userAvatar;
  
  const avatarName = userAvatar.match(/\w*(?=.\w+$)/)[0];
</script>`}`;

    			t579 = space();
    			pre48 = element("pre");

    			pre48.textContent = `${`\
<img
  src={userAvatar}
  class="avatar unpicked"
  alt="avatar"
  on:click={() => ($avatar = avatarName)}
/>
`}`;

    			t581 = space();
    			p100 = element("p");
    			t582 = text("Kullanıcı avatarlar üzerine her click işlemi gerçekleştirdiğinde, ");
    			code24 = element("code");
    			code24.textContent = "$avatar";
    			t584 = text("\ndeğerini güncelliyoruz. ");
    			code25 = element("code");
    			code25.textContent = "ImageAvatar.svelte";
    			t586 = text(" componentini geçmeden önce\n");
    			em109 = element("em");
    			em109.textContent = "class directives";
    			t588 = text(" kullanarak yıllaar yılllaarr önce tanımladığımız ");
    			code26 = element("code");
    			code26.textContent = ".picked";
    			t590 = text(" ve\n");
    			code27 = element("code");
    			code27.textContent = ".unpicked";
    			t592 = text(" classlarını anlamlı bir hale getirelim.");
    			t593 = space();
    			div19 = element("div");
    			pre49 = element("pre");

    			pre49.textContent = `${`\
<img
  src={userAvatar}
  class="avatar unpicked"
  alt="avatar"
  class:picked={avatarName === $avatar}
  on:click={() => ($avatar = avatarName)}
/>
`}`;

    			t595 = space();
    			p101 = element("p");
    			t596 = text("Bu güncelleme ile birlikte kullanıcının her avatar seçiminden sonra, seçilen\navatarın ");
    			code28 = element("code");
    			code28.textContent = "opacity";
    			t598 = text(" değeri güncellenerek kullanıcının seçimi vurgulanacak.");
    			t599 = space();
    			p102 = element("p");
    			img15 = element("img");
    			t600 = space();
    			p103 = element("p");
    			p103.textContent = "Kullanıcıdan almamız gereken diğer bir değer, username.";
    			t602 = space();
    			p104 = element("p");
    			em110 = element("em");
    			em110.textContent = "componenets > User > Avatars > ImageAvatar.svelte";
    			t604 = space();
    			div20 = element("div");
    			pre50 = element("pre");

    			pre50.textContent = `${`\<script>
  \import { userInfo } from "../../../Store/User";

const { name } = userInfo;
</script>`}`;

    			t606 = space();
    			pre51 = element("pre");

    			pre51.textContent = `${`\
<div class="user">
  <input
    type="text"
    class="name"
    name="name"
    placeholder="pika pika"
    bind:value={$name}
  />
</div>
`}`;

    			t608 = space();
    			p105 = element("p");
    			t609 = text("Import ettiğimiz UserInfo class'inda yer alan $name store değerini, ");
    			code29 = element("code");
    			code29.textContent = "bind:value";
    			t611 = text("\nmetodu ile güncelleyebiliriz.");
    			t612 = space();
    			p106 = element("p");
    			p106.textContent = "Şimdi en güzel tarafına gelelim.. Son rötüşları yapıp oyunumuza başlayalım.";
    			t614 = space();
    			p107 = element("p");
    			t615 = text("ilk olarak ");
    			code30 = element("code");
    			code30.textContent = "components > Playground > Wrapper > Playground.svelte";
    			t617 = text(" componenti\nüzerinde bir if/else yapısı tanımlayalım. ");
    			code31 = element("code");
    			code31.textContent = "isStart";
    			t619 = text(" store değerimiz false ise\nkullanıcıyı ");
    			em111 = element("em");
    			em111.textContent = "name&avatar";
    			t621 = text(" seçimi yapabildiği Componente yönlendirsin. Bunun aksi\nise basit bir head etiketini gösterelim.");
    			t622 = space();
    			p108 = element("p");
    			em112 = element("em");
    			em112.textContent = "componenets > Playground > Wrapper > Playground.svelte";
    			t624 = space();
    			div21 = element("div");
    			pre52 = element("pre");

    			pre52.textContent = `${`\<script>
  \import UserGround from "../../User/UserGround.svelte";
  \import { userInfo } from "../../../Store/User";
  
  const { isStart } = userInfo;
</script>`}`;

    			t626 = space();
    			pre53 = element("pre");

    			pre53.textContent = `${`\
<main class="playground">
  #if $isStart
    <h3>Start Game....</h3>
  else
    <UserGround />
  /if
</main>
`}`;

    			t628 = space();
    			p109 = element("p");
    			t629 = text("Döngüler gibi if/else Logic'leri kullanabilirsiniz. ");
    			code32 = element("code");
    			code32.textContent = "else if";
    			t631 = text(" ihtiyacında\nbir condition ");
    			code33 = element("code");
    			code33.textContent = "else if isStart === undefined";
    			t633 = text(" tanımlaman yeterli olacaktır.");
    			t634 = space();
    			p110 = element("p");
    			em113 = element("em");
    			em113.textContent = "componenets > Playground > Wrapper > Playground.svelte";
    			t636 = space();
    			div22 = element("div");
    			pre54 = element("pre");

    			pre54.textContent = `${`\<script>
  \import { userInfo } from "../../Store/User";

const { name, avatar, isStart } = userInfo;

const startGame = () => {
if ($avatar === "") {
return;
}

    if ($name === "") {
      return;
    }

    $isStart = true;

    console.log("::::: start game :::::");
    console.log(":: enjoy {$name} ::");

};
</script>`}`;

    			t638 = space();
    			pre55 = element("pre");

    			pre55.textContent = `${`\
<div class="start">
  <button on:click={startGame}>Start</button>
</div>
`}`;

    			t640 = space();
    			p111 = element("p");
    			img16 = element("img");
    			t641 = space();
    			p112 = element("p");
    			t642 = text("StartGame fonksiyonu ile birlikte ");
    			em114 = element("em");
    			em114.textContent = "name";
    			t644 = text(" ve ");
    			em115 = element("em");
    			em115.textContent = "avatar";
    			t646 = text(" store değerleri kontrol\nedilecek. Bu değerlerin boş olmaması durumunda ");
    			em116 = element("em");
    			em116.textContent = "isStart";
    			t648 = text(" store değerine true\natanarak, oyun başlatılacak konsola bir bilgi yazılacak. Bu değerlerden\nherhangi biri bulunmuyorsa ");
    			em117 = element("em");
    			em117.textContent = "User";
    			t650 = text(" componenti bulunduğu yerde kalmaya devam\nedicektir. Böyle bir ihtimal için, class directives kullanarak kullanıcıyı\nbilgilendirelim.");
    			t651 = space();
    			div23 = element("div");
    			pre56 = element("pre");

    			pre56.textContent = `${`\<script>
  \import { userInfo } from "../../Store/User";

const { name, avatar, isStart } = userInfo;

let isAvatarEmpty = false;
let isNameEmpty = false;

const startGame = () => {
if ($avatar === "") {
isAvatarEmpty = true;
return;
}

    if ($name === "") {
      return;
    }

    $isStart = true;

    console.log("::::: start game :::::");
    console.log(":: enjoy {$name} ::");

};
</script>`}`;

    			t653 = space();
    			pre57 = element("pre");

    			pre57.textContent = `${`\
<div class="start">
  <button on:click={startGame}>Start</button>
   <div class="avatarError visible">
    <span class="unvisible" class:visible={$avatar === "" && isAvatarEmpty}>
      please, select a avatar..
    </span>
  </div>
</div>
`}`;

    			t655 = space();
    			pre58 = element("pre");

    			pre58.textContent = `${`\<style>
   .name {
    width: 40%;
    border-radius: 20px;
    text-align: center;
    margin-bottom: 30px;
    padding: 8px 0;
  }

.avatarError {
color: red;
font-size: 18px;
}

.unvisible {
display: none;
}

.visible {
display: block;
}

.start button:active {
border: 2px solid white;
}
</style>`}`;

    			t657 = space();
    			p113 = element("p");
    			t658 = text("Class Directive'lerde yardımına başvurabilmek için ");
    			em118 = element("em");
    			em118.textContent = "isAvatarEmpty";
    			t660 = text(" ve\n");
    			em119 = element("em");
    			em119.textContent = "isNameEmpty";
    			t662 = text(" isminde iki farklı değer oluşturdum. Button'ın altında bir ");
    			code34 = element("code");
    			code34.textContent = "div";
    			t664 = text("\netiketi daha oluşturarak, hata mesajını burada gösteriyorum. Name için olan\nhata mesajını sen düzenle.. Ve oluşturduğum ");
    			code35 = element("code");
    			code35.textContent = "div";
    			t666 = text(" etiketini bir component olarak\nyeniden oluşturup, hem name hemde avatar için kullanabilirsin. Bunu yap, hemen\nardından bir sonraki başlıkta seni bekliyorum.");
    			t667 = space();
    			h38 = element("h3");
    			h38.textContent = "🎈 Oyun Arayüzü";
    			t669 = space();
    			p114 = element("p");
    			p114.textContent = "Oyun içerisinde kartların kullanılabilmesi için bir Component'a ihtiyacımız\nbulunuyor. Bu component'i oluşturarak, oyun alanında istediğimiz sayıda kart\noluşturacağız.";
    			t671 = space();
    			h39 = element("h3");
    			h39.textContent = "🎈 Card Component";
    			t673 = space();
    			p115 = element("p");
    			p115.textContent = "Oyun alanında kullanacağımız kartlar için componentlere ihtiyacımız olacak.";
    			t675 = space();
    			p116 = element("p");
    			code36 = element("code");
    			code36.textContent = "+ /Components/Playground/Cards/Card.svelte, CardBack.svelte, CardFront.svelte";
    			t677 = space();
    			p117 = element("p");
    			code37 = element("code");
    			code37.textContent = "CardFront";
    			t679 = text(" componentinde kartın pokemon resmini tutarken, ");
    			code38 = element("code");
    			code38.textContent = "CardBack";
    			t681 = text("\ncomponentinde ");
    			code39 = element("code");
    			code39.textContent = "?";
    			t683 = text(" resmini tutacağız. Componentleri ");
    			code40 = element("code");
    			code40.textContent = "Card";
    			t685 = text(" componentinde\nçağıracağız.");
    			t686 = space();
    			p118 = element("p");
    			code41 = element("code");
    			code41.textContent = "Card";
    			t688 = text(" componentini test ederken, sürekli olarak ");
    			code42 = element("code");
    			code42.textContent = "User";
    			t690 = text(" componenti üzerinde isim\nve avatar seçimi yapmamak için ");
    			code43 = element("code");
    			code43.textContent = "Playground";
    			t692 = text(" componentinde yer alan ");
    			em120 = element("em");
    			em120.textContent = "isStart";
    			t694 = text("\nşartını true ifadesine çevirelim.");
    			t695 = space();
    			p119 = element("p");
    			em121 = element("em");
    			em121.textContent = "componenets > Playground > Cards > CardFront.svelte";
    			t697 = space();
    			div24 = element("div");
    			pre59 = element("pre");
    			pre59.textContent = `${`\<script></script>`}`;
    			t699 = space();
    			pre60 = element("pre");

    			pre60.textContent = `${`\
<div class="front">
  <img
    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    alt="card on the playing field"
    class="single-poke"
  />
</div>
`}`;

    			t701 = space();
    			pre61 = element("pre");

    			pre61.textContent = `${`\<style>
  .front {
    width: 100px;
    height: 100px;
    top: 0;
    left: 0;
  }

.single-poke {
border-radius: 11px;
background-color: #fff;
box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
}
</style>`}`;

    			t703 = space();
    			p120 = element("p");
    			code44 = element("code");
    			code44.textContent = "CardFront";
    			t705 = text(" componentinde ");
    			code45 = element("code");
    			code45.textContent = "img src";
    			t707 = text(" özelliği olarak bir API adresi verilmiş.\nBu API'da dosya isimlerinde yer alan numaraları güncelleyerek, farklı pokemon\nresimlerine erişilebilir.");
    			t708 = space();
    			p121 = element("p");
    			code46 = element("code");
    			code46.textContent = "CardFront";
    			t710 = text(" componentini öncelikle ");
    			code47 = element("code");
    			code47.textContent = "Card";
    			t712 = text(" componentinde, ");
    			code48 = element("code");
    			code48.textContent = "Card";
    			t714 = text(" componentini de\n");
    			code49 = element("code");
    			code49.textContent = "Playground";
    			t716 = text(" içerisinde true dönen blokta çağıralım. Aynı işlemi ");
    			code50 = element("code");
    			code50.textContent = "CardBack";
    			t718 = text("\ncomponentinde tekrarlayarak Card componentleri üzerinde yaptığımız her\ngüncellemeyi inceleyebileceğiz.");
    			t719 = space();
    			p122 = element("p");
    			em122 = element("em");
    			em122.textContent = "componenets > Playground > Cards > CardBack.svelte";
    			t721 = space();
    			div25 = element("div");
    			pre62 = element("pre");
    			pre62.textContent = `${`\<script></script>`}`;
    			t723 = space();
    			pre63 = element("pre");

    			pre63.textContent = `${`\
<div class="back">
  <img
    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    class="single-poke"
    alt="card back on the playing field"
  />
</div>
`}`;

    			t725 = space();
    			pre64 = element("pre");

    			pre64.textContent = `${`\<style>
  .back {
    width: 100px;
    height: 100px;
    top: 0;
    left: 0;
    border-radius: 11px;
  }

.back:hover {
cursor: pointer;
}

.single-poke {
border-radius: 11px;
background: #fff;
box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
}
</style>`}`;

    			t727 = space();
    			p123 = element("p");
    			code51 = element("code");
    			code51.textContent = "img";
    			t729 = text(" kapsayıcısı olan ");
    			code52 = element("code");
    			code52.textContent = "back ve front";
    			t731 = text(" classlarına sahip kapsayıcılara\nbelirli özellikler katarak basit şekilde bir kart görünümü vermeye çaba\nsarfettik. ");
    			code53 = element("code");
    			code53.textContent = "CardBack";
    			t733 = text(" componentinde ");
    			code54 = element("code");
    			code54.textContent = "Card";
    			t735 = text(" componentinde çağırarak arayüz\nüzerinde nasıl göründüğünü inceleyelim.");
    			t736 = space();
    			p124 = element("p");
    			img17 = element("img");
    			t737 = space();
    			p125 = element("p");
    			code55 = element("code");
    			code55.textContent = "Card";
    			t739 = text(" componentleri birer block-element olduğu için alt alta durmaktadır.\nComponentleri bir kapsayıcı içerisine alarak, inline-block seviyesine alalım.\nAynı Component içerisinde çağırdığımızdan dolayı, ");
    			code56 = element("code");
    			code56.textContent = "position: absolute";
    			t741 = text(" stilini\nverdiğimizde ");
    			code57 = element("code");
    			code57.textContent = "Card";
    			t743 = text(" Componentinde yer alan ");
    			code58 = element("code");
    			code58.textContent = "child componentler";
    			t745 = text(" üst üste\nduracaktır.");
    			t746 = space();
    			p126 = element("p");
    			em123 = element("em");
    			em123.textContent = "componenets > Playground > Cards > CardBack.svelte";
    			t748 = space();
    			div26 = element("div");
    			pre65 = element("pre");

    			pre65.textContent = `${`\<script>
  \import FrontCardFace from "./CardFront.svelte";
  \import BackCardFace from "./CardBack.svelte";
</script>`}`;

    			t750 = space();
    			pre66 = element("pre");

    			pre66.textContent = `${`\
<main class="flip-container">
  <div class="flipper">
    <FrontCardFace />
    <BackCardFace />
  </div>
</main>
`}`;

    			t752 = space();
    			pre67 = element("pre");

    			pre67.textContent = `${`\<style>
   .flip-container {
    display: inline-block;
    margin: 5px;
    width: 100px;
    height: 100px;
  }
  
  .flipper {
    position: relative;
  }
</style>`}`;

    			t754 = space();
    			p127 = element("p");
    			code59 = element("code");
    			code59.textContent = "CardBack";
    			t756 = text(" Componentinin kapsayıcı class'ına ");
    			em124 = element("em");
    			em124.textContent = ".back";
    			t758 = text(", ");
    			code60 = element("code");
    			code60.textContent = "position: absolute";
    			t760 = text("\ndeğerini verdiğimizde her iki kart üst üste görüntülenecektir.");
    			t761 = space();
    			p128 = element("p");
    			img18 = element("img");
    			t762 = space();
    			p129 = element("p");
    			t763 = text("CSS kullanarak Card'ın arka yüzülen her tıklama ile birlikte ");
    			code61 = element("code");
    			code61.textContent = "transform";
    			t765 = text("\nözelliğini kullanarak ");
    			code62 = element("code");
    			code62.textContent = "CardBack";
    			t767 = text(" Componentinin altında yer alan ");
    			code63 = element("code");
    			code63.textContent = "CardFront";
    			t769 = text("\niçerisinde yer alan kartın görüntülenmesini sağlayacağız. ");
    			code64 = element("code");
    			code64.textContent = "Global.css";
    			t771 = text("\ndosyamıza aşağıdaki özellikleri ekleyelim.");
    			t772 = space();
    			p130 = element("p");
    			em125 = element("em");
    			em125.textContent = "public > global.css";
    			t774 = space();
    			div27 = element("div");
    			pre68 = element("pre");

    			pre68.textContent = `${`\<style>
  .flipper.hover .front {
    transform: rotateY(0deg);
  }

.flipper.hover .back {
transform: rotateY(180deg);
}
</style>`}`;

    			t776 = space();
    			p131 = element("p");
    			code65 = element("code");
    			code65.textContent = "Card";
    			t778 = text(" componentlerinde ");
    			code66 = element("code");
    			code66.textContent = "transform";
    			t780 = text(" stillendirmesi sağlayarak, ");
    			code67 = element("code");
    			code67.textContent = "hover";
    			t782 = text(" class'i\neklendiğinde dönme efekti vermesini sağlayalım.");
    			t783 = space();
    			p132 = element("p");
    			em126 = element("em");
    			em126.textContent = "componenets > Playground > Cards > CardBack.svelte";
    			t785 = space();
    			div28 = element("div");
    			pre69 = element("pre");

    			pre69.textContent = `${`\<script>
  \import FrontCardFace from "./CardFront.svelte";
  \import BackCardFace from "./CardBack.svelte";
</script>`}`;

    			t787 = space();
    			pre70 = element("pre");

    			pre70.textContent = `${`\
<main class="flip-container">
  <div class="flipper">
  </div>
</main>
`}`;

    			t789 = space();
    			pre71 = element("pre");

    			pre71.textContent = `${`\<style>
  .back {
    width: 100px;
    height: 100px;
    backface-visibility: hidden;
    transition: 0.6s;
    transform-style: preserve-3d;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    transform: rotateY(0deg);
    border-radius: 11px;
  }

.back:hover {
cursor: pointer;
}

.single-poke {
border-radius: 11px;
background: #fff;
box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
}
</style>`}`;

    			t791 = space();
    			p133 = element("p");
    			code68 = element("code");
    			code68.textContent = "Card";
    			t793 = text(" componentlerinin bir bütün gibi birlikte aynı hızda, ve aynı perspektif\nüzerinden dönüş sağlaması gerekiyor. Svelte'de her component içerisinde\ntanımlanan ");
    			em127 = element("em");
    			em127.textContent = "style";
    			t795 = text(" özellikleri, Component'e ait scope kadardır, diğer\ncomponentler bu stillendirmelerden etkilenmezler. Bundan dolayı her iki class\niçin aynı tanımlamaları gerçekleştirelim.");
    			t796 = space();
    			p134 = element("p");
    			em128 = element("em");
    			em128.textContent = "componenets > Playground > Cards > CardFront.svelte";
    			t798 = space();
    			div29 = element("div");
    			pre72 = element("pre");

    			pre72.textContent = `${`\<script>"
</script>`}`;

    			t800 = space();
    			pre73 = element("pre");

    			pre73.textContent = `${`\
<div class="front">
  <img
    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    alt="card on the playing field"
    class="single-poke"
  />
</div>
`}`;

    			t802 = space();
    			pre74 = element("pre");

    			pre74.textContent = `${`\<style>
  .front {
    width: 100px;
    height: 100px;
    backface-visibility: hidden;
    transition: 0.6s;
    transform-style: preserve-3d;
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateY(-180deg);
  }

.single-poke {
border-radius: 11px;
background-color: #fff;
box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
}
</style>`}`;

    			t804 = space();
    			p135 = element("p");
    			t805 = text("Birazdan geçeceğimiz bölüm içerisinde, kartları EventDispatcher kullanarak\nkartın açılma efektini yapacağız. Eventi kullanmadan önce CSS üzerinde nasıl\ngüncellemeler yapmamız gerektiğini göstermek istedim. Konsol üzerinde\n");
    			code69 = element("code");
    			code69.textContent = "CardBack";
    			t807 = text(" componentine ait ");
    			code70 = element("code");
    			code70.textContent = "flipper";
    			t809 = text(" bulunan element ");
    			code71 = element("code");
    			code71.textContent = "hover";
    			t811 = text(" class eklediğinde\nefekt gerçekleştiğini inceleyebilirsin.");
    			t812 = space();
    			p136 = element("p");
    			img19 = element("img");
    			t813 = space();
    			p137 = element("p");
    			img20 = element("img");
    			t814 = space();
    			span8 = element("span");
    			t815 = space();
    			span9 = element("span");
    			t816 = space();
    			h213 = element("h2");
    			h213.textContent = "GitHub Pages ile Deploy";
    			t818 = space();
    			h214 = element("h2");
    			h214.textContent = "Kaynak";
    			t820 = space();
    			ul10 = element("ul");
    			li22 = element("li");
    			p138 = element("p");
    			p138.textContent = "Svelte nedir?";
    			t822 = space();
    			li23 = element("li");
    			p139 = element("p");
    			a7 = element("a");
    			a7.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t824 = space();
    			li24 = element("li");
    			p140 = element("p");
    			p140.textContent = "Svelte Documentation:";
    			t826 = space();
    			li25 = element("li");
    			p141 = element("p");
    			a8 = element("a");
    			a8.textContent = "https://svelte.dev/examples/hello-world";
    			t828 = space();
    			li26 = element("li");
    			p142 = element("p");
    			a9 = element("a");
    			a9.textContent = "https://svelte.dev/tutorial/basics";
    			t830 = space();
    			li27 = element("li");
    			p143 = element("p");
    			a10 = element("a");
    			a10.textContent = "https://svelte.dev/docs";
    			t832 = space();
    			li28 = element("li");
    			p144 = element("p");
    			a11 = element("a");
    			a11.textContent = "https://svelte.dev/blog";
    			t834 = space();
    			li29 = element("li");
    			p145 = element("p");
    			a12 = element("a");
    			a12.textContent = "https://svelte.dev/blog/svelte-3-rethinking-reactivity";
    			t836 = space();
    			ul11 = element("ul");
    			li30 = element("li");
    			li30.textContent = "Svelte Projesi Oluşturma";
    			t838 = space();
    			ul12 = element("ul");
    			li31 = element("li");
    			p146 = element("p");
    			a13 = element("a");
    			a13.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript";
    			t840 = space();
    			li32 = element("li");
    			p147 = element("p");
    			p147.textContent = "Bağımlılıklar";
    			t842 = space();
    			li33 = element("li");
    			p148 = element("p");
    			a14 = element("a");
    			a14.textContent = "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/";
    			t844 = space();
    			ul13 = element("ul");
    			li34 = element("li");
    			li34.textContent = "Deploy:";
    			t846 = space();
    			ul14 = element("ul");
    			li35 = element("li");
    			a15 = element("a");
    			a15.textContent = "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next";
    			t848 = space();
    			ul15 = element("ul");
    			li36 = element("li");
    			li36.textContent = "md files importing";
    			t850 = space();
    			ul16 = element("ul");
    			li37 = element("li");
    			a16 = element("a");
    			a16.textContent = "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project";
    			t852 = space();
    			ul17 = element("ul");
    			li38 = element("li");
    			li38.textContent = "Component Communications";
    			t854 = space();
    			ul18 = element("ul");
    			li39 = element("li");
    			a17 = element("a");
    			a17.textContent = "https://betterprogramming.pub/6-ways-to-do-component-communications-in-svelte-b3f2a483913c";
    			t856 = space();
    			li40 = element("li");
    			a18 = element("a");
    			a18.textContent = "https://livebook.manning.com/book/svelte-and-sapper-in-action/chapter-5/v-3/";
    			t858 = space();
    			pre75 = element("pre");
    			code72 = element("code");
    			code72.textContent = "\n";
    			t860 = space();
    			p149 = element("p");
    			p149.textContent = ":check en file:";
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
    			if (!src_url_equal(img0.src, img0_src_value = "https://raw.githubusercontent.com/kahilkubilay/remember-em-all/master/public/assets/squirtle-squad.webp")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Svelte definition variable");
    			set_style(img0, "width", "900px");
    			add_location(img0, file$4, 13, 18, 864);
    			attr_dev(p1, "align", "center");
    			add_location(p1, file$4, 13, 0, 846);
    			attr_dev(a2, "href", "#start-game");
    			attr_dev(a2, "title", "Access Start Game section");
    			add_location(a2, file$4, 18, 0, 1245);
    			add_location(p2, file$4, 15, 0, 1043);
    			attr_dev(span1, "id", "proje-hakkinda");
    			add_location(span1, file$4, 20, 0, 1350);
    			add_location(h21, file$4, 21, 0, 1384);
    			add_location(p3, file$4, 22, 0, 1410);
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/playground.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "view of cards on the playground");
    			attr_dev(img1, "title", "view of cards on the playground");
    			set_style(img1, "width", "900px");
    			add_location(img1, file$4, 29, 18, 1962);
    			attr_dev(p4, "align", "center");
    			add_location(p4, file$4, 29, 0, 1944);
    			add_location(em1, file$4, 34, 37, 2382);
    			add_location(em2, file$4, 36, 12, 2516);
    			add_location(p5, file$4, 31, 0, 2107);
    			attr_dev(span2, "id", "svelte-nedir");
    			add_location(span2, file$4, 38, 0, 2617);
    			add_location(h22, file$4, 39, 0, 2649);
    			add_location(em3, file$4, 46, 32, 3161);
    			add_location(p6, file$4, 40, 0, 2675);
    			attr_dev(a3, "href", "https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks");
    			attr_dev(a3, "title", "Stack Overflow Developer Survey 2021");
    			add_location(a3, file$4, 50, 3, 3458);
    			add_location(p7, file$4, 50, 0, 3455);
    			add_location(h23, file$4, 52, 0, 3762);
    			add_location(p8, file$4, 53, 0, 3789);
    			add_location(code0, file$4, 57, 4, 3967);
    			add_location(li0, file$4, 58, 0, 3997);
    			add_location(ul0, file$4, 57, 29, 3992);
    			add_location(li1, file$4, 57, 0, 3963);
    			add_location(code1, file$4, 61, 4, 4050);
    			add_location(em4, file$4, 62, 4, 4085);
    			add_location(li2, file$4, 62, 0, 4081);
    			add_location(ul1, file$4, 61, 30, 4076);
    			add_location(li3, file$4, 61, 0, 4046);
    			add_location(code2, file$4, 65, 4, 4148);
    			add_location(em5, file$4, 66, 4, 4177);
    			add_location(li4, file$4, 66, 0, 4173);
    			add_location(ul2, file$4, 65, 24, 4168);
    			add_location(li5, file$4, 65, 0, 4144);
    			add_location(code3, file$4, 69, 4, 4235);
    			add_location(em6, file$4, 70, 4, 4303);
    			add_location(li6, file$4, 70, 0, 4299);
    			add_location(ul3, file$4, 69, 63, 4294);
    			add_location(li7, file$4, 69, 0, 4231);
    			add_location(code4, file$4, 73, 4, 4399);
    			add_location(em7, file$4, 74, 4, 4446);
    			add_location(em8, file$4, 74, 37, 4479);
    			add_location(li8, file$4, 74, 0, 4442);
    			add_location(ul4, file$4, 73, 42, 4437);
    			add_location(li9, file$4, 73, 0, 4395);
    			add_location(code5, file$4, 77, 4, 4544);
    			add_location(em9, file$4, 78, 4, 4624);
    			add_location(em10, file$4, 78, 63, 4683);
    			add_location(em11, file$4, 78, 82, 4702);
    			add_location(li10, file$4, 78, 0, 4620);
    			add_location(ul5, file$4, 77, 75, 4615);
    			add_location(li11, file$4, 77, 0, 4540);
    			add_location(ul6, file$4, 56, 0, 3958);
    			attr_dev(span3, "id", "create-a-svelte-project");
    			add_location(span3, file$4, 83, 0, 4768);
    			add_location(h24, file$4, 84, 0, 4811);
    			add_location(p9, file$4, 85, 0, 4848);
    			html_tag.a = t76;
    			add_location(p10, file$4, 87, 0, 4909);
    			html_tag_1.a = t79;
    			add_location(p11, file$4, 90, 0, 5073);
    			html_tag_2.a = t82;
    			add_location(p12, file$4, 92, 0, 5170);
    			if (!src_url_equal(img2.src, img2_src_value = "./assets/console-logs.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Port where Svelte is running on the console");
    			attr_dev(img2, "title", "Port where Svelte is running on the console");
    			add_location(img2, file$4, 96, 18, 5481);
    			attr_dev(p13, "align", "center");
    			add_location(p13, file$4, 96, 0, 5463);
    			attr_dev(span4, "id", "svelte-nasil-calisir");
    			add_location(span4, file$4, 99, 0, 5635);
    			add_location(h25, file$4, 100, 0, 5675);
    			add_location(em12, file$4, 101, 22, 5731);
    			add_location(em13, file$4, 102, 7, 5808);
    			add_location(p14, file$4, 101, 0, 5709);
    			add_location(em14, file$4, 104, 60, 5964);
    			add_location(p15, file$4, 104, 0, 5904);
    			if (!src_url_equal(img3.src, img3_src_value = "./assets/build-map.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Svelte Build map");
    			set_style(img3, "width", "800px");
    			add_location(img3, file$4, 108, 18, 6163);
    			attr_dev(p16, "align", "center");
    			add_location(p16, file$4, 108, 0, 6145);
    			attr_dev(span5, "id", "bagimliliklar");
    			add_location(span5, file$4, 109, 0, 6247);
    			add_location(h26, file$4, 110, 0, 6280);
    			add_location(h40, file$4, 112, 4, 6322);
    			add_location(em15, file$4, 115, 9, 6498);
    			add_location(em16, file$4, 115, 71, 6560);
    			add_location(li12, file$4, 112, 0, 6318);
    			add_location(h41, file$4, 117, 4, 6608);
    			add_location(li13, file$4, 117, 0, 6604);
    			add_location(ul7, file$4, 111, 0, 6313);
    			attr_dev(span6, "id", "svelte-projesini-inceleme");
    			add_location(span6, file$4, 123, 0, 6932);
    			add_location(h27, file$4, 124, 0, 6977);
    			add_location(em17, file$4, 125, 14, 7028);
    			add_location(em18, file$4, 126, 18, 7110);
    			add_location(em19, file$4, 126, 51, 7143);
    			add_location(em20, file$4, 126, 68, 7160);
    			add_location(em21, file$4, 126, 95, 7187);
    			add_location(em22, file$4, 127, 21, 7222);
    			add_location(p17, file$4, 125, 0, 7014);
    			add_location(em23, file$4, 128, 6, 7266);
    			add_location(em24, file$4, 128, 33, 7293);
    			add_location(em25, file$4, 129, 5, 7358);
    			add_location(em26, file$4, 129, 73, 7426);
    			add_location(em27, file$4, 130, 13, 7455);
    			add_location(em28, file$4, 130, 38, 7480);
    			add_location(p18, file$4, 128, 0, 7260);
    			add_location(em29, file$4, 131, 6, 7537);
    			add_location(em30, file$4, 131, 31, 7562);
    			add_location(em31, file$4, 132, 26, 7649);
    			add_location(em32, file$4, 133, 21, 7720);
    			add_location(p19, file$4, 131, 0, 7531);
    			add_location(em33, file$4, 136, 6, 7885);
    			add_location(em34, file$4, 137, 8, 7972);
    			add_location(code6, file$4, 139, 0, 8100);
    			add_location(p20, file$4, 136, 0, 7879);
    			add_location(code7, file$4, 140, 52, 8217);
    			add_location(em35, file$4, 141, 27, 8281);
    			add_location(p21, file$4, 140, 0, 8165);
    			add_location(h28, file$4, 143, 0, 8397);
    			add_location(p22, file$4, 144, 0, 8422);
    			add_location(em36, file$4, 146, 3, 8584);
    			add_location(em37, file$4, 146, 34, 8615);
    			add_location(em38, file$4, 147, 46, 8720);
    			attr_dev(a4, "href", "https://youtube.com/shorts/oyIO1_8uNPc");
    			attr_dev(a4, "title", "senin kocaman kalbin <33");
    			add_location(a4, file$4, 150, 43, 8955);
    			add_location(p23, file$4, 146, 0, 8581);
    			add_location(h30, file$4, 152, 0, 9076);
    			add_location(p24, file$4, 153, 0, 9105);
    			add_location(em39, file$4, 156, 3, 9313);
    			add_location(p25, file$4, 156, 0, 9310);
    			attr_dev(pre0, "class", "prettyprint lang-js");
    			add_location(pre0, file$4, 157, 35, 9372);
    			attr_dev(pre1, "class", "prettyprint lang-html");
    			add_location(pre1, file$4, 158, 0, 9444);
    			attr_dev(pre2, "class", "prettyprint lang-css");
    			add_location(pre2, file$4, 160, 0, 9526);
    			attr_dev(div0, "class", "code-wrapper");
    			attr_dev(div0, "style", "");
    			add_location(div0, file$4, 157, 0, 9337);
    			add_location(em40, file$4, 166, 29, 9665);
    			add_location(em41, file$4, 167, 0, 9725);
    			add_location(em42, file$4, 168, 0, 9803);
    			add_location(em43, file$4, 168, 26, 9829);
    			add_location(p26, file$4, 166, 0, 9636);
    			add_location(em44, file$4, 170, 3, 9975);
    			add_location(p27, file$4, 170, 0, 9972);
    			attr_dev(pre3, "class", "prettyprint lang-js");
    			add_location(pre3, file$4, 171, 26, 10025);
    			attr_dev(pre4, "class", "prettyprint lang-html");
    			add_location(pre4, file$4, 174, 0, 10109);
    			attr_dev(pre5, "class", "prettyprint lang-css");
    			add_location(pre5, file$4, 177, 0, 10239);
    			attr_dev(div1, "class", "code-wrapper");
    			add_location(div1, file$4, 171, 0, 9999);
    			add_location(em45, file$4, 179, 3, 10310);
    			add_location(p28, file$4, 179, 0, 10307);
    			add_location(h31, file$4, 182, 0, 10527);
    			add_location(p29, file$4, 183, 0, 10559);
    			add_location(em46, file$4, 185, 3, 10691);
    			add_location(p30, file$4, 185, 0, 10688);
    			attr_dev(pre6, "class", "prettyprint lang-js");
    			add_location(pre6, file$4, 186, 26, 10741);
    			attr_dev(pre7, "class", "prettyprint lang-html");
    			add_location(pre7, file$4, 193, 0, 10913);
    			attr_dev(pre8, "class", "prettyprint lang-css");
    			add_location(pre8, file$4, 200, 0, 11062);
    			attr_dev(div2, "class", "code-wrapper");
    			add_location(div2, file$4, 186, 0, 10715);
    			add_location(em47, file$4, 227, 18, 11544);
    			add_location(p31, file$4, 227, 0, 11526);
    			if (!src_url_equal(img4.src, img4_src_value = "./assets/gif/reactive.gif")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Svelte definition variable");
    			set_style(img4, "width", "800px");
    			add_location(img4, file$4, 229, 18, 11684);
    			attr_dev(p32, "align", "center");
    			add_location(p32, file$4, 229, 0, 11666);
    			add_location(h32, file$4, 231, 0, 11785);
    			add_location(p33, file$4, 232, 0, 11817);
    			if (!src_url_equal(img5.src, img5_src_value = "./assets/components/component-with-sabuha.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "use of components");
    			set_style(img5, "width", "900px");
    			add_location(img5, file$4, 235, 18, 12058);
    			attr_dev(p34, "align", "center");
    			add_location(p34, file$4, 235, 0, 12040);
    			add_location(code8, file$4, 238, 18, 12267);
    			add_location(code9, file$4, 238, 61, 12310);
    			add_location(code10, file$4, 239, 23, 12389);
    			add_location(p35, file$4, 237, 0, 12170);
    			add_location(em48, file$4, 240, 3, 12443);
    			add_location(p36, file$4, 240, 0, 12440);
    			attr_dev(pre9, "class", "prettyprint lang-js");
    			add_location(pre9, file$4, 241, 26, 12531);
    			attr_dev(pre10, "class", "prettyprint lang-html");
    			add_location(pre10, file$4, 248, 0, 12703);
    			attr_dev(pre11, "class", "prettyprint lang-css");
    			add_location(pre11, file$4, 255, 0, 12880);
    			attr_dev(div3, "class", "code-wrapper");
    			add_location(div3, file$4, 241, 0, 12505);
    			add_location(code11, file$4, 283, 3, 13371);
    			add_location(p37, file$4, 283, 0, 13368);
    			add_location(em49, file$4, 285, 3, 13471);
    			add_location(p38, file$4, 285, 0, 13468);
    			attr_dev(pre12, "class", "prettyprint lang-js");
    			add_location(pre12, file$4, 286, 26, 13521);
    			attr_dev(pre13, "class", "prettyprint lang-html");
    			add_location(pre13, file$4, 289, 0, 13673);
    			attr_dev(pre14, "class", "prettyprint lang-css");
    			add_location(pre14, file$4, 298, 0, 13823);
    			attr_dev(div4, "class", "code-wrapper");
    			add_location(div4, file$4, 286, 0, 13495);
    			if (!src_url_equal(img6.src, img6_src_value = "./assets/components/random-number-component.gif")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Random Number Component");
    			set_style(img6, "width", "900px");
    			add_location(img6, file$4, 301, 18, 13911);
    			attr_dev(p39, "align", "center");
    			add_location(p39, file$4, 301, 0, 13893);
    			add_location(h33, file$4, 303, 0, 14031);
    			if (!src_url_equal(img7.src, img7_src_value = "./assets/communication-is-key.jpg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "SpongeBob 'communication is key' meme");
    			set_style(img7, "width", "500px");
    			add_location(img7, file$4, 304, 18, 14089);
    			attr_dev(p40, "align", "center");
    			add_location(p40, file$4, 304, 0, 14071);
    			add_location(p41, file$4, 306, 0, 14209);
    			add_location(h42, file$4, 311, 0, 14563);
    			add_location(p42, file$4, 312, 0, 14583);
    			add_location(h43, file$4, 316, 0, 14878);
    			add_location(p43, file$4, 317, 0, 14898);
    			add_location(h44, file$4, 320, 0, 15083);
    			add_location(p44, file$4, 321, 0, 15105);
    			add_location(h45, file$4, 325, 0, 15363);
    			add_location(p45, file$4, 326, 0, 15392);
    			add_location(h46, file$4, 330, 0, 15672);
    			add_location(p46, file$4, 331, 0, 15692);
    			add_location(h29, file$4, 334, 0, 15883);
    			attr_dev(span7, "id", "start-game");
    			add_location(span7, file$4, 335, 0, 15912);
    			add_location(h210, file$4, 336, 0, 15942);
    			attr_dev(a5, "href", "#svelte-projesi-olusturma");
    			attr_dev(a5, "title", "Yeni bir Svelte Projesi oluştur");
    			add_location(a5, file$4, 341, 24, 16308);
    			add_location(em50, file$4, 343, 0, 16484);
    			add_location(em51, file$4, 343, 42, 16526);
    			add_location(p47, file$4, 337, 0, 15965);
    			if (!src_url_equal(img8.src, img8_src_value = "./assets/start-folder.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "Svelte Build map");
    			set_style(img8, "width", "900px");
    			add_location(img8, file$4, 345, 18, 16619);
    			attr_dev(p48, "align", "center");
    			add_location(p48, file$4, 345, 0, 16601);
    			add_location(h34, file$4, 347, 0, 16711);
    			add_location(em52, file$4, 348, 3, 16741);
    			add_location(em53, file$4, 348, 72, 16810);
    			add_location(em54, file$4, 349, 0, 16829);
    			add_location(em55, file$4, 349, 54, 16883);
    			add_location(em56, file$4, 351, 0, 16984);
    			add_location(p49, file$4, 348, 0, 16738);
    			add_location(em57, file$4, 353, 3, 17104);
    			add_location(em58, file$4, 355, 0, 17250);
    			add_location(em59, file$4, 355, 28, 17278);
    			add_location(p50, file$4, 353, 0, 17101);
    			add_location(em60, file$4, 358, 28, 17464);
    			add_location(p51, file$4, 357, 0, 17354);
    			add_location(em61, file$4, 360, 3, 17549);
    			add_location(p52, file$4, 360, 0, 17546);
    			attr_dev(pre15, "class", "prettyprint lang-js");
    			add_location(pre15, file$4, 361, 26, 17616);
    			attr_dev(pre16, "class", "prettyprint lang-html");
    			add_location(pre16, file$4, 364, 0, 17715);
    			attr_dev(pre17, "class", "prettyprint lang-css");
    			add_location(pre17, file$4, 370, 0, 17825);
    			attr_dev(div5, "class", "code-wrapper");
    			add_location(div5, file$4, 361, 0, 17590);
    			add_location(em62, file$4, 378, 3, 17989);
    			add_location(p53, file$4, 378, 0, 17986);
    			attr_dev(pre18, "class", "prettyprint lang-js");
    			add_location(pre18, file$4, 379, 26, 18075);
    			attr_dev(pre19, "class", "prettyprint lang-html");
    			add_location(pre19, file$4, 382, 0, 18198);
    			attr_dev(pre20, "class", "prettyprint lang-css");
    			add_location(pre20, file$4, 388, 0, 18287);
    			attr_dev(div6, "class", "code-wrapper");
    			add_location(div6, file$4, 379, 0, 18049);
    			add_location(em63, file$4, 396, 3, 18451);
    			add_location(p54, file$4, 396, 0, 18448);
    			if (!src_url_equal(img9.src, img9_src_value = "./assets/components/User/call-user-component.png")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "Call User Component");
    			set_style(img9, "width", "800px");
    			add_location(img9, file$4, 397, 18, 18555);
    			attr_dev(p55, "align", "center");
    			add_location(p55, file$4, 397, 0, 18537);
    			add_location(p56, file$4, 399, 0, 18673);
    			add_location(li14, file$4, 401, 0, 18731);
    			add_location(li15, file$4, 402, 0, 18784);
    			add_location(li16, file$4, 403, 0, 18862);
    			add_location(li17, file$4, 404, 0, 18912);
    			add_location(ul8, file$4, 400, 0, 18726);
    			if (!src_url_equal(img10.src, img10_src_value = "./assets/components/User/components-section.png")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "Call User Component");
    			set_style(img10, "width", "900px");
    			add_location(img10, file$4, 407, 18, 19026);
    			attr_dev(p57, "align", "center");
    			add_location(p57, file$4, 407, 0, 19008);
    			add_location(h35, file$4, 409, 0, 19144);
    			add_location(em64, file$4, 410, 24, 19197);
    			add_location(em65, file$4, 411, 44, 19301);
    			add_location(em66, file$4, 412, 0, 19337);
    			add_location(em67, file$4, 413, 0, 19410);
    			add_location(p58, file$4, 410, 0, 19173);
    			add_location(em68, file$4, 415, 3, 19513);
    			add_location(p59, file$4, 415, 0, 19510);
    			attr_dev(pre21, "class", "prettyprint lang-js");
    			add_location(pre21, file$4, 416, 26, 19576);
    			attr_dev(pre22, "class", "prettyprint lang-html");
    			add_location(pre22, file$4, 417, 0, 19638);
    			attr_dev(pre23, "class", "prettyprint lang-css");
    			add_location(pre23, file$4, 423, 0, 19778);
    			attr_dev(div7, "class", "code-wrapper");
    			add_location(div7, file$4, 416, 0, 19550);
    			add_location(em69, file$4, 431, 3, 19953);
    			add_location(p60, file$4, 431, 0, 19950);
    			attr_dev(pre24, "class", "prettyprint lang-js");
    			add_location(pre24, file$4, 432, 26, 20020);
    			attr_dev(pre25, "class", "prettyprint lang-html");
    			add_location(pre25, file$4, 435, 0, 20126);
    			attr_dev(pre26, "class", "prettyprint lang-css");
    			add_location(pre26, file$4, 441, 0, 20210);
    			attr_dev(div8, "class", "code-wrapper");
    			add_location(div8, file$4, 432, 0, 19994);
    			if (!src_url_equal(img11.src, img11_src_value = "./assets/components/User/header-component.png")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "Call User Component");
    			set_style(img11, "width", "900px");
    			add_location(img11, file$4, 449, 18, 20397);
    			attr_dev(p61, "align", "center");
    			add_location(p61, file$4, 449, 0, 20379);
    			add_location(p62, file$4, 451, 0, 20513);
    			add_location(em70, file$4, 452, 3, 20579);
    			add_location(p63, file$4, 452, 0, 20576);
    			attr_dev(pre27, "class", "prettyprint lang-js");
    			add_location(pre27, file$4, 453, 26, 20665);
    			attr_dev(pre28, "class", "prettyprint lang-html");
    			add_location(pre28, file$4, 456, 0, 20788);
    			attr_dev(pre29, "class", "prettyprint lang-css");
    			add_location(pre29, file$4, 462, 0, 20896);
    			attr_dev(div9, "class", "code-wrapper");
    			add_location(div9, file$4, 453, 0, 20639);
    			add_location(p64, file$4, 470, 0, 21053);
    			add_location(h36, file$4, 471, 0, 21121);
    			add_location(p65, file$4, 472, 0, 21150);
    			add_location(code12, file$4, 475, 4, 21323);
    			add_location(li18, file$4, 475, 0, 21319);
    			add_location(code13, file$4, 476, 4, 21353);
    			add_location(li19, file$4, 476, 0, 21349);
    			add_location(code14, file$4, 477, 4, 21434);
    			add_location(li20, file$4, 477, 0, 21430);
    			attr_dev(a6, "href", "https://github.com/kahilkubilay/remember-em-all/tree/master/public/images");
    			attr_dev(a6, "title", "Images link");
    			add_location(a6, file$4, 478, 4, 21548);
    			add_location(li21, file$4, 478, 0, 21544);
    			add_location(ul9, file$4, 474, 0, 21314);
    			add_location(em71, file$4, 480, 3, 21677);
    			add_location(em72, file$4, 480, 27, 21701);
    			add_location(em73, file$4, 480, 76, 21750);
    			add_location(em74, file$4, 481, 0, 21775);
    			add_location(em75, file$4, 482, 0, 21850);
    			add_location(p66, file$4, 480, 0, 21674);
    			add_location(em76, file$4, 483, 3, 21915);
    			add_location(p67, file$4, 483, 0, 21912);
    			attr_dev(pre30, "class", "prettyprint lang-js");
    			add_location(pre30, file$4, 484, 26, 21991);
    			attr_dev(pre31, "class", "prettyprint lang-html");
    			add_location(pre31, file$4, 489, 0, 22157);
    			attr_dev(pre32, "class", "prettyprint lang-css");
    			add_location(pre32, file$4, 496, 0, 22301);
    			attr_dev(div10, "class", "code-wrapper");
    			add_location(div10, file$4, 484, 0, 21965);
    			add_location(em77, file$4, 502, 3, 22406);
    			add_location(em78, file$4, 502, 21, 22424);
    			add_location(p68, file$4, 502, 0, 22403);
    			if (!src_url_equal(img12.src, img12_src_value = "./assets/components/User/avatars-component.png")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "Call User Component");
    			set_style(img12, "width", "900px");
    			add_location(img12, file$4, 503, 18, 22521);
    			attr_dev(p69, "align", "center");
    			add_location(p69, file$4, 503, 0, 22503);
    			add_location(em79, file$4, 505, 3, 22641);
    			add_location(p70, file$4, 505, 0, 22638);
    			add_location(em80, file$4, 506, 3, 22709);
    			add_location(p71, file$4, 506, 0, 22706);
    			attr_dev(pre33, "class", "prettyprint lang-js");
    			add_location(pre33, file$4, 507, 26, 22785);
    			attr_dev(pre34, "class", "prettyprint lang-html");
    			add_location(pre34, file$4, 519, 0, 23175);
    			attr_dev(pre35, "class", "prettyprint lang-css");
    			add_location(pre35, file$4, 528, 0, 23338);
    			attr_dev(div11, "class", "code-wrapper");
    			add_location(div11, file$4, 507, 0, 22759);
    			add_location(code15, file$4, 535, 18, 23494);
    			add_location(em81, file$4, 535, 64, 23540);
    			add_location(em82, file$4, 536, 57, 23626);
    			add_location(p72, file$4, 535, 0, 23476);
    			add_location(em83, file$4, 539, 3, 23789);
    			add_location(p73, file$4, 539, 0, 23786);
    			attr_dev(pre36, "class", "prettyprint lang-js");
    			add_location(pre36, file$4, 540, 26, 23869);
    			attr_dev(pre37, "class", "prettyprint lang-html");
    			add_location(pre37, file$4, 543, 0, 23960);
    			attr_dev(pre38, "class", "prettyprint lang-css");
    			add_location(pre38, file$4, 547, 0, 24072);
    			attr_dev(div12, "class", "code-wrapper");
    			add_location(div12, file$4, 540, 0, 23843);
    			add_location(p74, file$4, 572, 0, 24519);
    			if (!src_url_equal(img13.src, img13_src_value = "./assets/components/User/user-component-end.png")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "Call User Component");
    			set_style(img13, "width", "900px");
    			add_location(img13, file$4, 574, 18, 24644);
    			attr_dev(p75, "align", "center");
    			add_location(p75, file$4, 574, 0, 24626);
    			add_location(h37, file$4, 576, 0, 24762);
    			add_location(p76, file$4, 577, 0, 24789);
    			add_location(code16, file$4, 579, 3, 24884);
    			add_location(p77, file$4, 579, 0, 24881);
    			add_location(code17, file$4, 580, 3, 24935);
    			add_location(p78, file$4, 580, 0, 24932);
    			add_location(em84, file$4, 581, 3, 25002);
    			add_location(p79, file$4, 581, 0, 24999);
    			attr_dev(pre39, "class", "prettyprint lang-js");
    			add_location(pre39, file$4, 582, 26, 25089);
    			attr_dev(pre40, "class", "prettyprint lang-html");
    			add_location(pre40, file$4, 583, 0, 25151);
    			attr_dev(pre41, "class", "prettyprint lang-css");
    			add_location(pre41, file$4, 589, 0, 25306);
    			attr_dev(div13, "class", "code-wrapper");
    			add_location(div13, file$4, 582, 0, 25063);
    			add_location(em85, file$4, 599, 41, 25549);
    			add_location(em86, file$4, 599, 73, 25581);
    			add_location(p80, file$4, 599, 0, 25508);
    			add_location(em87, file$4, 602, 26, 25739);
    			add_location(em88, file$4, 602, 51, 25764);
    			add_location(em89, file$4, 603, 0, 25807);
    			add_location(p81, file$4, 601, 0, 25631);
    			add_location(p82, file$4, 604, 0, 25856);
    			if (!src_url_equal(img14.src, img14_src_value = "./assets/components/User/end-interface.png")) attr_dev(img14, "src", img14_src_value);
    			attr_dev(img14, "alt", "Call User Component");
    			set_style(img14, "width", "900px");
    			add_location(img14, file$4, 608, 18, 26151);
    			attr_dev(p83, "align", "center");
    			add_location(p83, file$4, 608, 0, 26133);
    			add_location(h211, file$4, 610, 0, 26264);
    			add_location(em90, file$4, 612, 73, 26452);
    			add_location(em91, file$4, 613, 3, 26470);
    			add_location(em92, file$4, 614, 9, 26561);
    			add_location(em93, file$4, 614, 61, 26613);
    			add_location(em94, file$4, 615, 0, 26631);
    			add_location(p84, file$4, 611, 0, 26296);
    			add_location(code18, file$4, 617, 3, 26764);
    			add_location(code19, file$4, 618, 0, 26795);
    			add_location(p85, file$4, 617, 0, 26761);
    			add_location(em95, file$4, 619, 3, 26833);
    			add_location(p86, file$4, 619, 0, 26830);
    			attr_dev(pre42, "class", "prettyprint lang-js");
    			add_location(pre42, file$4, 620, 26, 26892);
    			attr_dev(div14, "class", "code-wrapper");
    			add_location(div14, file$4, 620, 0, 26866);
    			add_location(em96, file$4, 625, 3, 27078);
    			add_location(em97, file$4, 628, 0, 27308);
    			add_location(p87, file$4, 625, 0, 27075);
    			add_location(em98, file$4, 629, 58, 27457);
    			add_location(p88, file$4, 629, 0, 27399);
    			add_location(em99, file$4, 631, 3, 27500);
    			add_location(p89, file$4, 631, 0, 27497);
    			attr_dev(pre43, "class", "prettyprint lang-js");
    			add_location(pre43, file$4, 632, 26, 27559);
    			attr_dev(div15, "class", "code-wrapper");
    			add_location(div15, file$4, 632, 0, 27533);
    			add_location(em100, file$4, 638, 14, 27835);
    			add_location(em101, file$4, 639, 12, 27917);
    			add_location(p90, file$4, 637, 0, 27742);
    			add_location(p91, file$4, 641, 0, 28010);
    			add_location(code20, file$4, 642, 3, 28093);
    			add_location(p92, file$4, 642, 0, 28090);
    			add_location(em102, file$4, 643, 3, 28130);
    			add_location(p93, file$4, 643, 0, 28127);
    			attr_dev(pre44, "class", "prettyprint lang-js");
    			add_location(pre44, file$4, 644, 26, 28188);
    			attr_dev(div16, "class", "code-wrapper");
    			add_location(div16, file$4, 644, 0, 28162);
    			add_location(em103, file$4, 659, 44, 28831);
    			add_location(em104, file$4, 659, 70, 28857);
    			add_location(p94, file$4, 657, 0, 28631);
    			add_location(h212, file$4, 661, 0, 28916);
    			add_location(em105, file$4, 663, 15, 29015);
    			add_location(p95, file$4, 662, 0, 28943);
    			add_location(em106, file$4, 666, 3, 29186);
    			add_location(code21, file$4, 667, 21, 29294);
    			add_location(p96, file$4, 666, 0, 29183);
    			add_location(em107, file$4, 669, 3, 29379);
    			add_location(p97, file$4, 669, 0, 29376);
    			attr_dev(pre45, "class", "prettyprint lang-js");
    			add_location(pre45, file$4, 670, 26, 29477);
    			attr_dev(pre46, "class", "prettyprint lang-html");
    			add_location(pre46, file$4, 685, 0, 29783);
    			attr_dev(div17, "class", "code-wrapper");
    			add_location(div17, file$4, 670, 0, 29451);
    			add_location(code22, file$4, 695, 3, 29943);
    			add_location(code23, file$4, 697, 17, 30126);
    			add_location(p98, file$4, 695, 0, 29940);
    			add_location(em108, file$4, 700, 3, 30295);
    			add_location(p99, file$4, 700, 0, 30292);
    			attr_dev(pre47, "class", "prettyprint lang-js");
    			add_location(pre47, file$4, 701, 26, 30393);
    			attr_dev(pre48, "class", "prettyprint lang-html");
    			add_location(pre48, file$4, 710, 0, 30638);
    			attr_dev(div18, "class", "code-wrapper");
    			add_location(div18, file$4, 701, 0, 30367);
    			add_location(code24, file$4, 720, 69, 30883);
    			add_location(code25, file$4, 721, 24, 30928);
    			add_location(em109, file$4, 722, 0, 30987);
    			add_location(code26, file$4, 722, 75, 31062);
    			add_location(code27, file$4, 723, 0, 31086);
    			add_location(p100, file$4, 720, 0, 30814);
    			attr_dev(pre49, "class", "prettyprint lang-html");
    			add_location(pre49, file$4, 724, 26, 31179);
    			attr_dev(div19, "class", "code-wrapper");
    			add_location(div19, file$4, 724, 0, 31153);
    			add_location(code28, file$4, 735, 9, 31484);
    			add_location(p101, file$4, 734, 0, 31395);
    			if (!src_url_equal(img15.src, img15_src_value = "./assets/components/User/class-directive.gif")) attr_dev(img15, "src", img15_src_value);
    			attr_dev(img15, "alt", "Class Directives");
    			set_style(img15, "width", "900px");
    			add_location(img15, file$4, 736, 18, 31582);
    			attr_dev(p102, "align", "center");
    			add_location(p102, file$4, 736, 0, 31564);
    			add_location(p103, file$4, 738, 0, 31694);
    			add_location(em110, file$4, 739, 3, 31760);
    			add_location(p104, file$4, 739, 0, 31757);
    			attr_dev(pre50, "class", "prettyprint lang-js");
    			add_location(pre50, file$4, 740, 26, 31858);
    			attr_dev(pre51, "class", "prettyprint lang-html");
    			add_location(pre51, file$4, 745, 0, 32004);
    			attr_dev(div20, "class", "code-wrapper");
    			add_location(div20, file$4, 740, 0, 31832);
    			add_location(code29, file$4, 758, 75, 32288);
    			add_location(p105, file$4, 758, 0, 32213);
    			add_location(p106, file$4, 760, 0, 32346);
    			add_location(code30, file$4, 761, 14, 32443);
    			add_location(code31, file$4, 762, 42, 32573);
    			add_location(em111, file$4, 763, 12, 32632);
    			add_location(p107, file$4, 761, 0, 32429);
    			add_location(em112, file$4, 765, 3, 32760);
    			add_location(p108, file$4, 765, 0, 32757);
    			attr_dev(pre52, "class", "prettyprint lang-js");
    			add_location(pre52, file$4, 766, 26, 32863);
    			attr_dev(pre53, "class", "prettyprint lang-html");
    			add_location(pre53, file$4, 772, 0, 33075);
    			attr_dev(div21, "class", "code-wrapper");
    			add_location(div21, file$4, 766, 0, 32837);
    			add_location(code32, file$4, 783, 59, 33310);
    			add_location(code33, file$4, 784, 14, 33357);
    			add_location(p109, file$4, 783, 0, 33251);
    			add_location(em113, file$4, 785, 3, 33437);
    			add_location(p110, file$4, 785, 0, 33434);
    			attr_dev(pre54, "class", "prettyprint lang-js");
    			add_location(pre54, file$4, 786, 26, 33540);
    			attr_dev(pre55, "class", "prettyprint lang-html");
    			add_location(pre55, file$4, 807, 0, 33930);
    			attr_dev(div22, "class", "code-wrapper");
    			add_location(div22, file$4, 786, 0, 33514);
    			if (!src_url_equal(img16.src, img16_src_value = "./assets/components/User/start-game.gif")) attr_dev(img16, "src", img16_src_value);
    			attr_dev(img16, "alt", "Class Directives");
    			set_style(img16, "width", "900px");
    			add_location(img16, file$4, 814, 18, 34084);
    			attr_dev(p111, "align", "center");
    			add_location(p111, file$4, 814, 0, 34066);
    			add_location(em114, file$4, 816, 37, 34228);
    			add_location(em115, file$4, 816, 54, 34245);
    			add_location(em116, file$4, 817, 47, 34332);
    			add_location(em117, file$4, 819, 27, 34468);
    			add_location(p112, file$4, 816, 0, 34191);
    			attr_dev(pre56, "class", "prettyprint lang-js");
    			add_location(pre56, file$4, 822, 26, 34645);
    			attr_dev(pre57, "class", "prettyprint lang-html");
    			add_location(pre57, file$4, 847, 0, 35114);
    			attr_dev(pre58, "class", "prettyprint lang-css");
    			add_location(pre58, file$4, 858, 0, 35415);
    			attr_dev(div23, "class", "code-wrapper");
    			add_location(div23, file$4, 822, 0, 34619);
    			add_location(em118, file$4, 885, 58, 35851);
    			add_location(em119, file$4, 886, 0, 35877);
    			add_location(code34, file$4, 886, 84, 35961);
    			add_location(code35, file$4, 888, 44, 36098);
    			add_location(p113, file$4, 885, 0, 35793);
    			add_location(h38, file$4, 891, 0, 36276);
    			add_location(p114, file$4, 892, 0, 36301);
    			add_location(h39, file$4, 895, 0, 36484);
    			add_location(p115, file$4, 896, 0, 36511);
    			add_location(code36, file$4, 897, 3, 36597);
    			add_location(p116, file$4, 897, 0, 36594);
    			add_location(code37, file$4, 898, 3, 36695);
    			add_location(code38, file$4, 898, 73, 36765);
    			add_location(code39, file$4, 899, 14, 36801);
    			add_location(code40, file$4, 899, 62, 36849);
    			add_location(p117, file$4, 898, 0, 36692);
    			add_location(code41, file$4, 901, 3, 36901);
    			add_location(code42, file$4, 901, 63, 36961);
    			add_location(code43, file$4, 902, 31, 37035);
    			add_location(em120, file$4, 902, 78, 37082);
    			add_location(p118, file$4, 901, 0, 36898);
    			add_location(em121, file$4, 904, 3, 37140);
    			add_location(p119, file$4, 904, 0, 37137);
    			attr_dev(pre59, "class", "prettyprint lang-js");
    			add_location(pre59, file$4, 905, 26, 37240);
    			attr_dev(pre60, "class", "prettyprint lang-html");
    			add_location(pre60, file$4, 906, 0, 37302);
    			attr_dev(pre61, "class", "prettyprint lang-css");
    			add_location(pre61, file$4, 916, 0, 37550);
    			attr_dev(div24, "class", "code-wrapper");
    			add_location(div24, file$4, 905, 0, 37214);
    			add_location(code44, file$4, 931, 3, 37831);
    			add_location(code45, file$4, 931, 40, 37868);
    			add_location(p120, file$4, 931, 0, 37828);
    			add_location(code46, file$4, 934, 3, 38045);
    			add_location(code47, file$4, 934, 49, 38091);
    			add_location(code48, file$4, 934, 82, 38124);
    			add_location(code49, file$4, 935, 0, 38158);
    			add_location(code50, file$4, 935, 76, 38234);
    			add_location(p121, file$4, 934, 0, 38042);
    			add_location(em122, file$4, 938, 3, 38366);
    			add_location(p122, file$4, 938, 0, 38363);
    			attr_dev(pre62, "class", "prettyprint lang-js");
    			add_location(pre62, file$4, 939, 26, 38465);
    			attr_dev(pre63, "class", "prettyprint lang-html");
    			add_location(pre63, file$4, 940, 0, 38527);
    			attr_dev(pre64, "class", "prettyprint lang-css");
    			add_location(pre64, file$4, 950, 0, 38779);
    			attr_dev(div25, "class", "code-wrapper");
    			add_location(div25, file$4, 939, 0, 38439);
    			add_location(code51, file$4, 970, 3, 39117);
    			add_location(code52, file$4, 970, 37, 39151);
    			add_location(code53, file$4, 972, 11, 39293);
    			add_location(code54, file$4, 972, 47, 39329);
    			add_location(p123, file$4, 970, 0, 39114);
    			if (!src_url_equal(img17.src, img17_src_value = "./assets/components/Card/card-views.png")) attr_dev(img17, "src", img17_src_value);
    			attr_dev(img17, "alt", "Class Directives");
    			set_style(img17, "width", "900px");
    			add_location(img17, file$4, 974, 18, 39440);
    			attr_dev(p124, "align", "center");
    			add_location(p124, file$4, 974, 0, 39422);
    			add_location(code55, file$4, 976, 3, 39550);
    			add_location(code56, file$4, 978, 50, 39764);
    			add_location(code57, file$4, 979, 13, 39817);
    			add_location(code58, file$4, 979, 54, 39858);
    			add_location(p125, file$4, 976, 0, 39547);
    			add_location(em123, file$4, 981, 3, 39918);
    			add_location(p126, file$4, 981, 0, 39915);
    			attr_dev(pre65, "class", "prettyprint lang-js");
    			add_location(pre65, file$4, 982, 26, 40017);
    			attr_dev(pre66, "class", "prettyprint lang-html");
    			add_location(pre66, file$4, 986, 0, 40183);
    			attr_dev(pre67, "class", "prettyprint lang-css");
    			add_location(pre67, file$4, 995, 0, 40356);
    			attr_dev(div26, "class", "code-wrapper");
    			add_location(div26, file$4, 982, 0, 39991);
    			add_location(code59, file$4, 1008, 3, 40589);
    			add_location(em124, file$4, 1008, 63, 40649);
    			add_location(code60, file$4, 1008, 79, 40665);
    			add_location(p127, file$4, 1008, 0, 40586);
    			if (!src_url_equal(img18.src, img18_src_value = "./assets/components/Card/card-position.gif")) attr_dev(img18, "src", img18_src_value);
    			attr_dev(img18, "alt", "Card position");
    			set_style(img18, "width", "900px");
    			add_location(img18, file$4, 1010, 18, 40782);
    			attr_dev(p128, "align", "center");
    			add_location(p128, file$4, 1010, 0, 40764);
    			add_location(code61, file$4, 1012, 68, 40957);
    			add_location(code62, file$4, 1013, 22, 41002);
    			add_location(code63, file$4, 1013, 75, 41055);
    			add_location(code64, file$4, 1014, 58, 41136);
    			add_location(p129, file$4, 1012, 0, 40889);
    			add_location(em125, file$4, 1016, 3, 41210);
    			add_location(p130, file$4, 1016, 0, 41207);
    			attr_dev(pre68, "class", "prettyprint lang-css");
    			add_location(pre68, file$4, 1017, 26, 41272);
    			attr_dev(div27, "class", "code-wrapper");
    			add_location(div27, file$4, 1017, 0, 41246);
    			add_location(code65, file$4, 1026, 3, 41465);
    			add_location(code66, file$4, 1026, 38, 41500);
    			add_location(code67, file$4, 1026, 88, 41550);
    			add_location(p131, file$4, 1026, 0, 41462);
    			add_location(em126, file$4, 1028, 3, 41636);
    			add_location(p132, file$4, 1028, 0, 41633);
    			attr_dev(pre69, "class", "prettyprint lang-js");
    			add_location(pre69, file$4, 1029, 26, 41735);
    			attr_dev(pre70, "class", "prettyprint lang-html");
    			add_location(pre70, file$4, 1033, 0, 41901);
    			attr_dev(pre71, "class", "prettyprint lang-css");
    			add_location(pre71, file$4, 1040, 0, 42029);
    			attr_dev(div28, "class", "code-wrapper");
    			add_location(div28, file$4, 1029, 0, 41709);
    			add_location(code68, file$4, 1066, 3, 42532);
    			add_location(em127, file$4, 1068, 11, 42709);
    			add_location(p133, file$4, 1066, 0, 42529);
    			add_location(em128, file$4, 1071, 3, 42906);
    			add_location(p134, file$4, 1071, 0, 42903);
    			attr_dev(pre72, "class", "prettyprint lang-js");
    			add_location(pre72, file$4, 1072, 26, 43006);
    			attr_dev(pre73, "class", "prettyprint lang-html");
    			add_location(pre73, file$4, 1074, 0, 43071);
    			attr_dev(pre74, "class", "prettyprint lang-css");
    			add_location(pre74, file$4, 1084, 0, 43319);
    			attr_dev(div29, "class", "code-wrapper");
    			add_location(div29, file$4, 1072, 0, 42980);
    			add_location(code69, file$4, 1107, 0, 43973);
    			add_location(code70, file$4, 1107, 39, 44012);
    			add_location(code71, file$4, 1107, 76, 44049);
    			add_location(p135, file$4, 1104, 0, 43748);
    			if (!src_url_equal(img19.src, img19_src_value = "./assets/components/Card/card-turn-effect-back.png")) attr_dev(img19, "src", img19_src_value);
    			attr_dev(img19, "alt", "Card turn effect back");
    			set_style(img19, "width", "900px");
    			add_location(img19, file$4, 1109, 18, 44148);
    			attr_dev(p136, "align", "center");
    			add_location(p136, file$4, 1109, 0, 44130);
    			if (!src_url_equal(img20.src, img20_src_value = "./assets/components/Card/card-turn-effect-front.png")) attr_dev(img20, "src", img20_src_value);
    			attr_dev(img20, "alt", "Card turn effect front");
    			set_style(img20, "width", "900px");
    			add_location(img20, file$4, 1111, 18, 44289);
    			attr_dev(p137, "align", "center");
    			add_location(p137, file$4, 1111, 0, 44271);
    			attr_dev(span8, "id", "component-ve-dizin-yapisi");
    			add_location(span8, file$4, 1113, 0, 44414);
    			attr_dev(span9, "id", "github-page-ile-deploy");
    			add_location(span9, file$4, 1114, 0, 44459);
    			add_location(h213, file$4, 1115, 0, 44501);
    			add_location(h214, file$4, 1116, 0, 44534);
    			add_location(p138, file$4, 1118, 4, 44559);
    			add_location(li22, file$4, 1118, 0, 44555);
    			attr_dev(a7, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a7, file$4, 1120, 7, 44593);
    			add_location(p139, file$4, 1120, 4, 44590);
    			add_location(li23, file$4, 1120, 0, 44586);
    			add_location(p140, file$4, 1122, 4, 44731);
    			add_location(li24, file$4, 1122, 0, 44727);
    			attr_dev(a8, "href", "https://svelte.dev/examples/hello-world");
    			add_location(a8, file$4, 1124, 7, 44773);
    			add_location(p141, file$4, 1124, 4, 44770);
    			add_location(li25, file$4, 1124, 0, 44766);
    			attr_dev(a9, "href", "https://svelte.dev/tutorial/basics");
    			add_location(a9, file$4, 1126, 7, 44884);
    			add_location(p142, file$4, 1126, 4, 44881);
    			add_location(li26, file$4, 1126, 0, 44877);
    			attr_dev(a10, "href", "https://svelte.dev/docs");
    			add_location(a10, file$4, 1128, 7, 44985);
    			add_location(p143, file$4, 1128, 4, 44982);
    			add_location(li27, file$4, 1128, 0, 44978);
    			attr_dev(a11, "href", "https://svelte.dev/blog");
    			add_location(a11, file$4, 1130, 7, 45064);
    			add_location(p144, file$4, 1130, 4, 45061);
    			add_location(li28, file$4, 1130, 0, 45057);
    			attr_dev(a12, "href", "https://svelte.dev/blog/svelte-3-rethinking-reactivity");
    			add_location(a12, file$4, 1132, 7, 45143);
    			add_location(p145, file$4, 1132, 4, 45140);
    			add_location(li29, file$4, 1132, 0, 45136);
    			add_location(ul10, file$4, 1117, 0, 44550);
    			add_location(li30, file$4, 1136, 0, 45288);
    			add_location(ul11, file$4, 1135, 0, 45283);
    			attr_dev(a13, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript");
    			add_location(a13, file$4, 1139, 7, 45340);
    			add_location(p146, file$4, 1139, 4, 45337);
    			add_location(li31, file$4, 1139, 0, 45333);
    			add_location(p147, file$4, 1141, 4, 45602);
    			add_location(li32, file$4, 1141, 0, 45598);
    			attr_dev(a14, "href", "https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/");
    			add_location(a14, file$4, 1143, 7, 45636);
    			add_location(p148, file$4, 1143, 4, 45633);
    			add_location(li33, file$4, 1143, 0, 45629);
    			add_location(ul12, file$4, 1138, 0, 45328);
    			add_location(li34, file$4, 1147, 0, 45795);
    			add_location(ul13, file$4, 1146, 0, 45790);
    			attr_dev(a15, "href", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next");
    			add_location(a15, file$4, 1150, 4, 45827);
    			add_location(li35, file$4, 1150, 0, 45823);
    			add_location(ul14, file$4, 1149, 0, 45818);
    			add_location(li36, file$4, 1153, 0, 46101);
    			add_location(ul15, file$4, 1152, 0, 46096);
    			attr_dev(a16, "href", "https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project");
    			add_location(a16, file$4, 1156, 4, 46144);
    			add_location(li37, file$4, 1156, 0, 46140);
    			add_location(ul16, file$4, 1155, 0, 46135);
    			add_location(li38, file$4, 1159, 0, 46398);
    			add_location(ul17, file$4, 1158, 0, 46393);
    			attr_dev(a17, "href", "https://betterprogramming.pub/6-ways-to-do-component-communications-in-svelte-b3f2a483913c");
    			add_location(a17, file$4, 1162, 4, 46447);
    			add_location(li39, file$4, 1162, 0, 46443);
    			attr_dev(a18, "href", "https://livebook.manning.com/book/svelte-and-sapper-in-action/chapter-5/v-3/");
    			add_location(a18, file$4, 1163, 4, 46652);
    			add_location(li40, file$4, 1163, 0, 46648);
    			add_location(ul18, file$4, 1161, 0, 46438);
    			add_location(code72, file$4, 1165, 5, 46836);
    			add_location(pre75, file$4, 1165, 0, 46831);
    			add_location(p149, file$4, 1167, 0, 46857);
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
    			append_dev(p2, t12);
    			append_dev(p2, a2);
    			append_dev(p2, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, img1);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, t22);
    			append_dev(p5, em1);
    			append_dev(p5, t24);
    			append_dev(p5, em2);
    			append_dev(p5, t26);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t30, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t31);
    			append_dev(p6, em3);
    			append_dev(p6, t33);
    			insert_dev(target, t34, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, a3);
    			append_dev(p7, t36);
    			insert_dev(target, t37, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t39, anchor);
    			insert_dev(target, p8, anchor);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, ul6, anchor);
    			append_dev(ul6, li1);
    			append_dev(li1, code0);
    			append_dev(li1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul6, t44);
    			append_dev(ul6, li3);
    			append_dev(li3, code1);
    			append_dev(li3, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, em4);
    			append_dev(li2, t47);
    			append_dev(ul6, t48);
    			append_dev(ul6, li5);
    			append_dev(li5, code2);
    			append_dev(li5, ul2);
    			append_dev(ul2, li4);
    			append_dev(li4, em5);
    			append_dev(li4, t51);
    			append_dev(ul6, t52);
    			append_dev(ul6, li7);
    			append_dev(li7, code3);
    			append_dev(li7, ul3);
    			append_dev(ul3, li6);
    			append_dev(li6, em6);
    			append_dev(li6, t55);
    			append_dev(ul6, t56);
    			append_dev(ul6, li9);
    			append_dev(li9, code4);
    			append_dev(li9, ul4);
    			append_dev(ul4, li8);
    			append_dev(li8, em7);
    			append_dev(li8, t59);
    			append_dev(li8, em8);
    			append_dev(li8, t61);
    			append_dev(ul6, t62);
    			append_dev(ul6, li11);
    			append_dev(li11, code5);
    			append_dev(li11, ul5);
    			append_dev(ul5, li10);
    			append_dev(li10, em9);
    			append_dev(li10, t65);
    			append_dev(li10, em10);
    			append_dev(li10, t67);
    			append_dev(li10, em11);
    			append_dev(li10, t69);
    			insert_dev(target, t70, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t71, anchor);
    			insert_dev(target, h24, anchor);
    			insert_dev(target, t73, anchor);
    			insert_dev(target, p9, anchor);
    			insert_dev(target, t75, anchor);
    			html_tag.m(CODEBLOCK_1$1, target, anchor);
    			insert_dev(target, t76, anchor);
    			insert_dev(target, p10, anchor);
    			insert_dev(target, t78, anchor);
    			html_tag_1.m(CODEBLOCK_2$1, target, anchor);
    			insert_dev(target, t79, anchor);
    			insert_dev(target, p11, anchor);
    			insert_dev(target, t81, anchor);
    			html_tag_2.m(CODEBLOCK_3$1, target, anchor);
    			insert_dev(target, t82, anchor);
    			insert_dev(target, p12, anchor);
    			insert_dev(target, t84, anchor);
    			insert_dev(target, p13, anchor);
    			append_dev(p13, img2);
    			insert_dev(target, t85, anchor);
    			insert_dev(target, span4, anchor);
    			insert_dev(target, t86, anchor);
    			insert_dev(target, h25, anchor);
    			insert_dev(target, t88, anchor);
    			insert_dev(target, p14, anchor);
    			append_dev(p14, t89);
    			append_dev(p14, em12);
    			append_dev(p14, t91);
    			append_dev(p14, em13);
    			append_dev(p14, t93);
    			insert_dev(target, t94, anchor);
    			insert_dev(target, p15, anchor);
    			append_dev(p15, t95);
    			append_dev(p15, em14);
    			append_dev(p15, t97);
    			insert_dev(target, t98, anchor);
    			insert_dev(target, p16, anchor);
    			append_dev(p16, img3);
    			insert_dev(target, t99, anchor);
    			insert_dev(target, span5, anchor);
    			insert_dev(target, t100, anchor);
    			insert_dev(target, h26, anchor);
    			insert_dev(target, t102, anchor);
    			insert_dev(target, ul7, anchor);
    			append_dev(ul7, li12);
    			append_dev(li12, h40);
    			append_dev(li12, t104);
    			append_dev(li12, em15);
    			append_dev(li12, t106);
    			append_dev(li12, em16);
    			append_dev(li12, t108);
    			append_dev(ul7, t109);
    			append_dev(ul7, li13);
    			append_dev(li13, h41);
    			append_dev(li13, t111);
    			insert_dev(target, t112, anchor);
    			insert_dev(target, span6, anchor);
    			insert_dev(target, t113, anchor);
    			insert_dev(target, h27, anchor);
    			insert_dev(target, t115, anchor);
    			insert_dev(target, p17, anchor);
    			append_dev(p17, t116);
    			append_dev(p17, em17);
    			append_dev(p17, t118);
    			append_dev(p17, em18);
    			append_dev(p17, t120);
    			append_dev(p17, em19);
    			append_dev(p17, t122);
    			append_dev(p17, em20);
    			append_dev(p17, t124);
    			append_dev(p17, em21);
    			append_dev(p17, t126);
    			append_dev(p17, em22);
    			append_dev(p17, t128);
    			insert_dev(target, t129, anchor);
    			insert_dev(target, p18, anchor);
    			append_dev(p18, t130);
    			append_dev(p18, em23);
    			append_dev(p18, t132);
    			append_dev(p18, em24);
    			append_dev(p18, t134);
    			append_dev(p18, em25);
    			append_dev(p18, t136);
    			append_dev(p18, em26);
    			append_dev(p18, t138);
    			append_dev(p18, em27);
    			append_dev(p18, t140);
    			append_dev(p18, em28);
    			append_dev(p18, t142);
    			insert_dev(target, t143, anchor);
    			insert_dev(target, p19, anchor);
    			append_dev(p19, t144);
    			append_dev(p19, em29);
    			append_dev(p19, t146);
    			append_dev(p19, em30);
    			append_dev(p19, t148);
    			append_dev(p19, em31);
    			append_dev(p19, t150);
    			append_dev(p19, em32);
    			append_dev(p19, t152);
    			insert_dev(target, t153, anchor);
    			insert_dev(target, p20, anchor);
    			append_dev(p20, t154);
    			append_dev(p20, em33);
    			append_dev(p20, t156);
    			append_dev(p20, em34);
    			append_dev(p20, t158);
    			append_dev(p20, code6);
    			append_dev(p20, t160);
    			insert_dev(target, t161, anchor);
    			insert_dev(target, p21, anchor);
    			append_dev(p21, t162);
    			append_dev(p21, code7);
    			append_dev(p21, t164);
    			append_dev(p21, em35);
    			append_dev(p21, t166);
    			insert_dev(target, t167, anchor);
    			insert_dev(target, h28, anchor);
    			insert_dev(target, t169, anchor);
    			insert_dev(target, p22, anchor);
    			insert_dev(target, t171, anchor);
    			insert_dev(target, p23, anchor);
    			append_dev(p23, em36);
    			append_dev(p23, t173);
    			append_dev(p23, em37);
    			append_dev(p23, t175);
    			append_dev(p23, em38);
    			append_dev(p23, t177);
    			append_dev(p23, a4);
    			append_dev(p23, t179);
    			insert_dev(target, t180, anchor);
    			insert_dev(target, h30, anchor);
    			insert_dev(target, t182, anchor);
    			insert_dev(target, p24, anchor);
    			insert_dev(target, t184, anchor);
    			insert_dev(target, p25, anchor);
    			append_dev(p25, em39);
    			insert_dev(target, t186, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, pre0);
    			append_dev(div0, t188);
    			append_dev(div0, pre1);
    			append_dev(div0, t190);
    			append_dev(div0, pre2);
    			insert_dev(target, t192, anchor);
    			insert_dev(target, p26, anchor);
    			append_dev(p26, t193);
    			append_dev(p26, em40);
    			append_dev(p26, t195);
    			append_dev(p26, em41);
    			append_dev(p26, t197);
    			append_dev(p26, em42);
    			append_dev(p26, t199);
    			append_dev(p26, em43);
    			append_dev(p26, t201);
    			insert_dev(target, t202, anchor);
    			insert_dev(target, p27, anchor);
    			append_dev(p27, em44);
    			insert_dev(target, t204, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, pre3);
    			append_dev(div1, t206);
    			append_dev(div1, pre4);
    			append_dev(div1, t208);
    			append_dev(div1, pre5);
    			insert_dev(target, t210, anchor);
    			insert_dev(target, p28, anchor);
    			append_dev(p28, em45);
    			append_dev(p28, t212);
    			insert_dev(target, t213, anchor);
    			insert_dev(target, h31, anchor);
    			insert_dev(target, t215, anchor);
    			insert_dev(target, p29, anchor);
    			insert_dev(target, t217, anchor);
    			insert_dev(target, p30, anchor);
    			append_dev(p30, em46);
    			insert_dev(target, t219, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, pre6);
    			append_dev(div2, t221);
    			append_dev(div2, pre7);
    			append_dev(div2, t223);
    			append_dev(div2, pre8);
    			insert_dev(target, t225, anchor);
    			insert_dev(target, p31, anchor);
    			append_dev(p31, t226);
    			append_dev(p31, em47);
    			append_dev(p31, t228);
    			insert_dev(target, t229, anchor);
    			insert_dev(target, p32, anchor);
    			append_dev(p32, img4);
    			insert_dev(target, t230, anchor);
    			insert_dev(target, h32, anchor);
    			insert_dev(target, t232, anchor);
    			insert_dev(target, p33, anchor);
    			insert_dev(target, t234, anchor);
    			insert_dev(target, p34, anchor);
    			append_dev(p34, img5);
    			insert_dev(target, t235, anchor);
    			insert_dev(target, p35, anchor);
    			append_dev(p35, t236);
    			append_dev(p35, code8);
    			append_dev(p35, t238);
    			append_dev(p35, code9);
    			append_dev(p35, t240);
    			append_dev(p35, code10);
    			append_dev(p35, t242);
    			insert_dev(target, t243, anchor);
    			insert_dev(target, p36, anchor);
    			append_dev(p36, em48);
    			insert_dev(target, t245, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, pre9);
    			append_dev(div3, t247);
    			append_dev(div3, pre10);
    			append_dev(div3, t249);
    			append_dev(div3, pre11);
    			insert_dev(target, t251, anchor);
    			insert_dev(target, p37, anchor);
    			append_dev(p37, code11);
    			append_dev(p37, t253);
    			insert_dev(target, t254, anchor);
    			insert_dev(target, p38, anchor);
    			append_dev(p38, em49);
    			insert_dev(target, t256, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, pre12);
    			append_dev(div4, t258);
    			append_dev(div4, pre13);
    			append_dev(div4, t260);
    			append_dev(div4, pre14);
    			insert_dev(target, t262, anchor);
    			insert_dev(target, p39, anchor);
    			append_dev(p39, img6);
    			insert_dev(target, t263, anchor);
    			insert_dev(target, h33, anchor);
    			insert_dev(target, t265, anchor);
    			insert_dev(target, p40, anchor);
    			append_dev(p40, img7);
    			insert_dev(target, t266, anchor);
    			insert_dev(target, p41, anchor);
    			insert_dev(target, t268, anchor);
    			insert_dev(target, h42, anchor);
    			insert_dev(target, t270, anchor);
    			insert_dev(target, p42, anchor);
    			insert_dev(target, t272, anchor);
    			insert_dev(target, h43, anchor);
    			insert_dev(target, t274, anchor);
    			insert_dev(target, p43, anchor);
    			insert_dev(target, t276, anchor);
    			insert_dev(target, h44, anchor);
    			insert_dev(target, t278, anchor);
    			insert_dev(target, p44, anchor);
    			insert_dev(target, t280, anchor);
    			insert_dev(target, h45, anchor);
    			insert_dev(target, t282, anchor);
    			insert_dev(target, p45, anchor);
    			insert_dev(target, t284, anchor);
    			insert_dev(target, h46, anchor);
    			insert_dev(target, t286, anchor);
    			insert_dev(target, p46, anchor);
    			insert_dev(target, t288, anchor);
    			insert_dev(target, h29, anchor);
    			insert_dev(target, t290, anchor);
    			insert_dev(target, span7, anchor);
    			insert_dev(target, t291, anchor);
    			insert_dev(target, h210, anchor);
    			insert_dev(target, t293, anchor);
    			insert_dev(target, p47, anchor);
    			append_dev(p47, t294);
    			append_dev(p47, a5);
    			append_dev(p47, t296);
    			append_dev(p47, em50);
    			append_dev(p47, t298);
    			append_dev(p47, em51);
    			append_dev(p47, t300);
    			insert_dev(target, t301, anchor);
    			insert_dev(target, p48, anchor);
    			append_dev(p48, img8);
    			insert_dev(target, t302, anchor);
    			insert_dev(target, h34, anchor);
    			insert_dev(target, t304, anchor);
    			insert_dev(target, p49, anchor);
    			append_dev(p49, em52);
    			append_dev(p49, t306);
    			append_dev(p49, em53);
    			append_dev(p49, t308);
    			append_dev(p49, em54);
    			append_dev(p49, t310);
    			append_dev(p49, em55);
    			append_dev(p49, t312);
    			append_dev(p49, em56);
    			append_dev(p49, t314);
    			insert_dev(target, t315, anchor);
    			insert_dev(target, p50, anchor);
    			append_dev(p50, em57);
    			append_dev(p50, t317);
    			append_dev(p50, em58);
    			append_dev(p50, t319);
    			append_dev(p50, em59);
    			append_dev(p50, t321);
    			insert_dev(target, t322, anchor);
    			insert_dev(target, p51, anchor);
    			append_dev(p51, t323);
    			append_dev(p51, em60);
    			append_dev(p51, t325);
    			insert_dev(target, t326, anchor);
    			insert_dev(target, p52, anchor);
    			append_dev(p52, em61);
    			insert_dev(target, t328, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, pre15);
    			append_dev(div5, t330);
    			append_dev(div5, pre16);
    			append_dev(div5, t332);
    			append_dev(div5, pre17);
    			insert_dev(target, t334, anchor);
    			insert_dev(target, p53, anchor);
    			append_dev(p53, em62);
    			insert_dev(target, t336, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, pre18);
    			append_dev(div6, t338);
    			append_dev(div6, pre19);
    			append_dev(div6, t340);
    			append_dev(div6, pre20);
    			insert_dev(target, t342, anchor);
    			insert_dev(target, p54, anchor);
    			append_dev(p54, em63);
    			append_dev(p54, t344);
    			insert_dev(target, t345, anchor);
    			insert_dev(target, p55, anchor);
    			append_dev(p55, img9);
    			insert_dev(target, t346, anchor);
    			insert_dev(target, p56, anchor);
    			insert_dev(target, t348, anchor);
    			insert_dev(target, ul8, anchor);
    			append_dev(ul8, li14);
    			append_dev(ul8, t350);
    			append_dev(ul8, li15);
    			append_dev(ul8, t352);
    			append_dev(ul8, li16);
    			append_dev(ul8, t354);
    			append_dev(ul8, li17);
    			insert_dev(target, t356, anchor);
    			insert_dev(target, p57, anchor);
    			append_dev(p57, img10);
    			insert_dev(target, t357, anchor);
    			insert_dev(target, h35, anchor);
    			insert_dev(target, t359, anchor);
    			insert_dev(target, p58, anchor);
    			append_dev(p58, t360);
    			append_dev(p58, em64);
    			append_dev(p58, t362);
    			append_dev(p58, em65);
    			append_dev(p58, t364);
    			append_dev(p58, em66);
    			append_dev(p58, t366);
    			append_dev(p58, em67);
    			append_dev(p58, t368);
    			insert_dev(target, t369, anchor);
    			insert_dev(target, p59, anchor);
    			append_dev(p59, em68);
    			insert_dev(target, t371, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, pre21);
    			append_dev(div7, t373);
    			append_dev(div7, pre22);
    			append_dev(div7, t375);
    			append_dev(div7, pre23);
    			insert_dev(target, t377, anchor);
    			insert_dev(target, p60, anchor);
    			append_dev(p60, em69);
    			insert_dev(target, t379, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, pre24);
    			append_dev(div8, t381);
    			append_dev(div8, pre25);
    			append_dev(div8, t383);
    			append_dev(div8, pre26);
    			insert_dev(target, t385, anchor);
    			insert_dev(target, p61, anchor);
    			append_dev(p61, img11);
    			insert_dev(target, t386, anchor);
    			insert_dev(target, p62, anchor);
    			insert_dev(target, t388, anchor);
    			insert_dev(target, p63, anchor);
    			append_dev(p63, em70);
    			insert_dev(target, t390, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, pre27);
    			append_dev(div9, t392);
    			append_dev(div9, pre28);
    			append_dev(div9, t394);
    			append_dev(div9, pre29);
    			insert_dev(target, t396, anchor);
    			insert_dev(target, p64, anchor);
    			insert_dev(target, t398, anchor);
    			insert_dev(target, h36, anchor);
    			insert_dev(target, t400, anchor);
    			insert_dev(target, p65, anchor);
    			insert_dev(target, t402, anchor);
    			insert_dev(target, ul9, anchor);
    			append_dev(ul9, li18);
    			append_dev(li18, code12);
    			append_dev(ul9, t404);
    			append_dev(ul9, li19);
    			append_dev(li19, code13);
    			append_dev(ul9, t406);
    			append_dev(ul9, li20);
    			append_dev(li20, code14);
    			append_dev(ul9, t408);
    			append_dev(ul9, li21);
    			append_dev(li21, a6);
    			insert_dev(target, t410, anchor);
    			insert_dev(target, p66, anchor);
    			append_dev(p66, em71);
    			append_dev(p66, t412);
    			append_dev(p66, em72);
    			append_dev(p66, t414);
    			append_dev(p66, em73);
    			append_dev(p66, t416);
    			append_dev(p66, em74);
    			append_dev(p66, t418);
    			append_dev(p66, em75);
    			append_dev(p66, t420);
    			insert_dev(target, t421, anchor);
    			insert_dev(target, p67, anchor);
    			append_dev(p67, em76);
    			insert_dev(target, t423, anchor);
    			insert_dev(target, div10, anchor);
    			append_dev(div10, pre30);
    			append_dev(div10, t425);
    			append_dev(div10, pre31);
    			append_dev(div10, t427);
    			append_dev(div10, pre32);
    			insert_dev(target, t429, anchor);
    			insert_dev(target, p68, anchor);
    			append_dev(p68, em77);
    			append_dev(p68, t431);
    			append_dev(p68, em78);
    			append_dev(p68, t433);
    			insert_dev(target, t434, anchor);
    			insert_dev(target, p69, anchor);
    			append_dev(p69, img12);
    			insert_dev(target, t435, anchor);
    			insert_dev(target, p70, anchor);
    			append_dev(p70, em79);
    			append_dev(p70, t437);
    			insert_dev(target, t438, anchor);
    			insert_dev(target, p71, anchor);
    			append_dev(p71, em80);
    			insert_dev(target, t440, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, pre33);
    			append_dev(div11, t442);
    			append_dev(div11, pre34);
    			append_dev(div11, t444);
    			append_dev(div11, pre35);
    			insert_dev(target, t446, anchor);
    			insert_dev(target, p72, anchor);
    			append_dev(p72, t447);
    			append_dev(p72, code15);
    			append_dev(p72, t449);
    			append_dev(p72, em81);
    			append_dev(p72, t451);
    			append_dev(p72, em82);
    			append_dev(p72, t453);
    			insert_dev(target, t454, anchor);
    			insert_dev(target, p73, anchor);
    			append_dev(p73, em83);
    			insert_dev(target, t456, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, pre36);
    			append_dev(div12, t458);
    			append_dev(div12, pre37);
    			append_dev(div12, t460);
    			append_dev(div12, pre38);
    			insert_dev(target, t462, anchor);
    			insert_dev(target, p74, anchor);
    			insert_dev(target, t464, anchor);
    			insert_dev(target, p75, anchor);
    			append_dev(p75, img13);
    			insert_dev(target, t465, anchor);
    			insert_dev(target, h37, anchor);
    			insert_dev(target, t467, anchor);
    			insert_dev(target, p76, anchor);
    			insert_dev(target, t469, anchor);
    			insert_dev(target, p77, anchor);
    			append_dev(p77, code16);
    			insert_dev(target, t471, anchor);
    			insert_dev(target, p78, anchor);
    			append_dev(p78, code17);
    			insert_dev(target, t473, anchor);
    			insert_dev(target, p79, anchor);
    			append_dev(p79, em84);
    			insert_dev(target, t475, anchor);
    			insert_dev(target, div13, anchor);
    			append_dev(div13, pre39);
    			append_dev(div13, t477);
    			append_dev(div13, pre40);
    			append_dev(div13, t479);
    			append_dev(div13, pre41);
    			insert_dev(target, t481, anchor);
    			insert_dev(target, p80, anchor);
    			append_dev(p80, t482);
    			append_dev(p80, em85);
    			append_dev(p80, t484);
    			append_dev(p80, em86);
    			append_dev(p80, t486);
    			insert_dev(target, t487, anchor);
    			insert_dev(target, p81, anchor);
    			append_dev(p81, t488);
    			append_dev(p81, em87);
    			append_dev(p81, t490);
    			append_dev(p81, em88);
    			append_dev(p81, t492);
    			append_dev(p81, em89);
    			append_dev(p81, t494);
    			insert_dev(target, t495, anchor);
    			insert_dev(target, p82, anchor);
    			insert_dev(target, t497, anchor);
    			insert_dev(target, p83, anchor);
    			append_dev(p83, img14);
    			insert_dev(target, t498, anchor);
    			insert_dev(target, h211, anchor);
    			insert_dev(target, t500, anchor);
    			insert_dev(target, p84, anchor);
    			append_dev(p84, t501);
    			append_dev(p84, em90);
    			append_dev(p84, t503);
    			append_dev(p84, em91);
    			append_dev(p84, t505);
    			append_dev(p84, em92);
    			append_dev(p84, t507);
    			append_dev(p84, em93);
    			append_dev(p84, t509);
    			append_dev(p84, em94);
    			append_dev(p84, t511);
    			insert_dev(target, t512, anchor);
    			insert_dev(target, p85, anchor);
    			append_dev(p85, code18);
    			append_dev(p85, t514);
    			append_dev(p85, code19);
    			insert_dev(target, t516, anchor);
    			insert_dev(target, p86, anchor);
    			append_dev(p86, em95);
    			insert_dev(target, t518, anchor);
    			insert_dev(target, div14, anchor);
    			append_dev(div14, pre42);
    			insert_dev(target, t520, anchor);
    			insert_dev(target, p87, anchor);
    			append_dev(p87, em96);
    			append_dev(p87, t522);
    			append_dev(p87, em97);
    			append_dev(p87, t524);
    			insert_dev(target, t525, anchor);
    			insert_dev(target, p88, anchor);
    			append_dev(p88, t526);
    			append_dev(p88, em98);
    			append_dev(p88, t528);
    			insert_dev(target, t529, anchor);
    			insert_dev(target, p89, anchor);
    			append_dev(p89, em99);
    			insert_dev(target, t531, anchor);
    			insert_dev(target, div15, anchor);
    			append_dev(div15, pre43);
    			insert_dev(target, t533, anchor);
    			insert_dev(target, p90, anchor);
    			append_dev(p90, t534);
    			append_dev(p90, em100);
    			append_dev(p90, t536);
    			append_dev(p90, em101);
    			append_dev(p90, t538);
    			insert_dev(target, t539, anchor);
    			insert_dev(target, p91, anchor);
    			insert_dev(target, t541, anchor);
    			insert_dev(target, p92, anchor);
    			append_dev(p92, code20);
    			insert_dev(target, t543, anchor);
    			insert_dev(target, p93, anchor);
    			append_dev(p93, em102);
    			insert_dev(target, t545, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, pre44);
    			insert_dev(target, t547, anchor);
    			insert_dev(target, p94, anchor);
    			append_dev(p94, t548);
    			append_dev(p94, em103);
    			append_dev(p94, t550);
    			append_dev(p94, em104);
    			append_dev(p94, t552);
    			insert_dev(target, t553, anchor);
    			insert_dev(target, h212, anchor);
    			insert_dev(target, t555, anchor);
    			insert_dev(target, p95, anchor);
    			append_dev(p95, t556);
    			append_dev(p95, em105);
    			append_dev(p95, t558);
    			insert_dev(target, t559, anchor);
    			insert_dev(target, p96, anchor);
    			append_dev(p96, em106);
    			append_dev(p96, t561);
    			append_dev(p96, code21);
    			append_dev(p96, t563);
    			insert_dev(target, t564, anchor);
    			insert_dev(target, p97, anchor);
    			append_dev(p97, em107);
    			insert_dev(target, t566, anchor);
    			insert_dev(target, div17, anchor);
    			append_dev(div17, pre45);
    			append_dev(div17, t568);
    			append_dev(div17, pre46);
    			insert_dev(target, t570, anchor);
    			insert_dev(target, p98, anchor);
    			append_dev(p98, code22);
    			append_dev(p98, t572);
    			append_dev(p98, code23);
    			append_dev(p98, t574);
    			insert_dev(target, t575, anchor);
    			insert_dev(target, p99, anchor);
    			append_dev(p99, em108);
    			insert_dev(target, t577, anchor);
    			insert_dev(target, div18, anchor);
    			append_dev(div18, pre47);
    			append_dev(div18, t579);
    			append_dev(div18, pre48);
    			insert_dev(target, t581, anchor);
    			insert_dev(target, p100, anchor);
    			append_dev(p100, t582);
    			append_dev(p100, code24);
    			append_dev(p100, t584);
    			append_dev(p100, code25);
    			append_dev(p100, t586);
    			append_dev(p100, em109);
    			append_dev(p100, t588);
    			append_dev(p100, code26);
    			append_dev(p100, t590);
    			append_dev(p100, code27);
    			append_dev(p100, t592);
    			insert_dev(target, t593, anchor);
    			insert_dev(target, div19, anchor);
    			append_dev(div19, pre49);
    			insert_dev(target, t595, anchor);
    			insert_dev(target, p101, anchor);
    			append_dev(p101, t596);
    			append_dev(p101, code28);
    			append_dev(p101, t598);
    			insert_dev(target, t599, anchor);
    			insert_dev(target, p102, anchor);
    			append_dev(p102, img15);
    			insert_dev(target, t600, anchor);
    			insert_dev(target, p103, anchor);
    			insert_dev(target, t602, anchor);
    			insert_dev(target, p104, anchor);
    			append_dev(p104, em110);
    			insert_dev(target, t604, anchor);
    			insert_dev(target, div20, anchor);
    			append_dev(div20, pre50);
    			append_dev(div20, t606);
    			append_dev(div20, pre51);
    			insert_dev(target, t608, anchor);
    			insert_dev(target, p105, anchor);
    			append_dev(p105, t609);
    			append_dev(p105, code29);
    			append_dev(p105, t611);
    			insert_dev(target, t612, anchor);
    			insert_dev(target, p106, anchor);
    			insert_dev(target, t614, anchor);
    			insert_dev(target, p107, anchor);
    			append_dev(p107, t615);
    			append_dev(p107, code30);
    			append_dev(p107, t617);
    			append_dev(p107, code31);
    			append_dev(p107, t619);
    			append_dev(p107, em111);
    			append_dev(p107, t621);
    			insert_dev(target, t622, anchor);
    			insert_dev(target, p108, anchor);
    			append_dev(p108, em112);
    			insert_dev(target, t624, anchor);
    			insert_dev(target, div21, anchor);
    			append_dev(div21, pre52);
    			append_dev(div21, t626);
    			append_dev(div21, pre53);
    			insert_dev(target, t628, anchor);
    			insert_dev(target, p109, anchor);
    			append_dev(p109, t629);
    			append_dev(p109, code32);
    			append_dev(p109, t631);
    			append_dev(p109, code33);
    			append_dev(p109, t633);
    			insert_dev(target, t634, anchor);
    			insert_dev(target, p110, anchor);
    			append_dev(p110, em113);
    			insert_dev(target, t636, anchor);
    			insert_dev(target, div22, anchor);
    			append_dev(div22, pre54);
    			append_dev(div22, t638);
    			append_dev(div22, pre55);
    			insert_dev(target, t640, anchor);
    			insert_dev(target, p111, anchor);
    			append_dev(p111, img16);
    			insert_dev(target, t641, anchor);
    			insert_dev(target, p112, anchor);
    			append_dev(p112, t642);
    			append_dev(p112, em114);
    			append_dev(p112, t644);
    			append_dev(p112, em115);
    			append_dev(p112, t646);
    			append_dev(p112, em116);
    			append_dev(p112, t648);
    			append_dev(p112, em117);
    			append_dev(p112, t650);
    			insert_dev(target, t651, anchor);
    			insert_dev(target, div23, anchor);
    			append_dev(div23, pre56);
    			append_dev(div23, t653);
    			append_dev(div23, pre57);
    			append_dev(div23, t655);
    			append_dev(div23, pre58);
    			insert_dev(target, t657, anchor);
    			insert_dev(target, p113, anchor);
    			append_dev(p113, t658);
    			append_dev(p113, em118);
    			append_dev(p113, t660);
    			append_dev(p113, em119);
    			append_dev(p113, t662);
    			append_dev(p113, code34);
    			append_dev(p113, t664);
    			append_dev(p113, code35);
    			append_dev(p113, t666);
    			insert_dev(target, t667, anchor);
    			insert_dev(target, h38, anchor);
    			insert_dev(target, t669, anchor);
    			insert_dev(target, p114, anchor);
    			insert_dev(target, t671, anchor);
    			insert_dev(target, h39, anchor);
    			insert_dev(target, t673, anchor);
    			insert_dev(target, p115, anchor);
    			insert_dev(target, t675, anchor);
    			insert_dev(target, p116, anchor);
    			append_dev(p116, code36);
    			insert_dev(target, t677, anchor);
    			insert_dev(target, p117, anchor);
    			append_dev(p117, code37);
    			append_dev(p117, t679);
    			append_dev(p117, code38);
    			append_dev(p117, t681);
    			append_dev(p117, code39);
    			append_dev(p117, t683);
    			append_dev(p117, code40);
    			append_dev(p117, t685);
    			insert_dev(target, t686, anchor);
    			insert_dev(target, p118, anchor);
    			append_dev(p118, code41);
    			append_dev(p118, t688);
    			append_dev(p118, code42);
    			append_dev(p118, t690);
    			append_dev(p118, code43);
    			append_dev(p118, t692);
    			append_dev(p118, em120);
    			append_dev(p118, t694);
    			insert_dev(target, t695, anchor);
    			insert_dev(target, p119, anchor);
    			append_dev(p119, em121);
    			insert_dev(target, t697, anchor);
    			insert_dev(target, div24, anchor);
    			append_dev(div24, pre59);
    			append_dev(div24, t699);
    			append_dev(div24, pre60);
    			append_dev(div24, t701);
    			append_dev(div24, pre61);
    			insert_dev(target, t703, anchor);
    			insert_dev(target, p120, anchor);
    			append_dev(p120, code44);
    			append_dev(p120, t705);
    			append_dev(p120, code45);
    			append_dev(p120, t707);
    			insert_dev(target, t708, anchor);
    			insert_dev(target, p121, anchor);
    			append_dev(p121, code46);
    			append_dev(p121, t710);
    			append_dev(p121, code47);
    			append_dev(p121, t712);
    			append_dev(p121, code48);
    			append_dev(p121, t714);
    			append_dev(p121, code49);
    			append_dev(p121, t716);
    			append_dev(p121, code50);
    			append_dev(p121, t718);
    			insert_dev(target, t719, anchor);
    			insert_dev(target, p122, anchor);
    			append_dev(p122, em122);
    			insert_dev(target, t721, anchor);
    			insert_dev(target, div25, anchor);
    			append_dev(div25, pre62);
    			append_dev(div25, t723);
    			append_dev(div25, pre63);
    			append_dev(div25, t725);
    			append_dev(div25, pre64);
    			insert_dev(target, t727, anchor);
    			insert_dev(target, p123, anchor);
    			append_dev(p123, code51);
    			append_dev(p123, t729);
    			append_dev(p123, code52);
    			append_dev(p123, t731);
    			append_dev(p123, code53);
    			append_dev(p123, t733);
    			append_dev(p123, code54);
    			append_dev(p123, t735);
    			insert_dev(target, t736, anchor);
    			insert_dev(target, p124, anchor);
    			append_dev(p124, img17);
    			insert_dev(target, t737, anchor);
    			insert_dev(target, p125, anchor);
    			append_dev(p125, code55);
    			append_dev(p125, t739);
    			append_dev(p125, code56);
    			append_dev(p125, t741);
    			append_dev(p125, code57);
    			append_dev(p125, t743);
    			append_dev(p125, code58);
    			append_dev(p125, t745);
    			insert_dev(target, t746, anchor);
    			insert_dev(target, p126, anchor);
    			append_dev(p126, em123);
    			insert_dev(target, t748, anchor);
    			insert_dev(target, div26, anchor);
    			append_dev(div26, pre65);
    			append_dev(div26, t750);
    			append_dev(div26, pre66);
    			append_dev(div26, t752);
    			append_dev(div26, pre67);
    			insert_dev(target, t754, anchor);
    			insert_dev(target, p127, anchor);
    			append_dev(p127, code59);
    			append_dev(p127, t756);
    			append_dev(p127, em124);
    			append_dev(p127, t758);
    			append_dev(p127, code60);
    			append_dev(p127, t760);
    			insert_dev(target, t761, anchor);
    			insert_dev(target, p128, anchor);
    			append_dev(p128, img18);
    			insert_dev(target, t762, anchor);
    			insert_dev(target, p129, anchor);
    			append_dev(p129, t763);
    			append_dev(p129, code61);
    			append_dev(p129, t765);
    			append_dev(p129, code62);
    			append_dev(p129, t767);
    			append_dev(p129, code63);
    			append_dev(p129, t769);
    			append_dev(p129, code64);
    			append_dev(p129, t771);
    			insert_dev(target, t772, anchor);
    			insert_dev(target, p130, anchor);
    			append_dev(p130, em125);
    			insert_dev(target, t774, anchor);
    			insert_dev(target, div27, anchor);
    			append_dev(div27, pre68);
    			insert_dev(target, t776, anchor);
    			insert_dev(target, p131, anchor);
    			append_dev(p131, code65);
    			append_dev(p131, t778);
    			append_dev(p131, code66);
    			append_dev(p131, t780);
    			append_dev(p131, code67);
    			append_dev(p131, t782);
    			insert_dev(target, t783, anchor);
    			insert_dev(target, p132, anchor);
    			append_dev(p132, em126);
    			insert_dev(target, t785, anchor);
    			insert_dev(target, div28, anchor);
    			append_dev(div28, pre69);
    			append_dev(div28, t787);
    			append_dev(div28, pre70);
    			append_dev(div28, t789);
    			append_dev(div28, pre71);
    			insert_dev(target, t791, anchor);
    			insert_dev(target, p133, anchor);
    			append_dev(p133, code68);
    			append_dev(p133, t793);
    			append_dev(p133, em127);
    			append_dev(p133, t795);
    			insert_dev(target, t796, anchor);
    			insert_dev(target, p134, anchor);
    			append_dev(p134, em128);
    			insert_dev(target, t798, anchor);
    			insert_dev(target, div29, anchor);
    			append_dev(div29, pre72);
    			append_dev(div29, t800);
    			append_dev(div29, pre73);
    			append_dev(div29, t802);
    			append_dev(div29, pre74);
    			insert_dev(target, t804, anchor);
    			insert_dev(target, p135, anchor);
    			append_dev(p135, t805);
    			append_dev(p135, code69);
    			append_dev(p135, t807);
    			append_dev(p135, code70);
    			append_dev(p135, t809);
    			append_dev(p135, code71);
    			append_dev(p135, t811);
    			insert_dev(target, t812, anchor);
    			insert_dev(target, p136, anchor);
    			append_dev(p136, img19);
    			insert_dev(target, t813, anchor);
    			insert_dev(target, p137, anchor);
    			append_dev(p137, img20);
    			insert_dev(target, t814, anchor);
    			insert_dev(target, span8, anchor);
    			insert_dev(target, t815, anchor);
    			insert_dev(target, span9, anchor);
    			insert_dev(target, t816, anchor);
    			insert_dev(target, h213, anchor);
    			insert_dev(target, t818, anchor);
    			insert_dev(target, h214, anchor);
    			insert_dev(target, t820, anchor);
    			insert_dev(target, ul10, anchor);
    			append_dev(ul10, li22);
    			append_dev(li22, p138);
    			append_dev(ul10, t822);
    			append_dev(ul10, li23);
    			append_dev(li23, p139);
    			append_dev(p139, a7);
    			append_dev(ul10, t824);
    			append_dev(ul10, li24);
    			append_dev(li24, p140);
    			append_dev(ul10, t826);
    			append_dev(ul10, li25);
    			append_dev(li25, p141);
    			append_dev(p141, a8);
    			append_dev(ul10, t828);
    			append_dev(ul10, li26);
    			append_dev(li26, p142);
    			append_dev(p142, a9);
    			append_dev(ul10, t830);
    			append_dev(ul10, li27);
    			append_dev(li27, p143);
    			append_dev(p143, a10);
    			append_dev(ul10, t832);
    			append_dev(ul10, li28);
    			append_dev(li28, p144);
    			append_dev(p144, a11);
    			append_dev(ul10, t834);
    			append_dev(ul10, li29);
    			append_dev(li29, p145);
    			append_dev(p145, a12);
    			insert_dev(target, t836, anchor);
    			insert_dev(target, ul11, anchor);
    			append_dev(ul11, li30);
    			insert_dev(target, t838, anchor);
    			insert_dev(target, ul12, anchor);
    			append_dev(ul12, li31);
    			append_dev(li31, p146);
    			append_dev(p146, a13);
    			append_dev(ul12, t840);
    			append_dev(ul12, li32);
    			append_dev(li32, p147);
    			append_dev(ul12, t842);
    			append_dev(ul12, li33);
    			append_dev(li33, p148);
    			append_dev(p148, a14);
    			insert_dev(target, t844, anchor);
    			insert_dev(target, ul13, anchor);
    			append_dev(ul13, li34);
    			insert_dev(target, t846, anchor);
    			insert_dev(target, ul14, anchor);
    			append_dev(ul14, li35);
    			append_dev(li35, a15);
    			insert_dev(target, t848, anchor);
    			insert_dev(target, ul15, anchor);
    			append_dev(ul15, li36);
    			insert_dev(target, t850, anchor);
    			insert_dev(target, ul16, anchor);
    			append_dev(ul16, li37);
    			append_dev(li37, a16);
    			insert_dev(target, t852, anchor);
    			insert_dev(target, ul17, anchor);
    			append_dev(ul17, li38);
    			insert_dev(target, t854, anchor);
    			insert_dev(target, ul18, anchor);
    			append_dev(ul18, li39);
    			append_dev(li39, a17);
    			append_dev(ul18, t856);
    			append_dev(ul18, li40);
    			append_dev(li40, a18);
    			insert_dev(target, t858, anchor);
    			insert_dev(target, pre75, anchor);
    			append_dev(pre75, code72);
    			insert_dev(target, t860, anchor);
    			insert_dev(target, p149, anchor);
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
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t30);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t37);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t39);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(ul6);
    			if (detaching) detach_dev(t70);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t71);
    			if (detaching) detach_dev(h24);
    			if (detaching) detach_dev(t73);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t75);
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t76);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t78);
    			if (detaching) html_tag_1.d();
    			if (detaching) detach_dev(t79);
    			if (detaching) detach_dev(p11);
    			if (detaching) detach_dev(t81);
    			if (detaching) html_tag_2.d();
    			if (detaching) detach_dev(t82);
    			if (detaching) detach_dev(p12);
    			if (detaching) detach_dev(t84);
    			if (detaching) detach_dev(p13);
    			if (detaching) detach_dev(t85);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t86);
    			if (detaching) detach_dev(h25);
    			if (detaching) detach_dev(t88);
    			if (detaching) detach_dev(p14);
    			if (detaching) detach_dev(t94);
    			if (detaching) detach_dev(p15);
    			if (detaching) detach_dev(t98);
    			if (detaching) detach_dev(p16);
    			if (detaching) detach_dev(t99);
    			if (detaching) detach_dev(span5);
    			if (detaching) detach_dev(t100);
    			if (detaching) detach_dev(h26);
    			if (detaching) detach_dev(t102);
    			if (detaching) detach_dev(ul7);
    			if (detaching) detach_dev(t112);
    			if (detaching) detach_dev(span6);
    			if (detaching) detach_dev(t113);
    			if (detaching) detach_dev(h27);
    			if (detaching) detach_dev(t115);
    			if (detaching) detach_dev(p17);
    			if (detaching) detach_dev(t129);
    			if (detaching) detach_dev(p18);
    			if (detaching) detach_dev(t143);
    			if (detaching) detach_dev(p19);
    			if (detaching) detach_dev(t153);
    			if (detaching) detach_dev(p20);
    			if (detaching) detach_dev(t161);
    			if (detaching) detach_dev(p21);
    			if (detaching) detach_dev(t167);
    			if (detaching) detach_dev(h28);
    			if (detaching) detach_dev(t169);
    			if (detaching) detach_dev(p22);
    			if (detaching) detach_dev(t171);
    			if (detaching) detach_dev(p23);
    			if (detaching) detach_dev(t180);
    			if (detaching) detach_dev(h30);
    			if (detaching) detach_dev(t182);
    			if (detaching) detach_dev(p24);
    			if (detaching) detach_dev(t184);
    			if (detaching) detach_dev(p25);
    			if (detaching) detach_dev(t186);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t192);
    			if (detaching) detach_dev(p26);
    			if (detaching) detach_dev(t202);
    			if (detaching) detach_dev(p27);
    			if (detaching) detach_dev(t204);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t210);
    			if (detaching) detach_dev(p28);
    			if (detaching) detach_dev(t213);
    			if (detaching) detach_dev(h31);
    			if (detaching) detach_dev(t215);
    			if (detaching) detach_dev(p29);
    			if (detaching) detach_dev(t217);
    			if (detaching) detach_dev(p30);
    			if (detaching) detach_dev(t219);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t225);
    			if (detaching) detach_dev(p31);
    			if (detaching) detach_dev(t229);
    			if (detaching) detach_dev(p32);
    			if (detaching) detach_dev(t230);
    			if (detaching) detach_dev(h32);
    			if (detaching) detach_dev(t232);
    			if (detaching) detach_dev(p33);
    			if (detaching) detach_dev(t234);
    			if (detaching) detach_dev(p34);
    			if (detaching) detach_dev(t235);
    			if (detaching) detach_dev(p35);
    			if (detaching) detach_dev(t243);
    			if (detaching) detach_dev(p36);
    			if (detaching) detach_dev(t245);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t251);
    			if (detaching) detach_dev(p37);
    			if (detaching) detach_dev(t254);
    			if (detaching) detach_dev(p38);
    			if (detaching) detach_dev(t256);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t262);
    			if (detaching) detach_dev(p39);
    			if (detaching) detach_dev(t263);
    			if (detaching) detach_dev(h33);
    			if (detaching) detach_dev(t265);
    			if (detaching) detach_dev(p40);
    			if (detaching) detach_dev(t266);
    			if (detaching) detach_dev(p41);
    			if (detaching) detach_dev(t268);
    			if (detaching) detach_dev(h42);
    			if (detaching) detach_dev(t270);
    			if (detaching) detach_dev(p42);
    			if (detaching) detach_dev(t272);
    			if (detaching) detach_dev(h43);
    			if (detaching) detach_dev(t274);
    			if (detaching) detach_dev(p43);
    			if (detaching) detach_dev(t276);
    			if (detaching) detach_dev(h44);
    			if (detaching) detach_dev(t278);
    			if (detaching) detach_dev(p44);
    			if (detaching) detach_dev(t280);
    			if (detaching) detach_dev(h45);
    			if (detaching) detach_dev(t282);
    			if (detaching) detach_dev(p45);
    			if (detaching) detach_dev(t284);
    			if (detaching) detach_dev(h46);
    			if (detaching) detach_dev(t286);
    			if (detaching) detach_dev(p46);
    			if (detaching) detach_dev(t288);
    			if (detaching) detach_dev(h29);
    			if (detaching) detach_dev(t290);
    			if (detaching) detach_dev(span7);
    			if (detaching) detach_dev(t291);
    			if (detaching) detach_dev(h210);
    			if (detaching) detach_dev(t293);
    			if (detaching) detach_dev(p47);
    			if (detaching) detach_dev(t301);
    			if (detaching) detach_dev(p48);
    			if (detaching) detach_dev(t302);
    			if (detaching) detach_dev(h34);
    			if (detaching) detach_dev(t304);
    			if (detaching) detach_dev(p49);
    			if (detaching) detach_dev(t315);
    			if (detaching) detach_dev(p50);
    			if (detaching) detach_dev(t322);
    			if (detaching) detach_dev(p51);
    			if (detaching) detach_dev(t326);
    			if (detaching) detach_dev(p52);
    			if (detaching) detach_dev(t328);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t334);
    			if (detaching) detach_dev(p53);
    			if (detaching) detach_dev(t336);
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t342);
    			if (detaching) detach_dev(p54);
    			if (detaching) detach_dev(t345);
    			if (detaching) detach_dev(p55);
    			if (detaching) detach_dev(t346);
    			if (detaching) detach_dev(p56);
    			if (detaching) detach_dev(t348);
    			if (detaching) detach_dev(ul8);
    			if (detaching) detach_dev(t356);
    			if (detaching) detach_dev(p57);
    			if (detaching) detach_dev(t357);
    			if (detaching) detach_dev(h35);
    			if (detaching) detach_dev(t359);
    			if (detaching) detach_dev(p58);
    			if (detaching) detach_dev(t369);
    			if (detaching) detach_dev(p59);
    			if (detaching) detach_dev(t371);
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t377);
    			if (detaching) detach_dev(p60);
    			if (detaching) detach_dev(t379);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t385);
    			if (detaching) detach_dev(p61);
    			if (detaching) detach_dev(t386);
    			if (detaching) detach_dev(p62);
    			if (detaching) detach_dev(t388);
    			if (detaching) detach_dev(p63);
    			if (detaching) detach_dev(t390);
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t396);
    			if (detaching) detach_dev(p64);
    			if (detaching) detach_dev(t398);
    			if (detaching) detach_dev(h36);
    			if (detaching) detach_dev(t400);
    			if (detaching) detach_dev(p65);
    			if (detaching) detach_dev(t402);
    			if (detaching) detach_dev(ul9);
    			if (detaching) detach_dev(t410);
    			if (detaching) detach_dev(p66);
    			if (detaching) detach_dev(t421);
    			if (detaching) detach_dev(p67);
    			if (detaching) detach_dev(t423);
    			if (detaching) detach_dev(div10);
    			if (detaching) detach_dev(t429);
    			if (detaching) detach_dev(p68);
    			if (detaching) detach_dev(t434);
    			if (detaching) detach_dev(p69);
    			if (detaching) detach_dev(t435);
    			if (detaching) detach_dev(p70);
    			if (detaching) detach_dev(t438);
    			if (detaching) detach_dev(p71);
    			if (detaching) detach_dev(t440);
    			if (detaching) detach_dev(div11);
    			if (detaching) detach_dev(t446);
    			if (detaching) detach_dev(p72);
    			if (detaching) detach_dev(t454);
    			if (detaching) detach_dev(p73);
    			if (detaching) detach_dev(t456);
    			if (detaching) detach_dev(div12);
    			if (detaching) detach_dev(t462);
    			if (detaching) detach_dev(p74);
    			if (detaching) detach_dev(t464);
    			if (detaching) detach_dev(p75);
    			if (detaching) detach_dev(t465);
    			if (detaching) detach_dev(h37);
    			if (detaching) detach_dev(t467);
    			if (detaching) detach_dev(p76);
    			if (detaching) detach_dev(t469);
    			if (detaching) detach_dev(p77);
    			if (detaching) detach_dev(t471);
    			if (detaching) detach_dev(p78);
    			if (detaching) detach_dev(t473);
    			if (detaching) detach_dev(p79);
    			if (detaching) detach_dev(t475);
    			if (detaching) detach_dev(div13);
    			if (detaching) detach_dev(t481);
    			if (detaching) detach_dev(p80);
    			if (detaching) detach_dev(t487);
    			if (detaching) detach_dev(p81);
    			if (detaching) detach_dev(t495);
    			if (detaching) detach_dev(p82);
    			if (detaching) detach_dev(t497);
    			if (detaching) detach_dev(p83);
    			if (detaching) detach_dev(t498);
    			if (detaching) detach_dev(h211);
    			if (detaching) detach_dev(t500);
    			if (detaching) detach_dev(p84);
    			if (detaching) detach_dev(t512);
    			if (detaching) detach_dev(p85);
    			if (detaching) detach_dev(t516);
    			if (detaching) detach_dev(p86);
    			if (detaching) detach_dev(t518);
    			if (detaching) detach_dev(div14);
    			if (detaching) detach_dev(t520);
    			if (detaching) detach_dev(p87);
    			if (detaching) detach_dev(t525);
    			if (detaching) detach_dev(p88);
    			if (detaching) detach_dev(t529);
    			if (detaching) detach_dev(p89);
    			if (detaching) detach_dev(t531);
    			if (detaching) detach_dev(div15);
    			if (detaching) detach_dev(t533);
    			if (detaching) detach_dev(p90);
    			if (detaching) detach_dev(t539);
    			if (detaching) detach_dev(p91);
    			if (detaching) detach_dev(t541);
    			if (detaching) detach_dev(p92);
    			if (detaching) detach_dev(t543);
    			if (detaching) detach_dev(p93);
    			if (detaching) detach_dev(t545);
    			if (detaching) detach_dev(div16);
    			if (detaching) detach_dev(t547);
    			if (detaching) detach_dev(p94);
    			if (detaching) detach_dev(t553);
    			if (detaching) detach_dev(h212);
    			if (detaching) detach_dev(t555);
    			if (detaching) detach_dev(p95);
    			if (detaching) detach_dev(t559);
    			if (detaching) detach_dev(p96);
    			if (detaching) detach_dev(t564);
    			if (detaching) detach_dev(p97);
    			if (detaching) detach_dev(t566);
    			if (detaching) detach_dev(div17);
    			if (detaching) detach_dev(t570);
    			if (detaching) detach_dev(p98);
    			if (detaching) detach_dev(t575);
    			if (detaching) detach_dev(p99);
    			if (detaching) detach_dev(t577);
    			if (detaching) detach_dev(div18);
    			if (detaching) detach_dev(t581);
    			if (detaching) detach_dev(p100);
    			if (detaching) detach_dev(t593);
    			if (detaching) detach_dev(div19);
    			if (detaching) detach_dev(t595);
    			if (detaching) detach_dev(p101);
    			if (detaching) detach_dev(t599);
    			if (detaching) detach_dev(p102);
    			if (detaching) detach_dev(t600);
    			if (detaching) detach_dev(p103);
    			if (detaching) detach_dev(t602);
    			if (detaching) detach_dev(p104);
    			if (detaching) detach_dev(t604);
    			if (detaching) detach_dev(div20);
    			if (detaching) detach_dev(t608);
    			if (detaching) detach_dev(p105);
    			if (detaching) detach_dev(t612);
    			if (detaching) detach_dev(p106);
    			if (detaching) detach_dev(t614);
    			if (detaching) detach_dev(p107);
    			if (detaching) detach_dev(t622);
    			if (detaching) detach_dev(p108);
    			if (detaching) detach_dev(t624);
    			if (detaching) detach_dev(div21);
    			if (detaching) detach_dev(t628);
    			if (detaching) detach_dev(p109);
    			if (detaching) detach_dev(t634);
    			if (detaching) detach_dev(p110);
    			if (detaching) detach_dev(t636);
    			if (detaching) detach_dev(div22);
    			if (detaching) detach_dev(t640);
    			if (detaching) detach_dev(p111);
    			if (detaching) detach_dev(t641);
    			if (detaching) detach_dev(p112);
    			if (detaching) detach_dev(t651);
    			if (detaching) detach_dev(div23);
    			if (detaching) detach_dev(t657);
    			if (detaching) detach_dev(p113);
    			if (detaching) detach_dev(t667);
    			if (detaching) detach_dev(h38);
    			if (detaching) detach_dev(t669);
    			if (detaching) detach_dev(p114);
    			if (detaching) detach_dev(t671);
    			if (detaching) detach_dev(h39);
    			if (detaching) detach_dev(t673);
    			if (detaching) detach_dev(p115);
    			if (detaching) detach_dev(t675);
    			if (detaching) detach_dev(p116);
    			if (detaching) detach_dev(t677);
    			if (detaching) detach_dev(p117);
    			if (detaching) detach_dev(t686);
    			if (detaching) detach_dev(p118);
    			if (detaching) detach_dev(t695);
    			if (detaching) detach_dev(p119);
    			if (detaching) detach_dev(t697);
    			if (detaching) detach_dev(div24);
    			if (detaching) detach_dev(t703);
    			if (detaching) detach_dev(p120);
    			if (detaching) detach_dev(t708);
    			if (detaching) detach_dev(p121);
    			if (detaching) detach_dev(t719);
    			if (detaching) detach_dev(p122);
    			if (detaching) detach_dev(t721);
    			if (detaching) detach_dev(div25);
    			if (detaching) detach_dev(t727);
    			if (detaching) detach_dev(p123);
    			if (detaching) detach_dev(t736);
    			if (detaching) detach_dev(p124);
    			if (detaching) detach_dev(t737);
    			if (detaching) detach_dev(p125);
    			if (detaching) detach_dev(t746);
    			if (detaching) detach_dev(p126);
    			if (detaching) detach_dev(t748);
    			if (detaching) detach_dev(div26);
    			if (detaching) detach_dev(t754);
    			if (detaching) detach_dev(p127);
    			if (detaching) detach_dev(t761);
    			if (detaching) detach_dev(p128);
    			if (detaching) detach_dev(t762);
    			if (detaching) detach_dev(p129);
    			if (detaching) detach_dev(t772);
    			if (detaching) detach_dev(p130);
    			if (detaching) detach_dev(t774);
    			if (detaching) detach_dev(div27);
    			if (detaching) detach_dev(t776);
    			if (detaching) detach_dev(p131);
    			if (detaching) detach_dev(t783);
    			if (detaching) detach_dev(p132);
    			if (detaching) detach_dev(t785);
    			if (detaching) detach_dev(div28);
    			if (detaching) detach_dev(t791);
    			if (detaching) detach_dev(p133);
    			if (detaching) detach_dev(t796);
    			if (detaching) detach_dev(p134);
    			if (detaching) detach_dev(t798);
    			if (detaching) detach_dev(div29);
    			if (detaching) detach_dev(t804);
    			if (detaching) detach_dev(p135);
    			if (detaching) detach_dev(t812);
    			if (detaching) detach_dev(p136);
    			if (detaching) detach_dev(t813);
    			if (detaching) detach_dev(p137);
    			if (detaching) detach_dev(t814);
    			if (detaching) detach_dev(span8);
    			if (detaching) detach_dev(t815);
    			if (detaching) detach_dev(span9);
    			if (detaching) detach_dev(t816);
    			if (detaching) detach_dev(h213);
    			if (detaching) detach_dev(t818);
    			if (detaching) detach_dev(h214);
    			if (detaching) detach_dev(t820);
    			if (detaching) detach_dev(ul10);
    			if (detaching) detach_dev(t836);
    			if (detaching) detach_dev(ul11);
    			if (detaching) detach_dev(t838);
    			if (detaching) detach_dev(ul12);
    			if (detaching) detach_dev(t844);
    			if (detaching) detach_dev(ul13);
    			if (detaching) detach_dev(t846);
    			if (detaching) detach_dev(ul14);
    			if (detaching) detach_dev(t848);
    			if (detaching) detach_dev(ul15);
    			if (detaching) detach_dev(t850);
    			if (detaching) detach_dev(ul16);
    			if (detaching) detach_dev(t852);
    			if (detaching) detach_dev(ul17);
    			if (detaching) detach_dev(t854);
    			if (detaching) detach_dev(ul18);
    			if (detaching) detach_dev(t858);
    			if (detaching) detach_dev(pre75);
    			if (detaching) detach_dev(t860);
    			if (detaching) detach_dev(p149);
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

    // (25:2) {:else}
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
    		source: "(25:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:2) {#if activeLanguage === "Turkish"}
    function create_if_block$1(ctx) {
    	let docs;
    	let current;
    	docs = new Documentation({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(docs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(docs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(docs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(docs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(docs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(21:2) {#if activeLanguage === \\\"Turkish\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeLanguage*/ ctx[0] === "Turkish") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "container svelte-1batbae");
    			add_location(main, file$2, 19, 0, 477);
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
    	let activeLanguage = "Turkish";
    	let { Turkish, English } = Headers;

    	const switchLanguages = language => {
    		$$invalidate(0, activeLanguage = language);
    	};

    	let svelteLogo = "/assets/svelte-logo.png";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Docs: Documentation,
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
    		if ('languages' in $$props) languages = $$props.languages;
    		if ('activeLanguage' in $$props) $$invalidate(0, activeLanguage = $$props.activeLanguage);
    		if ('Turkish' in $$props) Turkish = $$props.Turkish;
    		if ('English' in $$props) English = $$props.English;
    		if ('svelteLogo' in $$props) svelteLogo = $$props.svelteLogo;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeLanguage];
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
