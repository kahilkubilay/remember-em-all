
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
    const file$U = "src\\components\\Playground\\Cards\\CardBack.svelte";

    function create_fragment$W(ctx) {
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
    			attr_dev(img, "class", "single-poke svelte-1ugukui");
    			attr_dev(img, "alt", "card back on the playing field");
    			add_location(img, file$U, 9, 2, 215);
    			attr_dev(div, "class", "back svelte-1ugukui");
    			add_location(div, file$U, 8, 0, 146);
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
    		id: create_fragment$W.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$W($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$W, create_fragment$W, safe_not_equal, { pokemon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardBack",
    			options,
    			id: create_fragment$W.name
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

    const file$T = "src\\components\\Playground\\Cards\\CardFront.svelte";

    function create_fragment$V(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + /*pokemonId*/ ctx[0] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "card front on the playing field");
    			attr_dev(img, "class", "single-poke svelte-1u0ypxx");
    			attr_dev(img, "pokemondetail", /*pokemonId*/ ctx[0]);
    			add_location(img, file$T, 7, 2, 101);
    			attr_dev(div, "class", "front svelte-1u0ypxx");
    			add_location(div, file$T, 6, 0, 78);
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
    		id: create_fragment$V.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$V($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$V, create_fragment$V, safe_not_equal, { pokemon: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardFront",
    			options,
    			id: create_fragment$V.name
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

    const file$S = "src\\components\\Playground\\Cards\\Card.svelte";

    function create_fragment$U(ctx) {
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
    			add_location(div, file$S, 47, 2, 1266);
    			attr_dev(main, "class", "flip-container svelte-43yf2a");
    			add_location(main, file$S, 46, 0, 1233);
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
    		id: create_fragment$U.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$U($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$U, create_fragment$U, safe_not_equal, { pokemon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$U.name
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
    const file$R = "src\\components\\User\\name\\UserName.svelte";

    function create_fragment$T(ctx) {
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
    			attr_dev(input, "class", "name svelte-mw4v2h");
    			add_location(input, file$R, 7, 2, 128);
    			attr_dev(div, "class", "user");
    			add_location(div, file$R, 6, 0, 106);
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
    		id: create_fragment$T.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$T($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$T, create_fragment$T, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserName",
    			options,
    			id: create_fragment$T.name
    		});
    	}
    }

    /* src\components\User\Header.svelte generated by Svelte v3.48.0 */

    const file$Q = "src\\components\\User\\Header.svelte";

    function create_fragment$S(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "select your best pokemon and start catching!";
    			add_location(h2, file$Q, 1, 2, 24);
    			attr_dev(div, "class", "header svelte-1tuqxk");
    			add_location(div, file$Q, 0, 0, 0);
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
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$S($$self, $$props) {
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
    		init(this, options, instance$S, create_fragment$S, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$S.name
    		});
    	}
    }

    /* src\components\User\Avatar\ImageAvatar.svelte generated by Svelte v3.48.0 */
    const file$P = "src\\components\\User\\Avatar\\ImageAvatar.svelte";

    function create_fragment$R(ctx) {
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
    			add_location(img, file$P, 10, 0, 209);
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
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$R, create_fragment$R, safe_not_equal, { userSelectAvatar: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageAvatar",
    			options,
    			id: create_fragment$R.name
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
    const file$O = "src\\components\\User\\Avatar\\Avatars.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (15:2) {#each avatars as userSelectAvatar}
    function create_each_block$5(ctx) {
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
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(15:2) {#each avatars as userSelectAvatar}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Q(ctx) {
    	let div;
    	let current;
    	let each_value = /*avatars*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
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

    			attr_dev(div, "class", "avatars svelte-1reegf8");
    			add_location(div, file$O, 13, 0, 327);
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
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Avatars', slots, []);
    	let sabuha = "images/sabuha.jpg";
    	let mohito = "images/mohito.jpg";
    	let pasa = "images/pasa.jpg";
    	let susi = "images/susi.jpg";
    	let limon = "images/limon.jpg";
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
    		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avatars",
    			options,
    			id: create_fragment$Q.name
    		});
    	}
    }

    /* src\components\User\Start.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$N = "src\\components\\User\\Start.svelte";

    function create_fragment$P(ctx) {
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
    			add_location(button, file$N, 27, 2, 504);
    			attr_dev(span0, "class", "unvisible svelte-j6c731");
    			toggle_class(span0, "visible", /*$avatar*/ ctx[3] === "" && /*isAvatarEmpty*/ ctx[0]);
    			add_location(span0, file$N, 29, 4, 590);
    			attr_dev(div0, "class", "avatarError visible svelte-j6c731");
    			add_location(div0, file$N, 28, 2, 551);
    			attr_dev(span1, "class", "unvisible svelte-j6c731");
    			toggle_class(span1, "visible", /*$name*/ ctx[2] === "" && /*isNameEmpty*/ ctx[1]);
    			add_location(span1, file$N, 34, 4, 759);
    			attr_dev(div1, "class", "nameError visible svelte-j6c731");
    			add_location(div1, file$N, 33, 2, 722);
    			attr_dev(div2, "class", "start svelte-j6c731");
    			add_location(div2, file$N, 26, 0, 481);
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
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$P, create_fragment$P, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Start",
    			options,
    			id: create_fragment$P.name
    		});
    	}
    }

    /* src\components\User\UserGround.svelte generated by Svelte v3.48.0 */
    const file$M = "src\\components\\User\\UserGround.svelte";

    function create_fragment$O(ctx) {
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
    			attr_dev(main, "class", "svelte-2vpry5");
    			add_location(main, file$M, 6, 0, 203);
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
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$O, create_fragment$O, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserGround",
    			options,
    			id: create_fragment$O.name
    		});
    	}
    }

    /* src\components\GameElements\Score.svelte generated by Svelte v3.48.0 */
    const file$L = "src\\components\\GameElements\\Score.svelte";

    function create_fragment$N(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("score: ");
    			t1 = text(/*$score*/ ctx[0]);
    			attr_dev(p, "class", "svelte-15spofw");
    			add_location(p, file$L, 3, 0, 75);
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
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Score",
    			options,
    			id: create_fragment$N.name
    		});
    	}
    }

    /* src\components\GameElements\Level.svelte generated by Svelte v3.48.0 */
    const file$K = "src\\components\\GameElements\\Level.svelte";

    function create_fragment$M(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("level: ");
    			t1 = text(/*$level*/ ctx[0]);
    			attr_dev(p, "class", "svelte-15spofw");
    			add_location(p, file$K, 3, 0, 75);
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
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$M.name
    		});
    	}
    }

    /* src\components\User\name\UserSelectName.svelte generated by Svelte v3.48.0 */
    const file$J = "src\\components\\User\\name\\UserSelectName.svelte";

    function create_fragment$L(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*$name*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-5vegqh");
    			add_location(h3, file$J, 4, 0, 108);
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
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSelectName",
    			options,
    			id: create_fragment$L.name
    		});
    	}
    }

    /* src\components\User\Avatar\UserSelectAvatar.svelte generated by Svelte v3.48.0 */
    const file$I = "src\\components\\User\\Avatar\\UserSelectAvatar.svelte";

    function create_fragment$K(ctx) {
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
    			add_location(image, file$I, 20, 6, 832);
    			attr_dev(pattern, "id", "image");
    			attr_dev(pattern, "patternUnits", "userSpaceOnUse");
    			attr_dev(pattern, "height", "150");
    			attr_dev(pattern, "width", "150");
    			add_location(pattern, file$I, 19, 4, 749);
    			add_location(defs, file$I, 18, 2, 737);
    			attr_dev(circle, "id", "top");
    			attr_dev(circle, "cx", "75");
    			attr_dev(circle, "cy", "60");
    			attr_dev(circle, "r", "50");
    			attr_dev(circle, "fill", "url(#image)");
    			attr_dev(circle, "stroke", "#6a0dad");
    			attr_dev(circle, "stroke-width", "8");
    			add_location(circle, file$I, 23, 2, 932);
    			attr_dev(svg, "width", "150");
    			attr_dev(svg, "height", "120");
    			attr_dev(svg, "stroke-dashoffset", /*scoreDegree*/ ctx[0]);
    			attr_dev(svg, "class", "svelte-1cs56u2");
    			add_location(svg, file$I, 17, 0, 671);
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
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSelectAvatar",
    			options,
    			id: create_fragment$K.name
    		});
    	}
    }

    /* src\components\User\UserDetail.svelte generated by Svelte v3.48.0 */
    const file$H = "src\\components\\User\\UserDetail.svelte";

    function create_fragment$J(ctx) {
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
    			add_location(main, file$H, 6, 0, 249);
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
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserDetail",
    			options,
    			id: create_fragment$J.name
    		});
    	}
    }

    /* src\components\GameAction\MixCards.svelte generated by Svelte v3.48.0 */

    const shuffle = pokemonList => {
    	let shakeList = [];
    	const duplicateList = pokemonList.concat(pokemonList);
    	const totalNumberRange = duplicateList.length - 1;

    	for (let counter = 0; counter <= totalNumberRange; counter++) {
    		let pokemonNo = counter;
    		const randomNumb = Math.trunc(Math.random() * duplicateList.length);

    		shakeList = [
    			{
    				no: pokemonNo,
    				id: duplicateList[randomNumb]
    			},
    			...shakeList
    		];

    		duplicateList.splice(duplicateList.indexOf(duplicateList[randomNumb]), 1);
    	}

    	return shakeList;
    };

    /* src\components\GameAction\ListCards.svelte generated by Svelte v3.48.0 */

    const list = level => {
    	const list = [];
    	const range = 5;
    	const maxNumberReachedOnRange = level * range;
    	let minNumberReachedOnRange = maxNumberReachedOnRange - 4;

    	for (minNumberReachedOnRange; minNumberReachedOnRange <= maxNumberReachedOnRange; minNumberReachedOnRange++) {
    		list.push(minNumberReachedOnRange);
    	}

    	return list;
    };

    /* src\components\Playground\Wrapper\Playground.svelte generated by Svelte v3.48.0 */
    const file$G = "src\\components\\Playground\\Wrapper\\Playground.svelte";

    function get_each_context$4(ctx, list, i) {
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
    function create_if_block$3(ctx) {
    	let t;
    	let userdetail;
    	let current;
    	let each_value = /*mixedListOfPokemon*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
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
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(16:2) {#if $isStart}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#each mixedListOfPokemon as pokemon}
    function create_each_block$4(ctx) {
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(17:4) {#each mixedListOfPokemon as pokemon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$I(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
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
    			attr_dev(main, "class", "playground svelte-1a0woco");
    			add_location(main, file$G, 14, 0, 525);
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
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playground",
    			options,
    			id: create_fragment$I.name
    		});
    	}
    }

    /* src\components\Docs\Section\Templates\Header.svelte generated by Svelte v3.48.0 */

    const file$F = "src\\components\\Docs\\Section\\Templates\\Header.svelte";

    function create_fragment$H(ctx) {
    	let h2;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text("🪁 ");
    			t1 = text(/*head*/ ctx[0]);
    			attr_dev(h2, "class", "svelte-n05nzj");
    			add_location(h2, file$F, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*head*/ 1) set_data_dev(t1, /*head*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { head } = $$props;
    	const writable_props = ['head'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('head' in $$props) $$invalidate(0, head = $$props.head);
    	};

    	$$self.$capture_state = () => ({ head });

    	$$self.$inject_state = $$props => {
    		if ('head' in $$props) $$invalidate(0, head = $$props.head);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [head];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, { head: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$H.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*head*/ ctx[0] === undefined && !('head' in props)) {
    			console.warn("<Header> was created without expected prop 'head'");
    		}
    	}

    	get head() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\Paragraph.svelte generated by Svelte v3.48.0 */

    const file$E = "src\\components\\Docs\\Section\\Templates\\Paragraph.svelte";

    function create_fragment$G(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${/*textData*/ ctx[0]}`;
    			attr_dev(p, "class", "svelte-olhbkk");
    			add_location(p, file$E, 6, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Paragraph', slots, []);
    	let { text } = $$props;
    	const textData = text;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Paragraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text, textData });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [textData, text];
    }

    class Paragraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, { text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paragraph",
    			options,
    			id: create_fragment$G.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<Paragraph> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Paragraph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Paragraph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\Image.svelte generated by Svelte v3.48.0 */

    const file$D = "src\\components\\Docs\\Section\\Templates\\Image.svelte";

    function create_fragment$F(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alternativeText*/ ctx[1]);
    			attr_dev(img, "title", /*alternativeText*/ ctx[1]);
    			attr_dev(img, "class", "svelte-t1d6bn");
    			add_location(img, file$D, 5, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, { image: 0, alternativeText: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$F.name
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

    /* src\components\Docs\Section\Templates\AccessArticle.svelte generated by Svelte v3.48.0 */

    const file$C = "src\\components\\Docs\\Section\\Templates\\AccessArticle.svelte";

    function create_fragment$E(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "id", /*link*/ ctx[0]);
    			add_location(span, file$C, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*link*/ 1) {
    				attr_dev(span, "id", /*link*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AccessArticle', slots, []);
    	let { link } = $$props;
    	const writable_props = ['link'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AccessArticle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('link' in $$props) $$invalidate(0, link = $$props.link);
    	};

    	$$self.$capture_state = () => ({ link });

    	$$self.$inject_state = $$props => {
    		if ('link' in $$props) $$invalidate(0, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [link];
    }

    class AccessArticle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, { link: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AccessArticle",
    			options,
    			id: create_fragment$E.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*link*/ ctx[0] === undefined && !('link' in props)) {
    			console.warn("<AccessArticle> was created without expected prop 'link'");
    		}
    	}

    	get link() {
    		throw new Error("<AccessArticle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<AccessArticle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\AboutGame.svelte generated by Svelte v3.48.0 */
    const file$B = "src\\components\\Docs\\AboutGame.svelte";

    function create_fragment$D(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let image;
    	let t3;
    	let paragraph1;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(image.$$.fragment);
    			t3 = space();
    			create_component(paragraph1.$$.fragment);
    			add_location(article_1, file$B, 30, 0, 1614);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(image, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph1, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(image);
    			destroy_component(paragraph1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AboutGame', slots, []);

    	const article = {
    		head: `Oyun hakkında`,
    		description: `Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcının 
    seviyesine göre arayüz üzerinde farklı kartlar bulunacak. Kartlara click 
    eventi gerçekleştiğinde kartlar açılacak, kullanıcı açılan kartları 
    eşleştirmeye çalışacak. Eşleşen kartlar açık bir şekilde arayüz üzerinde 
    dururken başarılı eşleşme sonucunda kullanıcıya puan kazandıracak, başarısız
    her eşleşmede kartlar bulundukları yerde yeniden kapatılacaklar. Bütün 
    kartlar eşleştiklerinde, bir sonraki seviyede yer alan kartlar arayüze 
    kapalı olarak yeniden gelecektir.`,
    		otherDescription: `Oyun başlangıcında kullanıcıdan bir kullanıcı adı 
      girmesi, avatar listesinde yer alan görsellerden birini seçmesi 
      beklenecektir (Avatarlar ne kadar evcil gözükseler de, güç içlerinde 
      gizli 🐱‍👤). Bu seçilen değerler oyunun arayüzünde kartların yer aldığı 
      bölümün altında _score & level_ değerleri ile birlikte gösterilecektir. 
      Kullanıcı adı ve seçilen avatar stabil değerler olarak tutulurken, 
      _score & level_ değerleri dinamik olarak kullanıcı davranışına göre 
      güncellenecektir.`,
    		image: `assets/documentation/playground.png`,
    		alternativeText: `view of cards on the playground`,
    		id: "about-game"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AboutGame> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class AboutGame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AboutGame",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src\components\Docs\Section\Templates\SubHeader.svelte generated by Svelte v3.48.0 */

    const file$A = "src\\components\\Docs\\Section\\Templates\\SubHeader.svelte";

    function create_fragment$C(ctx) {
    	let h3;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("🪁 ");
    			t1 = text(/*head*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-yw2at0");
    			add_location(h3, file$A, 4, 0, 43);
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
    			if (dirty & /*head*/ 1) set_data_dev(t1, /*head*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SubHeader', slots, []);
    	let { head } = $$props;
    	const writable_props = ['head'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SubHeader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('head' in $$props) $$invalidate(0, head = $$props.head);
    	};

    	$$self.$capture_state = () => ({ head });

    	$$self.$inject_state = $$props => {
    		if ('head' in $$props) $$invalidate(0, head = $$props.head);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [head];
    }

    class SubHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, { head: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubHeader",
    			options,
    			id: create_fragment$C.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*head*/ ctx[0] === undefined && !('head' in props)) {
    			console.warn("<SubHeader> was created without expected prop 'head'");
    		}
    	}

    	get head() {
    		throw new Error("<SubHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<SubHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\FileTitle.svelte generated by Svelte v3.48.0 */

    const file$z = "src\\components\\Docs\\Section\\Templates\\FileTitle.svelte";

    function create_fragment$B(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(/*title*/ ctx[0]);
    			add_location(i, file$z, 4, 0, 44);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			append_dev(i, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileTitle', slots, []);
    	let { title } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title];
    }

    class FileTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileTitle",
    			options,
    			id: create_fragment$B.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<FileTitle> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<FileTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<FileTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
    const file$y = "node_modules\\svelte-prism\\src\\Prism.svelte";

    // (32:45) {:else}
    function create_else_block(ctx) {
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
    		id: create_else_block.name,
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

    function create_fragment$A(ctx) {
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
    		return create_else_block;
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
    			add_location(code0, file$y, 26, 0, 727);
    			attr_dev(code1, "class", code1_class_value = "language-" + /*language*/ ctx[0]);
    			add_location(code1, file$y, 30, 65, 860);
    			attr_dev(pre, "class", pre_class_value = "language-" + /*language*/ ctx[0]);
    			attr_dev(pre, "command-line", "");
    			attr_dev(pre, "data-output", "2-17");
    			add_location(pre, file$y, 30, 0, 795);
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
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const prism = prism$1;
    const highlight = prism$1.highlightElement;
    const globalConfig = { transform: x => x };

    function instance$A($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { language: 0, source: 3, transform: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prism",
    			options,
    			id: create_fragment$A.name
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

    /* src\components\Docs\Section\Templates\CodeDescription\CodeSyntax.svelte generated by Svelte v3.48.0 */

    function create_fragment$z(ctx) {
    	let filetitle;
    	let t;
    	let prism;
    	let current;

    	filetitle = new FileTitle({
    			props: { title: /*title*/ ctx[1] },
    			$$inline: true
    		});

    	prism = new Prism$1({
    			props: {
    				language: "svelte",
    				source: /*code*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(filetitle.$$.fragment);
    			t = space();
    			create_component(prism.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(filetitle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(prism, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const filetitle_changes = {};
    			if (dirty & /*title*/ 2) filetitle_changes.title = /*title*/ ctx[1];
    			filetitle.$set(filetitle_changes);
    			const prism_changes = {};
    			if (dirty & /*code*/ 1) prism_changes.source = /*code*/ ctx[0];
    			prism.$set(prism_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filetitle.$$.fragment, local);
    			transition_in(prism.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filetitle.$$.fragment, local);
    			transition_out(prism.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filetitle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(prism, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CodeSyntax', slots, []);
    	let { code } = $$props;
    	let { title } = $$props;
    	const writable_props = ['code', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CodeSyntax> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('code' in $$props) $$invalidate(0, code = $$props.code);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ FileTitle, Prism: Prism$1, code, title });

    	$$self.$inject_state = $$props => {
    		if ('code' in $$props) $$invalidate(0, code = $$props.code);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [code, title];
    }

    class CodeSyntax extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { code: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CodeSyntax",
    			options,
    			id: create_fragment$z.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*code*/ ctx[0] === undefined && !('code' in props)) {
    			console.warn("<CodeSyntax> was created without expected prop 'code'");
    		}

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<CodeSyntax> was created without expected prop 'title'");
    		}
    	}

    	get code() {
    		throw new Error("<CodeSyntax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error("<CodeSyntax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<CodeSyntax>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CodeSyntax>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Section\Templates\Matter.svelte generated by Svelte v3.48.0 */

    const file$x = "src\\components\\Docs\\Section\\Templates\\Matter.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each matter as item}
    function create_each_block$3(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*item*/ ctx[1] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("🎈 ");
    			t1 = text(t1_value);
    			add_location(li, file$x, 6, 4, 81);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*matter*/ 1 && t1_value !== (t1_value = /*item*/ ctx[1] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(6:2) {#each matter as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let ul;
    	let each_value = /*matter*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$x, 4, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*matter*/ 1) {
    				each_value = /*matter*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Matter', slots, []);
    	let { matter } = $$props;
    	const writable_props = ['matter'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Matter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('matter' in $$props) $$invalidate(0, matter = $$props.matter);
    	};

    	$$self.$capture_state = () => ({ matter });

    	$$self.$inject_state = $$props => {
    		if ('matter' in $$props) $$invalidate(0, matter = $$props.matter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [matter];
    }

    class Matter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { matter: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Matter",
    			options,
    			id: create_fragment$y.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*matter*/ ctx[0] === undefined && !('matter' in props)) {
    			console.warn("<Matter> was created without expected prop 'matter'");
    		}
    	}

    	get matter() {
    		throw new Error("<Matter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set matter(value) {
    		throw new Error("<Matter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\AvatarComponent.svelte generated by Svelte v3.48.0 */
    const file$w = "src\\components\\Docs\\AvatarComponent.svelte";

    function create_fragment$x(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let subheader;
    	let t1;
    	let paragraph0;
    	let t2;
    	let matter;
    	let t3;
    	let paragraph1;
    	let t4;
    	let codesyntax0;
    	let t5;
    	let paragraph2;
    	let t6;
    	let image0;
    	let t7;
    	let paragraph3;
    	let t8;
    	let codesyntax1;
    	let t9;
    	let paragraph4;
    	let t10;
    	let codesyntax2;
    	let t11;
    	let paragraph5;
    	let t12;
    	let image1;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	subheader = new SubHeader({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	matter = new Matter({
    			props: { matter: /*article*/ ctx[0].material },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[4]
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	image0 = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: { text: /*article*/ ctx[0].moreDescription },
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*otherCode*/ ctx[2],
    				title: /*otherTitle*/ ctx[5]
    			},
    			$$inline: true
    		});

    	paragraph4 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].oneMoreDescription
    			},
    			$$inline: true
    		});

    	codesyntax2 = new CodeSyntax({
    			props: {
    				code: /*moreCode*/ ctx[3],
    				title: /*moreTitle*/ ctx[6]
    			},
    			$$inline: true
    		});

    	paragraph5 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].oneAnotherMoreDescription
    			},
    			$$inline: true
    		});

    	image1 = new Image({
    			props: {
    				image: /*article*/ ctx[0].anotherImage,
    				alternativeText: /*article*/ ctx[0].anotherAlternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(subheader.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(matter.$$.fragment);
    			t3 = space();
    			create_component(paragraph1.$$.fragment);
    			t4 = space();
    			create_component(codesyntax0.$$.fragment);
    			t5 = space();
    			create_component(paragraph2.$$.fragment);
    			t6 = space();
    			create_component(image0.$$.fragment);
    			t7 = space();
    			create_component(paragraph3.$$.fragment);
    			t8 = space();
    			create_component(codesyntax1.$$.fragment);
    			t9 = space();
    			create_component(paragraph4.$$.fragment);
    			t10 = space();
    			create_component(codesyntax2.$$.fragment);
    			t11 = space();
    			create_component(paragraph5.$$.fragment);
    			t12 = space();
    			create_component(image1.$$.fragment);
    			add_location(article_1, file$w, 126, 0, 4053);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(subheader, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(matter, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(image0, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t8);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t9);
    			mount_component(paragraph4, article_1, null);
    			append_dev(article_1, t10);
    			mount_component(codesyntax2, article_1, null);
    			append_dev(article_1, t11);
    			mount_component(paragraph5, article_1, null);
    			append_dev(article_1, t12);
    			mount_component(image1, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(subheader.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(matter.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(image0.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(paragraph4.$$.fragment, local);
    			transition_in(codesyntax2.$$.fragment, local);
    			transition_in(paragraph5.$$.fragment, local);
    			transition_in(image1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(subheader.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(matter.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(image0.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(paragraph4.$$.fragment, local);
    			transition_out(codesyntax2.$$.fragment, local);
    			transition_out(paragraph5.$$.fragment, local);
    			transition_out(image1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(subheader);
    			destroy_component(paragraph0);
    			destroy_component(matter);
    			destroy_component(paragraph1);
    			destroy_component(codesyntax0);
    			destroy_component(paragraph2);
    			destroy_component(image0);
    			destroy_component(paragraph3);
    			destroy_component(codesyntax1);
    			destroy_component(paragraph4);
    			destroy_component(codesyntax2);
    			destroy_component(paragraph5);
    			destroy_component(image1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AvatarComponent', slots, []);

    	const article = {
    		head: `Avatar Component`,
    		description: `Bu Component içerisinde birden fazla bileşene ihtiyaç duyduğu
      için, bir klasör oluşturarak bütün gereksinim duyduğu yapıları klasör 
      içerisinde tanımlayalım.`,
    		otherDescription: `_Avatars.svelte_ _Userground.svelte_ içerisinde 
      çağıralım. _Avatars.svelte_, _ImageAvatar.svelte_ bir kapsayıcı görevi 
      görecek. Bununla birlikte _ImageAvatar.svelte_ componentine data 
      gönderecek.`,
    		anotherDescription: `_Avatars_, _Userground_ üzerinde çağırdığımda karşıma 
      bu iki güzellik gelecek.`,
    		moreDescription: `_Avatars_ biraz daha işlevli bir yapıya dönüştürelim.`, //💩
    		oneMoreDescription: `Oluşturduğumuz 'avatars' dizisine ait her elemana 
      _html_ üzerinde #each döngüsünde erişiyoruz. Erişilen her elemanının 
      bilgisini _ImageAvatar_ componentine aktarıyoruz. Componente aktarılan bu
      değerlerle birlikte, dizi içerisinde bulunan her elamanın görüntüsünü elde
      edeceğiz.`, //💩
    		oneAnotherMoreDescription: `Daha güzel bir görüntüyü hak ettik. Avatarlar 
      üzerinde CSS ile biraz düzenlemeler yapmamız gerekti.`, //💩
    		material: [
    			`Avatar/`,
    			`+ User > Avatar > Avatars.svelte, ImageAvatar.svelte`,
    			`+ public > assets > images > pasa.jpg, sabuha.jpg, mohito.jpg, limon.jpg,
        susi.jpg`,
    			`[images](https://github.com/kahilkubilay/remember-em-all/tree/master/public/images "Images link")`
    		],
    		image: `assets/components/User/avatars-component.png`,
    		anotherImage: `assets/components/User/user-component-end.png`,
    		alternativeText: `call Avatar Component`,
    		anotherAlternativeText: `call User Component`,
    		id: "avatar-component"
    	};

    	const code = `
    <script>
      // avatar list
      let sabuha = "/asset/images/sabuha.jpg";
      let pasa = "/asset/images/pasa.jpg";  
    <\/script>

    <div class="avatars">
      <img src={sabuha} alt="" />
      <img src={pasa} alt="" />
    </div>

    <style>
      img {
        width: 100px;
      }
    </style>
  `;

    	const otherCode = `
    <script>
      import ImageAvatar from "./ImageAvatar.svelte";

      // avatar list
        let sabuha = "/asset/images/sabuha.jpg";
        let mohito = "/asset/images/mohito.jpg";
        let pasa = "/asset/images/pasa.jpg";
        let susi = "/asset/images/susi.jpg";
        let limon = "/asset/images/limon.jpg";

        const avatars = [pasa, mohito, sabuha, limon, susi];
    <\/script>

    <div class="avatars">
      {#each avatars as userAvatar}
        <ImageAvatar {userAvatar} />
      {/each}
    </div>

    <style>
      .avatars {
        display: flex;
        justify-content: center;
      }
    </style>
  `;

    	const moreCode = `
    <script>
      export let userAvatar;
    <\/script>

    <img src={avatar} class="avatar unpicked" alt="avatar" />

    <style>
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
    </style>
  `; // 💩

    	const title = `User > Avatar > Avatars.svelte`;
    	const otherTitle = `User > Avatar > Avatars.svelte`;
    	const moreTitle = `User > Avatar > ImageAvatar.svelte`; // 💩
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AvatarComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SubHeader,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		Matter,
    		article,
    		code,
    		otherCode,
    		moreCode,
    		title,
    		otherTitle,
    		moreTitle
    	});

    	return [article, code, otherCode, moreCode, title, otherTitle, moreTitle];
    }

    class AvatarComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AvatarComponent",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* src\components\Docs\Section\Templates\List.svelte generated by Svelte v3.48.0 */

    const file$v = "src\\components\\Docs\\Section\\Templates\\List.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (5:0) {#if material !== "" && material !== undefined}
    function create_if_block$1(ctx) {
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

    			add_location(ul, file$v, 5, 2, 98);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(5:0) {#if material !== \\\"\\\" && material !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (7:4) {#each material as matter}
    function create_each_block$2(ctx) {
    	let li0;
    	let t0_value = /*matter*/ ctx[1].command + "";
    	let t0;
    	let t1;
    	let ul;
    	let li1;
    	let t2_value = /*matter*/ ctx[1].description + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			ul = element("ul");
    			li1 = element("li");
    			t2 = text(t2_value);
    			t3 = space();
    			add_location(li0, file$v, 7, 6, 142);
    			add_location(li1, file$v, 9, 8, 189);
    			add_location(ul, file$v, 8, 6, 175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li1);
    			append_dev(li1, t2);
    			append_dev(ul, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*material*/ 1 && t0_value !== (t0_value = /*matter*/ ctx[1].command + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*material*/ 1 && t2_value !== (t2_value = /*matter*/ ctx[1].description + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
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

    function create_fragment$w(ctx) {
    	let if_block_anchor;
    	let if_block = /*material*/ ctx[0] !== "" && /*material*/ ctx[0] !== undefined && create_if_block$1(ctx);

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
    					if_block = create_if_block$1(ctx);
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
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { material: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$w.name
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

    /* src\components\Docs\BasicTerms.svelte generated by Svelte v3.48.0 */
    const file$u = "src\\components\\Docs\\BasicTerms.svelte";

    function create_fragment$v(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph;
    	let t2;
    	let list;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	list = new List({
    			props: { material: /*article*/ ctx[0].terms },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			t2 = space();
    			create_component(list.$$.fragment);
    			add_location(article_1, file$u, 45, 0, 1478);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(list, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph);
    			destroy_component(list);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BasicTerms', slots, []);

    	const article = {
    		head: `Basit ifadeler`,
    		description: `Bazı bölümlerde aynı kelimeleri tekrar etmemek için, bazı 
      kısayol ifadeleri kullandım(tamamen salladım). Sayısı çok fazla değil, 
      sorun yaşayacağını düşünmüyorum.`,
    		terms: [
    			{
    				command: `_Playground_`,
    				description: `Playground.svelte Component`
    			},
    			{
    				command: `+ User.svelte`,
    				description: `_User.svelte_ dosyası oluşturuldu.`
    			},
    			{
    				command: `Avatar/`,
    				description: `_Avatar_ klasörü oluşturuldu.`
    			},
    			{
    				command: `+ User.svelte + Header.svelte + Avatars.svelte`,
    				description: `_User.svelte, Header.svelte, Avatars.svelte_ dosyaları 
          oluşturuldu.`
    			},
    			{
    				command: `+ User > Avatar.svelte`,
    				description: `_User_ klasörü içerisinde _Avatar.svelte_ dosyası 
          oluşturuldu.`
    			},
    			{
    				command: `+ public > assets > images > pasa.jpg, sabuha.jpg`,
    				description: `_public > assets > images_ klasörü içerisinde _pasa.jpg_,
          _sabuha.jpg_ dosyaları oluşturuldu.`
    			}
    		],
    		id: "basic-terms"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BasicTerms> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		AccessArticle,
    		List,
    		article
    	});

    	return [article];
    }

    class BasicTerms extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BasicTerms",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src\components\Docs\CardComponent.svelte generated by Svelte v3.48.0 */
    const file$t = "src\\components\\Docs\\CardComponent.svelte";

    function create_fragment$u(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let subheader;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let t3;
    	let paragraph2;
    	let t4;
    	let codesyntax0;
    	let t5;
    	let paragraph3;
    	let t6;
    	let paragraph4;
    	let t7;
    	let codesyntax1;
    	let t8;
    	let paragraph5;
    	let t9;
    	let image0;
    	let t10;
    	let paragraph6;
    	let t11;
    	let codesyntax2;
    	let t12;
    	let paragraph7;
    	let t13;
    	let image1;
    	let t14;
    	let paragraph8;
    	let t15;
    	let codesyntax3;
    	let t16;
    	let paragraph9;
    	let t17;
    	let codesyntax4;
    	let t18;
    	let paragraph10;
    	let t19;
    	let codesyntax5;
    	let t20;
    	let paragraph11;
    	let t21;
    	let image2;
    	let t22;
    	let image3;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	subheader = new SubHeader({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].oneLineDescription
    			},
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[7]
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	paragraph4 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anAnotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*otherCode*/ ctx[2],
    				title: /*otherTitle*/ ctx[8]
    			},
    			$$inline: true
    		});

    	paragraph5 = new Paragraph({
    			props: { text: /*article*/ ctx[0].descriptionCode },
    			$$inline: true
    		});

    	image0 = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph6 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].moreAnotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax2 = new CodeSyntax({
    			props: {
    				code: /*anotherOneMoreCode*/ ctx[4],
    				title: /*otherTitle*/ ctx[8]
    			},
    			$$inline: true
    		});

    	paragraph7 = new Paragraph({
    			props: { text: /*article*/ ctx[0].codeExplanation },
    			$$inline: true
    		});

    	image1 = new Image({
    			props: {
    				image: /*article*/ ctx[0].anotherImage,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph8 = new Paragraph({
    			props: { text: /*article*/ ctx[0].moreDescription },
    			$$inline: true
    		});

    	codesyntax3 = new CodeSyntax({
    			props: {
    				code: /*oneMoreCode*/ ctx[3],
    				title: /*oneMoreTitle*/ ctx[9]
    			},
    			$$inline: true
    		});

    	paragraph9 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherCodeExplanation
    			},
    			$$inline: true
    		});

    	codesyntax4 = new CodeSyntax({
    			props: {
    				code: /*moreCode*/ ctx[5],
    				title: /*otherTitle*/ ctx[8]
    			},
    			$$inline: true
    		});

    	paragraph10 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].oneMoreDescription
    			},
    			$$inline: true
    		});

    	codesyntax5 = new CodeSyntax({
    			props: {
    				code: /*anotherAnOneMoreCode*/ ctx[6],
    				title: /*title*/ ctx[7]
    			},
    			$$inline: true
    		});

    	paragraph11 = new Paragraph({
    			props: { text: /*article*/ ctx[0].endStory },
    			$$inline: true
    		});

    	image2 = new Image({
    			props: {
    				image: /*article*/ ctx[0].anotherOneImage,
    				alternativeText: /*article*/ ctx[0].anotherAlternativeText
    			},
    			$$inline: true
    		});

    	image3 = new Image({
    			props: {
    				image: /*article*/ ctx[0].moreImage,
    				alternativeText: /*article*/ ctx[0].moreAlternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(subheader.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(paragraph2.$$.fragment);
    			t4 = space();
    			create_component(codesyntax0.$$.fragment);
    			t5 = space();
    			create_component(paragraph3.$$.fragment);
    			t6 = space();
    			create_component(paragraph4.$$.fragment);
    			t7 = space();
    			create_component(codesyntax1.$$.fragment);
    			t8 = space();
    			create_component(paragraph5.$$.fragment);
    			t9 = space();
    			create_component(image0.$$.fragment);
    			t10 = space();
    			create_component(paragraph6.$$.fragment);
    			t11 = space();
    			create_component(codesyntax2.$$.fragment);
    			t12 = space();
    			create_component(paragraph7.$$.fragment);
    			t13 = space();
    			create_component(image1.$$.fragment);
    			t14 = space();
    			create_component(paragraph8.$$.fragment);
    			t15 = space();
    			create_component(codesyntax3.$$.fragment);
    			t16 = space();
    			create_component(paragraph9.$$.fragment);
    			t17 = space();
    			create_component(codesyntax4.$$.fragment);
    			t18 = space();
    			create_component(paragraph10.$$.fragment);
    			t19 = space();
    			create_component(codesyntax5.$$.fragment);
    			t20 = space();
    			create_component(paragraph11.$$.fragment);
    			t21 = space();
    			create_component(image2.$$.fragment);
    			t22 = space();
    			create_component(image3.$$.fragment);
    			add_location(article_1, file$t, 232, 0, 7748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(subheader, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(paragraph4, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t8);
    			mount_component(paragraph5, article_1, null);
    			append_dev(article_1, t9);
    			mount_component(image0, article_1, null);
    			append_dev(article_1, t10);
    			mount_component(paragraph6, article_1, null);
    			append_dev(article_1, t11);
    			mount_component(codesyntax2, article_1, null);
    			append_dev(article_1, t12);
    			mount_component(paragraph7, article_1, null);
    			append_dev(article_1, t13);
    			mount_component(image1, article_1, null);
    			append_dev(article_1, t14);
    			mount_component(paragraph8, article_1, null);
    			append_dev(article_1, t15);
    			mount_component(codesyntax3, article_1, null);
    			append_dev(article_1, t16);
    			mount_component(paragraph9, article_1, null);
    			append_dev(article_1, t17);
    			mount_component(codesyntax4, article_1, null);
    			append_dev(article_1, t18);
    			mount_component(paragraph10, article_1, null);
    			append_dev(article_1, t19);
    			mount_component(codesyntax5, article_1, null);
    			append_dev(article_1, t20);
    			mount_component(paragraph11, article_1, null);
    			append_dev(article_1, t21);
    			mount_component(image2, article_1, null);
    			append_dev(article_1, t22);
    			mount_component(image3, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(subheader.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(paragraph4.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(paragraph5.$$.fragment, local);
    			transition_in(image0.$$.fragment, local);
    			transition_in(paragraph6.$$.fragment, local);
    			transition_in(codesyntax2.$$.fragment, local);
    			transition_in(paragraph7.$$.fragment, local);
    			transition_in(image1.$$.fragment, local);
    			transition_in(paragraph8.$$.fragment, local);
    			transition_in(codesyntax3.$$.fragment, local);
    			transition_in(paragraph9.$$.fragment, local);
    			transition_in(codesyntax4.$$.fragment, local);
    			transition_in(paragraph10.$$.fragment, local);
    			transition_in(codesyntax5.$$.fragment, local);
    			transition_in(paragraph11.$$.fragment, local);
    			transition_in(image2.$$.fragment, local);
    			transition_in(image3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(subheader.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(paragraph4.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(paragraph5.$$.fragment, local);
    			transition_out(image0.$$.fragment, local);
    			transition_out(paragraph6.$$.fragment, local);
    			transition_out(codesyntax2.$$.fragment, local);
    			transition_out(paragraph7.$$.fragment, local);
    			transition_out(image1.$$.fragment, local);
    			transition_out(paragraph8.$$.fragment, local);
    			transition_out(codesyntax3.$$.fragment, local);
    			transition_out(paragraph9.$$.fragment, local);
    			transition_out(codesyntax4.$$.fragment, local);
    			transition_out(paragraph10.$$.fragment, local);
    			transition_out(codesyntax5.$$.fragment, local);
    			transition_out(paragraph11.$$.fragment, local);
    			transition_out(image2.$$.fragment, local);
    			transition_out(image3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(subheader);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
    			destroy_component(paragraph2);
    			destroy_component(codesyntax0);
    			destroy_component(paragraph3);
    			destroy_component(paragraph4);
    			destroy_component(codesyntax1);
    			destroy_component(paragraph5);
    			destroy_component(image0);
    			destroy_component(paragraph6);
    			destroy_component(codesyntax2);
    			destroy_component(paragraph7);
    			destroy_component(image1);
    			destroy_component(paragraph8);
    			destroy_component(codesyntax3);
    			destroy_component(paragraph9);
    			destroy_component(codesyntax4);
    			destroy_component(paragraph10);
    			destroy_component(codesyntax5);
    			destroy_component(paragraph11);
    			destroy_component(image2);
    			destroy_component(image3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardComponent', slots, []);

    	const article = {
    		head: `Card Component`,
    		description: `Oyun alanında kullanacağımız kartlar için componentlere 
      ihtiyacımız olacak. 'CardFront' componentinde kartın pokemon resmini 
      tutarken, 'CardBack' componentinde '?' resmini tutacağız. Her iki 
      bileşenin kapsayıcısı 'Card' bileşeni olacak.`,
    		otherDescription: `'Card' componentini test ederken, sürekli olarak 'User' 
      componenti üzerinde isim ve avatar seçimi yapmamak için 'Playground' 
      componentinde yer alan _isStart_ şartını true ifadesine çevirelim.`,
    		anotherDescription: `'CardFront' componentinde 'img src' özelliği olarak bir
      API adresi verilmiş. Bu API'da dosya isimlerinde yer alan numaraları
      güncelleyerek, farklı pokemon resimlerine erişilebilir.`,
    		anAnotherDescription: `'CardFront' componentini öncelikle 'Card' 
      componentinde, 'Card' componentini de 'Playground' içerisinde true dönen
      blokta çağıralım. Aynı işlemi 'CardBack' componentinde tekrarlayarak Card
      componentleri üzerinde yaptığımız her güncellemeyi inceleyebileceğiz.`, // 💩
    		moreAnotherDescription: `'Card' componentleri birer block-element olduğu 
      için alt alta durmaktadır. Componentleri bir kapsayıcı içerisine alarak,
      inline-block seviyesine alalım. Aynı Component içerisinde çağırdığımızdan
      dolayı, 'position: absolute' stilini verdiğimizde 'Card' Componentinde yer
      alan 'child componentler' üst üste duracaktır.`, // 💩
    		moreDescription: `CSS kullanarak Card'ın arka yüzülen her tıklama ile 
      birlikte 'transform' özelliği ile 'CardBack' Componentinin 
      altında yer alan 'CardFront' içerisinde yer alan kartın görüntülenmesini
      sağlayacağız. 'Global.css' dosyamıza aşağıdaki özellikleri ekleyelim.`,
    		descriptionCode: `'img' kapsayıcısı olan 'back ve front' classlarına sahip 
      kapsayıcılara belirli özellikler katarak basit şekilde bir kart görünümü
      vermeye çaba sarfettik. 'CardBack' componentinde 'Card' componentinde 
      çağırarak arayüz üzerinde nasıl göründüğünü inceleyelim.`,
    		oneMoreDescription: `'Card' componentlerinin bir bütün gibi birlikte aynı 
      hızda, ve aynı perspektif üzerinden dönüş sağlaması gerekiyor. Svelte'de
      her component içerisinde tanımlanan _style_ özellikleri, Component'e ait 
      scope kadardır, diğer componentler bu stillendirmelerden etkilenmezler. 
      Bundan dolayı her iki class için aynı tanımlamaları gerçekleştirelim veya
      bu stillendirmeleri Global olarak tanımlayalım.`,
    		codeExplanation: `'CardBack' Componentinin kapsayıcı class'ına _.back_, 
      'position: absolute' değerini verdiğimizde her iki kart üst üste 
      görüntülenecektir.`,
    		otherCodeExplanation: `'Card' componentlerinde 'transform' stillendirmesi 
      sağlayarak, 'hover' class eklendiğinde dönme efekti vermesini 
      sağlayalım.`,
    		oneLineDescription: `+ /Components/Playground/Cards/Card.svelte, 
      CardBack.svelte, CardFront.svelte.`,
    		endStory: `Konsol üzerinde 'CardBack' componentine ait 'flipper' class 
      bulunan elemente 'hover' class eklediğinde efekt gerçekleştiğini 
      inceleyebilirsin.`,
    		image: `assets/components/Card/card-views.png`,
    		anotherImage: `assets/components/Card/card-position.gif`,
    		anotherOneImage: `assets/components/Card/card-turn-effect-back.png`,
    		moreImage: `assets/components/Card/card-turn-effect-front.png`,
    		alternativeText: `class Directives`,
    		anotherAlternativeText: `card position`,
    		anotherOneAlternativeText: `Card turn effect back`,
    		moreAlternativeText: `Card turn effect front`,
    		id: "card-component"
    	};

    	const code = `
    <script><\/script>

    <img
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
      alt="card on the playing field"
      class="single-poke"
    />

    <style>
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
    </style>
  `;

    	const otherCode = `
    <script><\/script>

    <div class="back">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
        class="single-poke"
        alt="card back on the playing field"
      />
    </div>

    <style>
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
    </style>
  `;

    	const oneMoreCode = `
    .flipper.hover .front {
      transform: rotateY(0deg);
    }

    .flipper.hover .back {
      transform: rotateY(180deg);
    }
  `;

    	const anotherOneMoreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
    <\/script>

    <main class="flip-container">
      <div class="flipper">
        <FrontCardFace />
        <BackCardFace />
      </div>
    </main>

    <style>
      .flip-container {
        display: inline-block;
        margin: 5px;
        width: 100px;
        height: 100px;
      }
  
      .flipper {
        position: relative;
      }  
    </style>
  `;

    	const moreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
    <\/script>

    <main class="flip-container">
      <div class="flipper"></div>
    </main>

    <style>
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
    </style>
  `;

    	const anotherAnOneMoreCode = `
    <script><\/script>

    <div class="front">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
        alt="card on the playing field"
        class="single-poke"
      />
    </div>

    <style>
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
    </style>
  `;

    	const title = `componenets > Playground > Cards > CardFront.svelte`;
    	const otherTitle = `componenets > Playground > Cards > CardBack.svelte`;
    	const oneMoreTitle = `public > global.css`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SubHeader,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		code,
    		otherCode,
    		oneMoreCode,
    		anotherOneMoreCode,
    		moreCode,
    		anotherAnOneMoreCode,
    		title,
    		otherTitle,
    		oneMoreTitle
    	});

    	return [
    		article,
    		code,
    		otherCode,
    		oneMoreCode,
    		anotherOneMoreCode,
    		moreCode,
    		anotherAnOneMoreCode,
    		title,
    		otherTitle,
    		oneMoreTitle
    	];
    }

    class CardComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardComponent",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src\components\Docs\CommunicationBetweenComponent.svelte generated by Svelte v3.48.0 */
    const file$s = "src\\components\\Docs\\CommunicationBetweenComponent.svelte";

    function create_fragment$t(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let image;
    	let t2;
    	let paragraph;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(image.$$.fragment);
    			t2 = space();
    			create_component(paragraph.$$.fragment);
    			add_location(article_1, file$s, 20, 0, 921);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(image, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(image);
    			destroy_component(paragraph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommunicationBetweenComponent', slots, []);

    	const article = {
    		head: `Componentler Arası İletişim`,
    		description: `Küçük yapılı projelerden, komplex yapılılara kadar birçok 
      veriyi component üzerinden alıp farklı bir yerde kullanma, güncelleme gibi 
      ihtiyaçlarımız olacak. Kullanılan framework, library veya compiler'in bu 
      ihtiyacınıza esnek çözümler sağlayabilmesi gerekiyor. Svelte bu 
      ihtiyaçlarınız için birden fazla ve basit yapılara sahip çözümlere 
      sahip.`,
    		image: `assets/documentation/communication-is-key.jpg`,
    		alternativeText: `SpongeBob 'communication is key' meme`,
    		id: "communication-between-component"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CommunicationBetweenComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class CommunicationBetweenComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommunicationBetweenComponent",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\components\Docs\Section\Templates\ChildTitle.svelte generated by Svelte v3.48.0 */

    const file$r = "src\\components\\Docs\\Section\\Templates\\ChildTitle.svelte";

    function create_fragment$s(ctx) {
    	let h3;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("🎈🎈 ");
    			t1 = text(/*head*/ ctx[0]);
    			add_location(h3, file$r, 4, 0, 43);
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
    			if (dirty & /*head*/ 1) set_data_dev(t1, /*head*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChildTitle', slots, []);
    	let { head } = $$props;
    	const writable_props = ['head'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChildTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('head' in $$props) $$invalidate(0, head = $$props.head);
    	};

    	$$self.$capture_state = () => ({ head });

    	$$self.$inject_state = $$props => {
    		if ('head' in $$props) $$invalidate(0, head = $$props.head);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [head];
    }

    class ChildTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { head: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChildTitle",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*head*/ ctx[0] === undefined && !('head' in props)) {
    			console.warn("<ChildTitle> was created without expected prop 'head'");
    		}
    	}

    	get head() {
    		throw new Error("<ChildTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<ChildTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Docs\Context.svelte generated by Svelte v3.48.0 */
    const file$q = "src\\components\\Docs\\Context.svelte";

    function create_fragment$r(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let childtitle;
    	let t1;
    	let paragraph;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	childtitle = new ChildTitle({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(childtitle.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			add_location(article_1, file$q, 15, 0, 595);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(childtitle, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(childtitle.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(childtitle.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(childtitle);
    			destroy_component(paragraph);
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
    	validate_slots('Context', slots, []);

    	const article = {
    		head: `Context`,
    		description: `Bir veriyi iletmeniz gereken component sayısı arttıkça, 
      yapısını kurgulamak ve takibini sağlamak zor ve bir yerden sonra da 
      oldukça sıkıcı bir duruma dönüşebilir. Context ile dataların parent 
      üzerinden child componentler üzerinde erişilmesini sağlar.`,
    		id: "context"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Context> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ChildTitle,
    		Paragraph,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class Context extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Context",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\components\Docs\CreateASvelteProject.svelte generated by Svelte v3.48.0 */
    const file$p = "src\\components\\Docs\\CreateASvelteProject.svelte";

    function create_fragment$q(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let codesyntax0;
    	let t3;
    	let paragraph1;
    	let t4;
    	let codesyntax1;
    	let t5;
    	let paragraph2;
    	let t6;
    	let codesyntax2;
    	let t7;
    	let paragraph3;
    	let t8;
    	let image;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*svelteInstall*/ ctx[1],
    				title: ""
    			},
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*typescriptSet*/ ctx[2],
    				title: ""
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax2 = new CodeSyntax({
    			props: {
    				code: /*dependenciesInstall*/ ctx[3],
    				title: ""
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherAnDescription
    			},
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(codesyntax0.$$.fragment);
    			t3 = space();
    			create_component(paragraph1.$$.fragment);
    			t4 = space();
    			create_component(codesyntax1.$$.fragment);
    			t5 = space();
    			create_component(paragraph2.$$.fragment);
    			t6 = space();
    			create_component(codesyntax2.$$.fragment);
    			t7 = space();
    			create_component(paragraph3.$$.fragment);
    			t8 = space();
    			create_component(image.$$.fragment);
    			add_location(article_1, file$p, 34, 0, 1512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(codesyntax2, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t8);
    			mount_component(image, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(codesyntax2.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(codesyntax2.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(codesyntax0);
    			destroy_component(paragraph1);
    			destroy_component(codesyntax1);
    			destroy_component(paragraph2);
    			destroy_component(codesyntax2);
    			destroy_component(paragraph3);
    			destroy_component(image);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreateASvelteProject', slots, []);

    	const article = {
    		head: `Svelte projesi oluşturma`,
    		description: `Npx ile yeni bir proje oluşturma:`,
    		otherDescription: `Svelte Typescript notasyonunu desteklemektedir. 
      Typescript üzerinde yapabileceğiniz bütün işlemleri Svelte projelerinde 
      kullanabilirsin.`,
    		anotherDescription: `Gerekli olan bağımlılıkları projemize ekleyerek ayağa 
      kaldırabiliriz.`,
    		anotherAnDescription: `Bu komutlar sonrasında konsol üzerinde projenin hangi
      port üzerinde çalıştığını görebilirsin. Windows işletim sistemlerinde 
      varsayılan 8080 portu işaretli iken, bu port üzerinde çalışan proje 
      bulunuyorsa veya farklı işletim sistemi kullanıyorsan port numarası 
      değişkenlik gösterebilir.`, // 💩
    		image: `assets/documentation/console-logs.png`,
    		alternativeText: `port where Svelte is running on the console`,
    		id: "create-a-svelte-project"
    	};

    	const svelteInstall = `npx degit sveltejs/template remember-em-all`;

    	const typescriptSet = `
    cd remember-em-all
    node scripts/setupTypeScript.js`;

    	const dependenciesInstall = `
    npm install
    npm run dev`;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreateASvelteProject> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		svelteInstall,
    		typescriptSet,
    		dependenciesInstall
    	});

    	return [article, svelteInstall, typescriptSet, dependenciesInstall];
    }

    class CreateASvelteProject extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreateASvelteProject",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\components\Docs\ExamineSvelteStructure.svelte generated by Svelte v3.48.0 */
    const file$o = "src\\components\\Docs\\ExamineSvelteStructure.svelte";

    function create_fragment$p(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph;
    	let t2;
    	let matter;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	matter = new Matter({
    			props: { matter: /*article*/ ctx[0].material },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			t2 = space();
    			create_component(matter.$$.fragment);
    			add_location(article_1, file$o, 32, 0, 1746);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(matter, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			transition_in(matter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			transition_out(matter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph);
    			destroy_component(matter);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExamineSvelteStructure', slots, []);

    	const article = {
    		head: `Svelte yapısını inceleme`,
    		description: `Varsayılan _src/App.svelte_ dosyasını kontrol ettiğimizde daha
      önce değindiğimiz gibi _Javascript_ kodları için _script_, _html_ kodları 
      için _main_ ve stillendirme için _style_ tagları bulunuyor.`,
    		material: [
    			`_script_ etiketinde _lang_ özelliği Typescript bağımlılığını eklediğimiz
      için _ts_ değerinde bulunmaktadır. Typescript kullanmak istediğin _svelte_
      dosyalarında _lang_ özelliğine _ts_ değerini vermen yeterli olacaktır.`,
    			`_main_ etiketinde _html_ kodlarını tanımlayabileceğin gibi, bu etiketin
      dışında da dilediğin gibi _html_ kodlarını tanımlayabilirsin. Svelte
      tanımladığın kodları _html_ kodu olarak derlemesine rağmen, proje 
      yapısının daha okunabilir olabilmesi için kapsayıcı bir etiketin altında
      toplanması daha iyi olabilir.`,
    			`_style_ etiketi altında tanımladığın stil özelliklerinden, aynı dosyada
      bulunan _html_ alanında seçiciler etkilenir. Global seçicileri 
      tanımlayabilir veya global olarak tanımlamak istediğin seçicileri 
      'public/global.css' dosyasında düzenleyebilirsin.`,
    			`Proje içerisinde compile edilen bütün yapılar '/public/build/bundle.js'
      dosyasında yer almaktadir. _index.html_ dosyası buradaki yapıyı referans
      alarak Svelte projesini kullanıcı karşısına getirmektedir.`
    		],
    		id: "examine-svelte-structure"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExamineSvelteStructure> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		AccessArticle,
    		Matter,
    		article
    	});

    	return [article];
    }

    class ExamineSvelteStructure extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExamineSvelteStructure",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\components\Docs\GameInterface.svelte generated by Svelte v3.48.0 */
    const file$n = "src\\components\\Docs\\GameInterface.svelte";

    function create_fragment$o(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let subheader;
    	let t1;
    	let paragraph;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	subheader = new SubHeader({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(subheader.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			add_location(article_1, file$n, 14, 0, 516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(subheader, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(subheader.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(subheader.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(subheader);
    			destroy_component(paragraph);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameInterface', slots, []);

    	const article = {
    		head: `Game Interface`,
    		description: `Oyun içerisinde kartların kullanılabilmesi için bir 
      Component'a ihtiyacımız bulunuyor. Bu component'i oluşturarak, oyun 
      alanında istediğimiz sayıda kart oluşturacağız.`,
    		id: "game-interface"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameInterface> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SubHeader,
    		Paragraph,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class GameInterface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameInterface",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\components\Docs\GameRequirements.svelte generated by Svelte v3.48.0 */
    const file$m = "src\\components\\Docs\\GameRequirements.svelte";

    function create_fragment$n(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let t3;
    	let codesyntax0;
    	let t4;
    	let paragraph2;
    	let t5;
    	let paragraph3;
    	let t6;
    	let codesyntax1;
    	let t7;
    	let paragraph4;
    	let t8;
    	let paragraph5;
    	let t9;
    	let paragraph6;
    	let t10;
    	let codesyntax2;
    	let t11;
    	let paragraph7;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[4]
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: { text: /*article*/ ctx[0].moreDescription },
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*moreCode*/ ctx[3],
    				title: /*otherTitle*/ ctx[5]
    			},
    			$$inline: true
    		});

    	paragraph4 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherMoreDescription
    			},
    			$$inline: true
    		});

    	paragraph5 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherOneMoreDescription
    			},
    			$$inline: true
    		});

    	paragraph6 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].descriptionBored
    			},
    			$$inline: true
    		});

    	codesyntax2 = new CodeSyntax({
    			props: {
    				code: /*otherCode*/ ctx[2],
    				title: /*moreTitle*/ ctx[6]
    			},
    			$$inline: true
    		});

    	paragraph7 = new Paragraph({
    			props: { text: /*article*/ ctx[0].endStory },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(codesyntax0.$$.fragment);
    			t4 = space();
    			create_component(paragraph2.$$.fragment);
    			t5 = space();
    			create_component(paragraph3.$$.fragment);
    			t6 = space();
    			create_component(codesyntax1.$$.fragment);
    			t7 = space();
    			create_component(paragraph4.$$.fragment);
    			t8 = space();
    			create_component(paragraph5.$$.fragment);
    			t9 = space();
    			create_component(paragraph6.$$.fragment);
    			t10 = space();
    			create_component(codesyntax2.$$.fragment);
    			t11 = space();
    			create_component(paragraph7.$$.fragment);
    			add_location(article_1, file$m, 73, 0, 3112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(paragraph4, article_1, null);
    			append_dev(article_1, t8);
    			mount_component(paragraph5, article_1, null);
    			append_dev(article_1, t9);
    			mount_component(paragraph6, article_1, null);
    			append_dev(article_1, t10);
    			mount_component(codesyntax2, article_1, null);
    			append_dev(article_1, t11);
    			mount_component(paragraph7, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(paragraph4.$$.fragment, local);
    			transition_in(paragraph5.$$.fragment, local);
    			transition_in(paragraph6.$$.fragment, local);
    			transition_in(codesyntax2.$$.fragment, local);
    			transition_in(paragraph7.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(paragraph4.$$.fragment, local);
    			transition_out(paragraph5.$$.fragment, local);
    			transition_out(paragraph6.$$.fragment, local);
    			transition_out(codesyntax2.$$.fragment, local);
    			transition_out(paragraph7.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
    			destroy_component(codesyntax0);
    			destroy_component(paragraph2);
    			destroy_component(paragraph3);
    			destroy_component(codesyntax1);
    			destroy_component(paragraph4);
    			destroy_component(paragraph5);
    			destroy_component(paragraph6);
    			destroy_component(codesyntax2);
    			destroy_component(paragraph7);
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

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameRequirements', slots, []);

    	const article = {
    		head: `Game Requirements`,
    		description: `Kullanıcının isim, avatar gibi aldığımız değerlerin yanı sıra
      oyuna ait standart değerler bulunabilir. Geliştireceğimiz oyun 
      için bu değerlerden _level_ ve _score_ gibi iki değer tanımlayacağız. 
      Kullanıcı, isim ve avatar seçiminin ardından _start_ butonuna tıkladığında
      bu değerlerden _level 1_, _score 0_ değerlerini oluşturacağız. Kullanıcı 
      doğru kartları eşleştirdikçe ve seviye atladığında burada yer alan 
      değerler dinamik olarak güncellenecek.`,
    		otherDescription: `+ /Store/Level.ts, Score.ts`,
    		anotherDescription: `_level_ isminde bir değer oluşturduk ve gezegenin 
      iyiliği için uygulamamız içerisinde kullanacağız. Bu değer kullanıcı 
      arayüz üzerindeki bütün kartları eşleştirebildiğinde güncellenecek. Bir
      store değeri oluşturmak için _writable_ interface ile Store değerlerini
      oluşturabilir ve güncelleyebilirsin.`,
    		moreDescription: `Her eşleşme sonrasında kullanıcının puan kazanabildiği 
      _score_ değeri tanımlayalım.`, //💩
    		anotherMoreDescription: `Bu değerleri farklı dosyalarda tanımlayabildiğin
      gibi tek bir tek bir dosya içerisinde de _score&level_ değerlerini 
      tanımlayabilirsin. Bir kullanıcı oluşturarak _name & avatar & score & 
      level_ değerlerini birlikte kullanabilirsin.`, //💩
    		anotherOneMoreDescription: `Kullanıcıya ait statik bilgileri tutacağımız 
    yeni bir class oluşturalım.`, //💩
    		endStory: `Oluşturduğumuz UserInfo class'ını kullanıcının isim, avatar
      değerlerini set edeceğiz. Bu değerlere default olarak boş String atadım,
      farklı içerikle doldurabilirsin. isim ve avatar değerleri hatalı değilse 
      _isStart_ değerine _true_ olarak güncelleyerek oyunu başlatacağız.`,
    		descriptionBored: `+ /Store/User.ts`, //💩
    		id: "game-requirements"
    	};

    	const code = `
    <script>
      import { Writable, writable } from "svelte/store";
      
      export const level:Writable<number> = writable(1);
    <\/script>
  `;

    	const otherCode = `
    <script>
      import { Writable, writable } from "svelte/store";
  
      export class UserInfo {
        constructor (
          public name: Writable<string> = writable(''),
          public avatar: Writable<string> = writable(''),
          public isStart: Writable<boolean> = writable(false)
      ){}
  
      export const userInfo = new UserInfo();
    <\/script>
  `;

    	const moreCode = `
    <script>
      import { Writable, writable } from "svelte/store";

      export const score:Writable<number> = writable(0);
    <\/script>
  `;

    	const title = `Store > Level.ts`;
    	const otherTitle = `Store > Score.ts`;
    	const moreTitle = `Store > User.ts`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameRequirements> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		code,
    		otherCode,
    		moreCode,
    		title,
    		otherTitle,
    		moreTitle
    	});

    	return [article, code, otherCode, moreCode, title, otherTitle, moreTitle];
    }

    class GameRequirements extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameRequirements",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\components\Docs\HeaderComponent.svelte generated by Svelte v3.48.0 */
    const file$l = "src\\components\\Docs\\HeaderComponent.svelte";

    function create_fragment$m(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let subheader;
    	let t1;
    	let paragraph0;
    	let t2;
    	let codesyntax0;
    	let t3;
    	let codesyntax1;
    	let t4;
    	let image;
    	let t5;
    	let paragraph1;
    	let t6;
    	let codesyntax2;
    	let t7;
    	let paragraph2;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	subheader = new SubHeader({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[4]
    			},
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*otherCode*/ ctx[2],
    				title: /*otherTitle*/ ctx[5]
    			},
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	codesyntax2 = new CodeSyntax({
    			props: {
    				code: /*moreCode*/ ctx[3],
    				title: /*moreTitle*/ ctx[6]
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(subheader.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(codesyntax0.$$.fragment);
    			t3 = space();
    			create_component(codesyntax1.$$.fragment);
    			t4 = space();
    			create_component(image.$$.fragment);
    			t5 = space();
    			create_component(paragraph1.$$.fragment);
    			t6 = space();
    			create_component(codesyntax2.$$.fragment);
    			t7 = space();
    			create_component(paragraph2.$$.fragment);
    			add_location(article_1, file$l, 79, 0, 2194);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(subheader, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(image, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(codesyntax2, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(paragraph2, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(subheader.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(codesyntax2.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(subheader.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(codesyntax2.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(subheader);
    			destroy_component(paragraph0);
    			destroy_component(codesyntax0);
    			destroy_component(codesyntax1);
    			destroy_component(image);
    			destroy_component(paragraph1);
    			destroy_component(codesyntax2);
    			destroy_component(paragraph2);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HeaderComponent', slots, []);

    	const article = {
    		head: `Header Component`,
    		description: `Root folder üzerinde _Header.svelte_ isminde bir Component 
      oluşturuyorum. Önceki örneklerde gerçekleştirdiğimiz gibi, _Header.svelte_
      Componentini _Userground.svelte_ componenti üzerinde çağıralım. 
      Oluşturduğumuz _Header.svelte_ componentinin basit bir görevi bulunuyor, 
      statik bir metin bardındırmak..`,
    		otherDescription: `Süper iğrenç gözüküyor, öyle değil mi? İyi ki CSS var..`,
    		anotherDescription: `Ehh... şimdi biraz daha az kötü gözüktüğü 
      söylenebilir💩💩💩`,
    		image: `assets/components/User/header-component.png`,
    		alternativeText: `call header component`,
    		id: "header-component"
    	};

    	const code = `
    <script><\/script>

    <div class="header">
      <h2>select your best pokemon and start catching!</h2>
    </div>

    <style>
      .header {
        padding: 5px 0;
        margin-bottom: 15px;
        border-bottom: 3px solid white;
      }
    </style>
  `;

    	const otherCode = `
    <script>
      import Header from "./Header.svelte";
    <\/script>

    <main>
      <Header />
    </main>

    <style>
      main {
        background-color: #f5f5f5;
        border-radius: 5px;
        padding-bottom: 15px;
      }
    </style>
  `;

    	const moreCode = `
    <script>
      import Userground from "../../User/Userground.svelte";  
    <\/script>

    <main class="playground">
      <Userground />
    </main>

    <style>
      .playground {
        width: 900px;
        margin: 0 auto;
        text-align: center;
      }
    </style>
  `; // 💩

    	const title = `User > Header.svelte`;
    	const otherTitle = `User > UserGround.svelte`;
    	const moreTitle = `Playground > Wrapper > Playground.svelte`; // 💩
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HeaderComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SubHeader,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		code,
    		otherCode,
    		moreCode,
    		title,
    		otherTitle,
    		moreTitle
    	});

    	return [article, code, otherCode, moreCode, title, otherTitle, moreTitle];
    }

    class HeaderComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderComponent",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\components\Docs\Hello.svelte generated by Svelte v3.48.0 */
    const file$k = "src\\components\\Docs\\Hello.svelte";

    function create_fragment$l(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let image;
    	let t3;
    	let paragraph1;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(image.$$.fragment);
    			t3 = space();
    			create_component(paragraph1.$$.fragment);
    			add_location(article_1, file$k, 30, 0, 1519);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(image, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph1, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(image);
    			destroy_component(paragraph1);
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
    	validate_slots('Hello', slots, []);

    	const article = {
    		head: `Selamlaaaaar 👋`,
    		description: `Herşeyden önce umuyorum ki bu basit döküman Svelte 
    yolculuğunda rehber olabilir. Son zamanlarda Svelte ile uygulama 
    geliştirmeye başladım. Svelte'in yapısına daha çok hakim olabilmek ve 
    öğrendiklerimi paylaşabilmek için bu dökümanı oluşturdum. Döküman içerisinde
    adım adım _Game_ bağlantısında görebileğin oyunu nasıl geliştirdiğimi 
    anlattım, ilgi duyuyorsan aynı adımları takip ederek benzer bir uygulama 
    oluşturabilir, veya küçük bir kaynak modelinde kullanabilirsin. Svelte 
    içeriği iyi ayrıntılanmış dökümantasyonlara 
    ([docs](https://svelte.dev/docs "Svelte Documentation"), 
    [examples](https://svelte.dev/examples/hello-world "Svelte Examples")) 
    sahip, dökümantasyonları inceledikten sonra uygulamayı takip etmen daha 
    faydalı olabilir.`,
    		otherDescription: `İlk bölümlerde Svelte'i nasıl 
    kullanabileceğine dair bilgilendirmeler yer alıyor. Bu kısımlara hakimsen, 
    atlayarak [Start Game](#start-game "Access Start Game section") bölümünden 
    devam edebilirsin.`,
    		image: `assets/documentation/squirtle-squad.webp`,
    		alternativeText: `hello team`,
    		id: "hello-team"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hello> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class Hello extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hello",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\components\Docs\ModuleContext.svelte generated by Svelte v3.48.0 */
    const file$j = "src\\components\\Docs\\ModuleContext.svelte";

    function create_fragment$k(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let childtitle;
    	let t1;
    	let paragraph;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	childtitle = new ChildTitle({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(childtitle.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			add_location(article_1, file$j, 15, 0, 626);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(childtitle, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(childtitle.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(childtitle.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(childtitle);
    			destroy_component(paragraph);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModuleContext', slots, []);

    	const article = {
    		head: `Module Context`,
    		description: `Component üzerinde kullandığınız veri farklı bir Component'da 
      yer alıyorsa ve çalışmaları birbirlerine bağımlı olduğu senaryolarda 
      Module Context Componentlar arasında bu senaryonun uygulanmasını sağlıyor.
      Verileri birden çok component ile paylaşılmasını olanak tanır.`,
    		id: "module-context"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModuleContext> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ChildTitle,
    		Paragraph,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class ModuleContext extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModuleContext",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\components\Docs\NameComponent.svelte generated by Svelte v3.48.0 */
    const file$i = "src\\components\\Docs\\NameComponent.svelte";

    function create_fragment$j(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let subheader;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let t3;
    	let codesyntax;
    	let t4;
    	let paragraph2;
    	let t5;
    	let paragraph3;
    	let t6;
    	let paragraph4;
    	let t7;
    	let image;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	subheader = new SubHeader({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	codesyntax = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[2]
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: { text: /*article*/ ctx[0].moreDescription },
    			$$inline: true
    		});

    	paragraph4 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].oneMoreDescription
    			},
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(subheader.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(codesyntax.$$.fragment);
    			t4 = space();
    			create_component(paragraph2.$$.fragment);
    			t5 = space();
    			create_component(paragraph3.$$.fragment);
    			t6 = space();
    			create_component(paragraph4.$$.fragment);
    			t7 = space();
    			create_component(image.$$.fragment);
    			add_location(article_1, file$i, 50, 0, 2106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(subheader, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(codesyntax, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(paragraph4, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(image, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(subheader.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(codesyntax.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(paragraph4.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(subheader.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(codesyntax.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(paragraph4.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(subheader);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
    			destroy_component(codesyntax);
    			destroy_component(paragraph2);
    			destroy_component(paragraph3);
    			destroy_component(paragraph4);
    			destroy_component(image);
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
    	validate_slots('NameComponent', slots, []);

    	const article = {
    		head: `Name Component`,
    		description: `Pokemon eğitmenimizin bir isim girebilmesi için gerekli olan 
      componenti oluşturalım.`,
    		otherDescription: `+ /components/User/Avatar/Name, /components/User/Avatar/Name/UserName.svelte`,
    		anotherDescription: `Diğer componentlerde yaptığımız gibi, _UserName_ 
      componentinin _Userground_ componentinde kullanalım.`,
    		moreDescription: `Geriye son bir componentimiz kaldı. "Start" yazısına sahip
      bir buton componentini oluşturarak, _User_ klasöründe _Start.svelte_ 
      ismiyle kaydedelim. Ve son olarak _UserGround_ componentinde çağıralım.`, //💩
    		oneMoreDescription: `Ta daaaa... Şuana kadar yaptığımız componentler dinamik
      işlemler gerçekleştirmedi. Arayüzü oluşturmak için yeteri kadar malzememiz
      ortaya çıktı, ve bunları istediğin gibi stillendirebilirsin. Svelte 
      dosyana ait her stillendirme, svelte dosyasının kapsamı kadardır. 
      Child-Parent componentler bu stil özelliklerine sahip olmazlar. Bundan 
      sonraki aşamalarda bu componentlara dinamik özellikler kazandıracağız.`, //💩
    		image: `assets/components/User/end-interface.png`,
    		alternativeText: `call Avatar Component`,
    		id: "name-component"
    	};

    	const code = `
    <script><\/script>

    <div class="user">
      <input type="text" class="name" name="name" placeholder="pika pika" />
    </div>

    <style>
      .name {
        width: 40%;
        border-radius: 20px;
        text-align: center;
        margin-bottom: 30px;
        padding: 8px 0;
      }
    </style>
  `;

    	const title = `User > Avatar > Name > UserName.svelte`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NameComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SubHeader,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		Matter,
    		article,
    		code,
    		title
    	});

    	return [article, code, title];
    }

    class NameComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NameComponent",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\components\Docs\Practice.svelte generated by Svelte v3.48.0 */
    const file$h = "src\\components\\Docs\\Practice.svelte";

    function create_fragment$i(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			add_location(article_1, file$h, 21, 0, 996);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
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
    	validate_slots('Practice', slots, []);

    	const article = {
    		head: `Biraz pratik`,
    		description: `Birkaç örnek yaparak Svelte'i anlamaya, yorumlamaya çalışalım.
      Kod örnekleri oyun üzerinde sıkça kullanacağımız yapılar için bir temel 
      oluşturacak.`,
    		otherDescription: `_App.svelte_ dosyasında _name_ isminde bir değişken 
      tanımlanmış. Typescript notasyonu baz alındığı için değer tipi olarak 
      _string_ verilmiş. Bu notasyon ile anlatım biraz daha uzun olabileceği 
      için kullanmamayı tercih edicem. Github üzerinde bulunan kodlar ile, 
      burada birlikte oluşturacaklarımız farklılık gösterebilir.. panik yok, 
      Typescript'e [hakim olabileceğine](https://youtube.com/shorts/oyIO1_8uNPc
      "senin kocaman kalbin <33") eminim.`,
    		id: "pratice"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Practice> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class Practice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Practice",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\components\Docs\ProjectDependencies.svelte generated by Svelte v3.48.0 */
    const file$g = "src\\components\\Docs\\ProjectDependencies.svelte";

    function create_fragment$h(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let list;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	list = new List({
    			props: { material: /*article*/ ctx[0].terms },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(list.$$.fragment);
    			add_location(article_1, file$g, 28, 0, 1106);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(list, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(list);
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
    	validate_slots('ProjectDependencies', slots, []);

    	const article = {
    		head: `Proje bağımlılıkları`,
    		terms: [
    			{
    				command: `Typescript`,
    				description: `Typescript, Javascript kodunuzu daha verimli kılmanızı ve 
          kod kaynaklı hataların önüne geçilmesini sağlayan Javascript temelli 
          programlama dilidir. Projenizde yer alan _.svelte_ uzantılı dosyalarda 
          kullanabileceğiniz gibi, _.ts_ dosyalarını da destekler.`
    			},
    			{
    				command: `Rollup`,
    				description: `Svelte kurulumunuzla birlikte root folder üzerinde 
          rollup.config.js dosyası oluşturulacaktır. Rollup Javascript 
          uygulamalar için kullanılan bir modül paketleyicidir, uygulamamızda 
          yer alan kodları tarayıcının anlayabileceği şekilde ayrıştırır. Svelte
          kurulumuyla birlikte projenize eklenir.`
    			}
    		],
    		id: "project-dependencies"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProjectDependencies> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, AccessArticle, List, article });
    	return [article];
    }

    class ProjectDependencies extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectDependencies",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\Docs\Props.svelte generated by Svelte v3.48.0 */
    const file$f = "src\\components\\Docs\\Props.svelte";

    function create_fragment$g(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let childtitle;
    	let t1;
    	let paragraph;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	childtitle = new ChildTitle({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(childtitle.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			add_location(article_1, file$f, 16, 0, 635);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(childtitle, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(childtitle.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(childtitle.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(childtitle);
    			destroy_component(paragraph);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Props', slots, []);

    	const article = {
    		head: `Props`,
    		description: `Props kullanarak dataları bir component üzerinden farklı 
      componentlere aktarabilirsiniz. Componentler arası bu ilişki parent-child
      ile ifade edilir. Parent üzerinden child componentlere veri 
      aktarabiliyorken, aynı zamanda child component üzerinden parent 
      componente veri iletebilirsiniz.`,
    		id: "props"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Props> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ChildTitle,
    		Paragraph,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class Props extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Props",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\Docs\ReactiveUserComponent.svelte generated by Svelte v3.48.0 */
    const file$e = "src\\components\\Docs\\ReactiveUserComponent.svelte";

    function create_fragment$f(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let t3;
    	let codesyntax0;
    	let t4;
    	let paragraph2;
    	let t5;
    	let codesyntax1;
    	let t6;
    	let paragraph3;
    	let t7;
    	let codesyntax2;
    	let t8;
    	let paragraph4;
    	let t9;
    	let image0;
    	let t10;
    	let paragraph5;
    	let t11;
    	let codesyntax3;
    	let t12;
    	let paragraph6;
    	let t13;
    	let paragraph7;
    	let t14;
    	let codesyntax4;
    	let t15;
    	let paragraph8;
    	let t16;
    	let codesyntax5;
    	let t17;
    	let image1;
    	let t18;
    	let paragraph9;
    	let t19;
    	let codesyntax6;
    	let t20;
    	let paragraph10;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[8]
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: { text: /*article*/ ctx[0].codeExplanation },
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*otherCode*/ ctx[2],
    				title: /*otherTitle*/ ctx[9]
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherCodeExplanation
    			},
    			$$inline: true
    		});

    	codesyntax2 = new CodeSyntax({
    			props: {
    				code: /*oneMoreCode*/ ctx[3],
    				title: /*oneMoreTitle*/ ctx[10]
    			},
    			$$inline: true
    		});

    	paragraph4 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	image0 = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph5 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].oneLineDescription
    			},
    			$$inline: true
    		});

    	codesyntax3 = new CodeSyntax({
    			props: {
    				code: /*anotherOneMoreCode*/ ctx[4],
    				title: /*anotherOneMoreTitle*/ ctx[11]
    			},
    			$$inline: true
    		});

    	paragraph6 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anAnotherDescription
    			},
    			$$inline: true
    		});

    	paragraph7 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].moreAnotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax4 = new CodeSyntax({
    			props: {
    				code: /*moreCode*/ ctx[5],
    				title: /*moreTitle*/ ctx[12]
    			},
    			$$inline: true
    		});

    	paragraph8 = new Paragraph({
    			props: { text: /*article*/ ctx[0].moreDescription },
    			$$inline: true
    		});

    	codesyntax5 = new CodeSyntax({
    			props: {
    				code: /*anotherAnOneMoreCode*/ ctx[6],
    				title: /*moreTitle*/ ctx[12]
    			},
    			$$inline: true
    		});

    	image1 = new Image({
    			props: {
    				image: /*article*/ ctx[0].anotherImage,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph9 = new Paragraph({
    			props: { text: /*article*/ ctx[0].descriptionCode },
    			$$inline: true
    		});

    	codesyntax6 = new CodeSyntax({
    			props: {
    				code: /*endCode*/ ctx[7],
    				title: /*oneMoreTitle*/ ctx[10]
    			},
    			$$inline: true
    		});

    	paragraph10 = new Paragraph({
    			props: { text: /*article*/ ctx[0].endStory },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(codesyntax0.$$.fragment);
    			t4 = space();
    			create_component(paragraph2.$$.fragment);
    			t5 = space();
    			create_component(codesyntax1.$$.fragment);
    			t6 = space();
    			create_component(paragraph3.$$.fragment);
    			t7 = space();
    			create_component(codesyntax2.$$.fragment);
    			t8 = space();
    			create_component(paragraph4.$$.fragment);
    			t9 = space();
    			create_component(image0.$$.fragment);
    			t10 = space();
    			create_component(paragraph5.$$.fragment);
    			t11 = space();
    			create_component(codesyntax3.$$.fragment);
    			t12 = space();
    			create_component(paragraph6.$$.fragment);
    			t13 = space();
    			create_component(paragraph7.$$.fragment);
    			t14 = space();
    			create_component(codesyntax4.$$.fragment);
    			t15 = space();
    			create_component(paragraph8.$$.fragment);
    			t16 = space();
    			create_component(codesyntax5.$$.fragment);
    			t17 = space();
    			create_component(image1.$$.fragment);
    			t18 = space();
    			create_component(paragraph9.$$.fragment);
    			t19 = space();
    			create_component(codesyntax6.$$.fragment);
    			t20 = space();
    			create_component(paragraph10.$$.fragment);
    			add_location(article_1, file$e, 249, 0, 7887);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(codesyntax2, article_1, null);
    			append_dev(article_1, t8);
    			mount_component(paragraph4, article_1, null);
    			append_dev(article_1, t9);
    			mount_component(image0, article_1, null);
    			append_dev(article_1, t10);
    			mount_component(paragraph5, article_1, null);
    			append_dev(article_1, t11);
    			mount_component(codesyntax3, article_1, null);
    			append_dev(article_1, t12);
    			mount_component(paragraph6, article_1, null);
    			append_dev(article_1, t13);
    			mount_component(paragraph7, article_1, null);
    			append_dev(article_1, t14);
    			mount_component(codesyntax4, article_1, null);
    			append_dev(article_1, t15);
    			mount_component(paragraph8, article_1, null);
    			append_dev(article_1, t16);
    			mount_component(codesyntax5, article_1, null);
    			append_dev(article_1, t17);
    			mount_component(image1, article_1, null);
    			append_dev(article_1, t18);
    			mount_component(paragraph9, article_1, null);
    			append_dev(article_1, t19);
    			mount_component(codesyntax6, article_1, null);
    			append_dev(article_1, t20);
    			mount_component(paragraph10, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(codesyntax2.$$.fragment, local);
    			transition_in(paragraph4.$$.fragment, local);
    			transition_in(image0.$$.fragment, local);
    			transition_in(paragraph5.$$.fragment, local);
    			transition_in(codesyntax3.$$.fragment, local);
    			transition_in(paragraph6.$$.fragment, local);
    			transition_in(paragraph7.$$.fragment, local);
    			transition_in(codesyntax4.$$.fragment, local);
    			transition_in(paragraph8.$$.fragment, local);
    			transition_in(codesyntax5.$$.fragment, local);
    			transition_in(image1.$$.fragment, local);
    			transition_in(paragraph9.$$.fragment, local);
    			transition_in(codesyntax6.$$.fragment, local);
    			transition_in(paragraph10.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(codesyntax2.$$.fragment, local);
    			transition_out(paragraph4.$$.fragment, local);
    			transition_out(image0.$$.fragment, local);
    			transition_out(paragraph5.$$.fragment, local);
    			transition_out(codesyntax3.$$.fragment, local);
    			transition_out(paragraph6.$$.fragment, local);
    			transition_out(paragraph7.$$.fragment, local);
    			transition_out(codesyntax4.$$.fragment, local);
    			transition_out(paragraph8.$$.fragment, local);
    			transition_out(codesyntax5.$$.fragment, local);
    			transition_out(image1.$$.fragment, local);
    			transition_out(paragraph9.$$.fragment, local);
    			transition_out(codesyntax6.$$.fragment, local);
    			transition_out(paragraph10.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
    			destroy_component(codesyntax0);
    			destroy_component(paragraph2);
    			destroy_component(codesyntax1);
    			destroy_component(paragraph3);
    			destroy_component(codesyntax2);
    			destroy_component(paragraph4);
    			destroy_component(image0);
    			destroy_component(paragraph5);
    			destroy_component(codesyntax3);
    			destroy_component(paragraph6);
    			destroy_component(paragraph7);
    			destroy_component(codesyntax4);
    			destroy_component(paragraph8);
    			destroy_component(codesyntax5);
    			destroy_component(image1);
    			destroy_component(paragraph9);
    			destroy_component(codesyntax6);
    			destroy_component(paragraph10);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReactiveUserComponent', slots, []);

    	const article = {
    		head: `User Component`,
    		description: `Yarım kalmış bir User Component'imiz bulunuyordu. 
      Tanımladığımız _Store_ değerlerini User componenti değerlerinde 
      kullanalım. Burada yapacağımız son rötüşlar ile birlikte kullanıcının oyun
      arayüzüne erişmesini sağlayalım.`,
    		otherDescription: `_ImageAvatar.svelte_ componenti üzerinde, kullanıcı 
      avatar'a click eventini gerçekleştirdiğinde, 'userInfo' classinda 
      oluşturduğumuz avatar değerini güncelleyelim.`,
    		anotherDescription: `Bu güncelleme ile birlikte kullanıcının seçtiği ve 
      mouse ile üzerinde gezindiği avatarların 'opacity' değeri değişerek avatar
      resmi vurgulanacak.`,
    		anAnotherDescription: `Import ettiğimiz UserInfo class'inda yer alan $name 
      store değerini, 'bind:value' metodu ile güncelleyebiliriz.`, // 💩
    		moreAnotherDescription: `Şimdi en güzel tarafına gelelim.. Son rötüşları 
      yapıp oyunu başlatalım. 
      'components > Playground > Wrapper > Playground.svelte' componenti 
      üzerinde bir if/else yapısı tanımlayalım. 'isStart' store değerimiz false
      ise kullanıcıyı _name&avatar_ seçimi yapabildiği Componente yönlendirsin.
      Bunun aksi ise basit bir hata bilgisi gösterelim.`, // 💩
    		moreDescription: `Döngüler gibi if/else Logic'leri kullanabilirsiniz. 'else
    if' ihtiyacında bir şart ifadesi olarak 'else if isStart === undefined' 
    tanımlaman yeterli olacaktır.`,
    		descriptionCode: `StartGame fonksiyonu ile birlikte _name_ ve _avatar_ store
      değerleri kontrol edilecek. Bu değerlerin boş olmaması durumunda _isStart_
      store değerine true atanarak, oyun başlatılacak konsola bir bilgi 
      yazılacak. Bu değerlerden herhangi biri bulunmuyorsa _User_ componenti 
      bulunduğu yerde kalmaya devam edicektir. Böyle bir ihtimal için, class 
      directives kullanarak kullanıcıyı bilgilendirelim.`,
    		codeExplanation: `on:click metoduna bağladığımız fonksiyon ile kullanıcının 
      tıkladığı avatar üzerinde bilgiyi kolay bir şekilde elde edebiliyoruz. 
      Konsolu açarak, logları inceleyebilirsin.'ImageAvatar' componentine 
      parametre olarak gönderdiğimiz avatar bilgisine erişebiliyoruz, bunu 
      kullanarak fonksiyonu biraz daha basit hale getirelim.`,
    		otherCodeExplanation: `Kullanıcı avatarlar üzerine her click işlemi 
      gerçekleştirdiğinde, '$avatar' değerini güncelliyoruz. 
      'ImageAvatar.svelte' componentini geçmeden önce _class directives_ 
      kullanarak yıllaar yılllaarr önce tanımladığımız '.picked' ve ''.unpicked'
      classlarını anlamlı bir hale getirelim.`,
    		oneLineDescription: `Kullanıcıdan almamız gereken diğer bir değer, 
      username.`,
    		endStory: `Class Directive'lerde yardımına başvurabilmek için
      _isAvatarEmpty_ ve _isNameEmpty_ isminde iki farklı değer oluşturdum. 
      Button'ın altında bir 'div' etiketi daha oluşturarak, hata mesajını burada
      gösteriyorum. Name için olan hata mesajını sen düzenle.. Ve oluşturduğum 
      'div' etiketini bir component olarak yeniden oluşturup, hem name hemde 
      avatar için kullanabilirsin. Bunu yap, hemen ardından bir sonraki başlıkta
      seni bekliyorum.`,
    		image: `assets/components/User/class-directive.gif`,
    		anotherImage: `assets/components/User/start-game.gif`,
    		alternativeText: `Class Directives`,
    		anotherAlternativeText: `Class Directives`,
    		id: "reactive-user-component"
    	};

    	const code = `
    <script>
      import { userInfo } from "../../../Store/User";

      const { avatar } = userInfo;

      export let userAvatar;

      const setAvatar = () => {
        console.log("focus on avatar => ", userAvatar);

        $avatar = userAvatar;

        console.log($avatar);
      };
    <\/script>

    <img
      src={userAvatar}
      class="avatar unpicked"
      alt="avatar"
      on:click={setAvatar}
    />
  `;

    	const otherCode = `
    <script>
      import { userInfo } from "../../../Store/User";
  
      const { avatar } = userInfo;
  
      export let userAvatar;
  
      const avatarName = userAvatar.match(/\w*(?=.\w+$)/)[0];
    <\/script>

    <img
      src={userAvatar}
      class="avatar unpicked"
      alt="avatar"
      on:click={() => ($avatar = avatarName)}
    />
  `;

    	const oneMoreCode = `
    <img
      src={userAvatar}
      class="avatar unpicked"
      alt="avatar"
      class:picked={avatarName === $avatar}
      on:click={() => ($avatar = avatarName)}
      />
  `;

    	const anotherOneMoreCode = `
    <script>
      import { userInfo } from "../../../Store/User";

      const { name } = userInfo;
    <\/script>

    <div class="user">
      <input
        type="text"
        class="name"
        name="name"
        placeholder="pika pika"
        bind:value={$name}
      />
    </div>
  `;

    	const moreCode = `
    <script>
      import UserGround from "../../User/UserGround.svelte";
      import { userInfo } from "../../../Store/User";
  
      const { isStart } = userInfo;
    <\/script>

    <main class="playground">
      {#if $isStart}
        <h3>Start Game....</h3>
      {#else}
        <UserGround />
      {/if}
    </main>
  `;

    	const anotherAnOneMoreCode = `
    <script>
      import { userInfo } from "../../Store/User";
      
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
    <\/script>

    <div class="start">
      <button on:click={startGame}>Start</button>
    </div>
  `;

    	const endCode = `
    <script>
      import { userInfo } from "../../Store/User";
      
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
    <\/script>

    <div class="start">
      <button on:click={startGame}>Start</button>
      <div class="avatarError visible">
        <span class="unvisible" class:visible={$avatar === "" && isAvatarEmpty}>
          please, select a avatar..
        </span>
      </div>
    </div>
    
    <style>
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
    </style>
  `;

    	const title = `componenets > User > Avatars > ImageAvatar.svelte`;
    	const otherTitle = `componenets > User > Avatars > ImageAvatar.svelte`;
    	const oneMoreTitle = `_no title_`;

    	const anotherOneMoreTitle = `componenets > User > Avatars > 
    ImageAvatar.svelte`; //💩

    	const moreTitle = `componenets > Playground > Wrapper > Playground.svelte`; //💩
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReactiveUserComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		code,
    		otherCode,
    		oneMoreCode,
    		anotherOneMoreCode,
    		moreCode,
    		anotherAnOneMoreCode,
    		endCode,
    		title,
    		otherTitle,
    		oneMoreTitle,
    		anotherOneMoreTitle,
    		moreTitle
    	});

    	return [
    		article,
    		code,
    		otherCode,
    		oneMoreCode,
    		anotherOneMoreCode,
    		moreCode,
    		anotherAnOneMoreCode,
    		endCode,
    		title,
    		otherTitle,
    		oneMoreTitle,
    		anotherOneMoreTitle,
    		moreTitle
    	];
    }

    class ReactiveUserComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReactiveUserComponent",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\Docs\ReactiveVariables.svelte generated by Svelte v3.48.0 */
    const file$d = "src\\components\\Docs\\ReactiveVariables.svelte";

    function create_fragment$e(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let subheader;
    	let t1;
    	let paragraph0;
    	let t2;
    	let codesyntax;
    	let t3;
    	let paragraph1;
    	let t4;
    	let image;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	subheader = new SubHeader({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	codesyntax = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[2]
    			},
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(subheader.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(codesyntax.$$.fragment);
    			t3 = space();
    			create_component(paragraph1.$$.fragment);
    			t4 = space();
    			create_component(image.$$.fragment);
    			add_location(article_1, file$d, 63, 0, 1719);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(subheader, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(codesyntax, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(image, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(subheader.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(codesyntax.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(subheader.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(codesyntax.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(subheader);
    			destroy_component(paragraph0);
    			destroy_component(codesyntax);
    			destroy_component(paragraph1);
    			destroy_component(image);
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
    	validate_slots('ReactiveVariables', slots, []);

    	const article = {
    		head: `Reaktif değişkenler`,
    		description: `Değişkenlik gösterebilecek dinamik verilerin güncellendiğinde,
      DOM üzerinde yer alan referansı benzer olarak güncellenir.`,
    		otherDescription: `Tanımladığımız _numb_ değeri her güncellendiğinde, DOM 
      üzerinde bu değer yeniden ve sıkılmadan güncellenmeye devam edecektir.`,
    		image: `assets/documentation/reactive.gif`,
    		alternativeText: `Svelte definition variable`,
    		id: "reactive-variables"
    	};

    	const code = `
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
  `;

    	const title = `_app.svelte_`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReactiveVariables> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SubHeader,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		code,
    		title
    	});

    	return [article, code, title];
    }

    class ReactiveVariables extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReactiveVariables",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\components\Docs\Slots.svelte generated by Svelte v3.48.0 */
    const file$c = "src\\components\\Docs\\Slots.svelte";

    function create_fragment$d(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let childtitle;
    	let t1;
    	let paragraph;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	childtitle = new ChildTitle({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(childtitle.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			add_location(article_1, file$c, 14, 0, 506);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(childtitle, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(childtitle.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(childtitle.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(childtitle);
    			destroy_component(paragraph);
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
    	validate_slots('Slots', slots, []);

    	const article = {
    		head: `Slots`,
    		description: `Parent-child ilişkisinde olduğu gibi verilerin alt componente
      aktarılmasında kullanabilirsin. Bir template dahilinde (html içerikleri
      gibi) verilerin aktarılmasına izin verir.`,
    		id: "slots"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slots> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ChildTitle,
    		Paragraph,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class Slots extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slots",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\Docs\StartGame.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\components\\Docs\\StartGame.svelte";

    function create_fragment$c(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph;
    	let t2;
    	let image;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			t2 = space();
    			create_component(image.$$.fragment);
    			add_location(article_1, file$b, 24, 0, 1119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(image, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph);
    			destroy_component(image);
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
    	validate_slots('StartGame', slots, []);

    	const article = {
    		head: `Start Game`,
    		description: `Svelte'i biraz daha yakından tanıyoruz, birlikte uygulamamızı
      oluşturabilmek için yeteri kadar bilgi sahibi olduk. Kullanıcının arayüz 
      üzerinde görebileceği iki Component bulunuyor. Kullanıcı adı ve avatar 
      seçtiği User Component, bu seçimler sonrasında erişilen Playground 
      Component. User Componenti ile oyunumuzu oluşturmaya başlayalım. 
      [Yeni bir proje oluşturabilir]
      (#svelte-projesi-olusturma "Yeni bir Svelte Projesi oluştur") veya pratik
      yapabilmek için şuana kadarki kodları kaldırabilirsin. 
      _src > components > User_ ve _src > components > Playground_ klasörlerini
      oluşturalım.`,
    		image: `assets/documentation/start-folder.png`,
    		alternativeText: `start folder`,
    		id: "start-game"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StartGame> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class StartGame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StartGame",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\Docs\Store.svelte generated by Svelte v3.48.0 */
    const file$a = "src\\components\\Docs\\Store.svelte";

    function create_fragment$b(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let childtitle;
    	let t1;
    	let paragraph;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	childtitle = new ChildTitle({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(childtitle.$$.fragment);
    			t1 = space();
    			create_component(paragraph.$$.fragment);
    			add_location(article_1, file$a, 14, 0, 511);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(childtitle, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(childtitle.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(childtitle.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(childtitle);
    			destroy_component(paragraph);
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
    	validate_slots('Store', slots, []);

    	const article = {
    		head: `Store`,
    		description: `Veri taşımacılık ltd. şti.'nin joker kartı.. Verilerinizi her 
      yerde güncellenmesini, çağırılmasını sağlar. Kullanımı için bir hiyerarşi
      içerisinde olmasına gereksinimi bulunmuyor.`,
    		id: "store"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Store> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ChildTitle,
    		Paragraph,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class Store extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Store",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Docs\SvelteRun.svelte generated by Svelte v3.48.0 */
    const file$9 = "src\\components\\Docs\\SvelteRun.svelte";

    function create_fragment$a(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let t3;
    	let image;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(image.$$.fragment);
    			add_location(article_1, file$9, 21, 0, 941);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(image, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
    			destroy_component(image);
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
    	validate_slots('SvelteRun', slots, []);

    	const article = {
    		head: `Svelte nasıl çalışır?`,
    		description: `Svelte bileşenleri _.svelte_ uzantılı dosyalar ile 
      oluşturulur. HTML'e benzer olarak _script, style, html_ kod yapılarını 
      oluşturabilirdiğiniz üç farklı bölüm bulunuyor.`,
    		otherDescription: `Uygulama oluşturduğumuzda bu bileşenler derlenerek, 
      pure _Javascript_ kodlarına dönüştürülür. Svelte derleme işlemini runtime
      üzerinde gerçekleştiriyor. Bu derleme işlemiyle birlikte Virtual DOM 
      bağımlılığını ortadan kalkıyor.`,
    		image: `assets/documentation/build-map.png`,
    		alternativeText: `Svelte build file`,
    		id: "svelte-run"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteRun> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class SvelteRun extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteRun",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\Docs\UseOfComponent.svelte generated by Svelte v3.48.0 */
    const file$8 = "src\\components\\Docs\\UseOfComponent.svelte";

    function create_fragment$9(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let image0;
    	let t3;
    	let paragraph1;
    	let t4;
    	let codesyntax0;
    	let t5;
    	let paragraph2;
    	let t6;
    	let codesyntax1;
    	let t7;
    	let image1;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	image0 = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[3]
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*otherCode*/ ctx[2],
    				title: /*otherTitle*/ ctx[4]
    			},
    			$$inline: true
    		});

    	image1 = new Image({
    			props: {
    				image: /*article*/ ctx[0].anotherImage,
    				alternativeText: /*article*/ ctx[0].anotherAlternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(image0.$$.fragment);
    			t3 = space();
    			create_component(paragraph1.$$.fragment);
    			t4 = space();
    			create_component(codesyntax0.$$.fragment);
    			t5 = space();
    			create_component(paragraph2.$$.fragment);
    			t6 = space();
    			create_component(codesyntax1.$$.fragment);
    			t7 = space();
    			create_component(image1.$$.fragment);
    			add_location(article_1, file$8, 88, 0, 2604);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(image0, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(image1, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(image0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(image1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(image0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(image1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(image0);
    			destroy_component(paragraph1);
    			destroy_component(codesyntax0);
    			destroy_component(paragraph2);
    			destroy_component(codesyntax1);
    			destroy_component(image1);
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
    	validate_slots('UseOfComponent', slots, []);

    	const article = {
    		head: `Component kullanımı`,
    		description: `Uygulamalarımızda yer alan bileşenleri parçalayarak 
      istediğimiz gibi bir bütün haline getirebilmek üzerinde çalışırken 
      kolaylık sağlar, tekrar eden bileşen parçalarını yeniden çağırabilmek daha
      az efor sarfettirir.`,
    		otherDescription: `Bir önceki örnekte yaptığımız random sayı üreten basit 
      yapıyı bir component haline getirelim. 'components/Content/'' dizininde 
      'RandomNumber.svelte' dosyasını oluşturalım. Bu yeni componentimizi 
      'App.svelte' dosyasında kullanalım.`,
    		anotherDescription: `'RandomNumber' componentini istediğimiz gibi çağırarak
      kullanmaya başlayabiliriz..`,
    		image: `assets/components/component-with-sabuha.png`,
    		anotherImage: `assets/components/random-number-component.gif`,
    		alternativeText: `use of components`,
    		anotherAlternativeText: `Random Number Component`,
    		id: "use-of-component"
    	};

    	const code = `
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
  `;

    	const otherCode = `
    <script>
      import RandomNumber from "./components/Content/RandomNumber/RandomNumber.svelte";
    <\/script>

    <main>
      <RandomNumber />
      <RandomNumber />
      <RandomNumber />
      <RandomNumber />
    </main>

    <style></style>
  `;

    	const title = `Components > Content > RandomNumber.svelte`;
    	const otherTitle = `_App.svelte_`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseOfComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		code,
    		otherCode,
    		title,
    		otherTitle
    	});

    	return [article, code, otherCode, title, otherTitle];
    }

    class UseOfComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseOfComponent",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\Docs\UserComponent.svelte generated by Svelte v3.48.0 */
    const file$7 = "src\\components\\Docs\\UserComponent.svelte";

    function create_fragment$8(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let subheader;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let t3;
    	let paragraph2;
    	let t4;
    	let codesyntax0;
    	let t5;
    	let codesyntax1;
    	let t6;
    	let paragraph3;
    	let t7;
    	let image0;
    	let t8;
    	let paragraph4;
    	let t9;
    	let matter;
    	let t10;
    	let image1;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	subheader = new SubHeader({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[3]
    			},
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*otherCode*/ ctx[2],
    				title: /*otherTitle*/ ctx[4]
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anAnotherDescription
    			},
    			$$inline: true
    		});

    	image0 = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph4 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].moreAnotherDescription
    			},
    			$$inline: true
    		});

    	matter = new Matter({
    			props: { matter: /*article*/ ctx[0].material },
    			$$inline: true
    		});

    	image1 = new Image({
    			props: {
    				image: /*article*/ ctx[0].anotherImage,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(subheader.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(paragraph2.$$.fragment);
    			t4 = space();
    			create_component(codesyntax0.$$.fragment);
    			t5 = space();
    			create_component(codesyntax1.$$.fragment);
    			t6 = space();
    			create_component(paragraph3.$$.fragment);
    			t7 = space();
    			create_component(image0.$$.fragment);
    			t8 = space();
    			create_component(paragraph4.$$.fragment);
    			t9 = space();
    			create_component(matter.$$.fragment);
    			t10 = space();
    			create_component(image1.$$.fragment);
    			add_location(article_1, file$7, 79, 0, 2853);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(subheader, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(image0, article_1, null);
    			append_dev(article_1, t8);
    			mount_component(paragraph4, article_1, null);
    			append_dev(article_1, t9);
    			mount_component(matter, article_1, null);
    			append_dev(article_1, t10);
    			mount_component(image1, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(subheader.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(image0.$$.fragment, local);
    			transition_in(paragraph4.$$.fragment, local);
    			transition_in(matter.$$.fragment, local);
    			transition_in(image1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(subheader.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(image0.$$.fragment, local);
    			transition_out(paragraph4.$$.fragment, local);
    			transition_out(matter.$$.fragment, local);
    			transition_out(image1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(subheader);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
    			destroy_component(paragraph2);
    			destroy_component(codesyntax0);
    			destroy_component(codesyntax1);
    			destroy_component(paragraph3);
    			destroy_component(image0);
    			destroy_component(paragraph4);
    			destroy_component(matter);
    			destroy_component(image1);
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
    	validate_slots('UserComponent', slots, []);

    	const article = {
    		head: `User Component`,
    		description: `_User_ klasörü altında Kullanıcıdan alacağımız her değer için
      _Avatar_ ve _Name_ klasörlerini oluşturalım. Root klasörde _User_ 
      Component altında tanımlanan bütün yapıların yer alacağı bir kapsayıcı 
      dahil edeceğiz. _UserGround.svelte_ isminde bir dosya oluşturuyorum, 
      parçaladığımız bütün componentler burada yer alacak.`,
    		otherDescription: `_Playground_ klasörü içerisinde buna benzer bir yapıyı
      oluşturarak, oyun içerisindeki bütün componentleri aynı dosya üzerinde
      çağıracağız. _Playground_ altında _Wrapper > Playground.svelte_ dizin ve 
      dosyasını oluşturalım.`,
    		anotherDescription: `User Componenti üzerinde çalışırken, yapacağımız 
      değişiklikleri inceleyebilmek için User Component'ini 
      _Playground > Wrapper > Playground.svelte_ dosyasında çağıralım.`,
    		anAnotherDescription: `_User Component_ çağırdıktan sonra üzerinde 
      geliştirme yapmaya başlayalım.`, // 💩
    		moreAnotherDescription: `Component üzerinde 4 farklı bölüm yer alıyor.`, // 💩
    		material: [
    			`Kullanıcıyı bilgilendiren bir header yazısı`,
    			`Kullanıcının görseller üzerinden avatar seçimi yapabildiği bir bölüm`,
    			`Kullanıcı adının girilebilmesi için alan`,
    			`Ve bütün bunlar tamamlandığında oyuna start veren bir button elementi 
        bulunuyor.`
    		],
    		image: `assets/components/User/call-user-component.png`,
    		anotherImage: `assets/components/User/components-section.png`,
    		alternativeText: `Call User Component`,
    		anotherAlternativeText: `displaying components on the dom`,
    		id: "user-component"
    	};

    	const code = `
    <script>
      const componentDetail = "User";
    <\/script>

    <main>
      <h2>{componentDetail} Component</h2>
    </main>

    <style>
      h2 {
        color: white;
        background-color: orangered;
        text-align: center;
      }  
    </style>
  `;

    	const otherCode = `
    <script>
      import Userground from "../../User/Userground.svelte";
    <\/script>

    <main>
      <UserGround />
    </main>

    <style>
      h2 {
        color: white;
        background-color: orangered;
        text-align: center;
      }
    </style>
  `;

    	const title = `User > UserGround.svelte`;
    	const otherTitle = `_Playground > Wrapper > Playground.svelte_`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SubHeader,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		Matter,
    		article,
    		code,
    		otherCode,
    		title,
    		otherTitle
    	});

    	return [article, code, otherCode, title, otherTitle];
    }

    class UserComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserComponent",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\Docs\VaribleAccess.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\components\\Docs\\VaribleAccess.svelte";

    function create_fragment$7(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let subheader;
    	let t1;
    	let paragraph0;
    	let t2;
    	let codesyntax0;
    	let t3;
    	let paragraph1;
    	let t4;
    	let codesyntax1;
    	let t5;
    	let paragraph2;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	subheader = new SubHeader({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: { code: /*code*/ ctx[1], title },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: { code: /*otherCode*/ ctx[2], title },
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(subheader.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(codesyntax0.$$.fragment);
    			t3 = space();
    			create_component(paragraph1.$$.fragment);
    			t4 = space();
    			create_component(codesyntax1.$$.fragment);
    			t5 = space();
    			create_component(paragraph2.$$.fragment);
    			add_location(article_1, file$6, 49, 0, 1653);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(subheader, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph2, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(subheader.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(subheader.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(subheader);
    			destroy_component(paragraph0);
    			destroy_component(codesyntax0);
    			destroy_component(paragraph1);
    			destroy_component(codesyntax1);
    			destroy_component(paragraph2);
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

    const title = "_app.svelte_";

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VaribleAccess', slots, []);

    	const article = {
    		head: `Variable erişimi`,
    		description: `Script üzerinde tanımlanan değerleri html içerisinde 
      çağırabilmek için {} kullanılmalıdır. Bu template ile değer tipi 
      farketmeksizin değişkenleri çağırarak işlemler gerçekleştirilebilir.`,
    		otherDescription: `Bu tanımlama ile birlikte _user_ değerine tanımlanan her 
      değeri dinamik olarak _html_ içerisinde çağırabilirsin. biraz daha biraz 
      daha karıştıralım.. _user_ tanımlaması _sabuha_ değerine eşit olduğu 
      durumlarda 'seni izliyor!' yerine 'bir kedi gördüm sanki!' değerini ekrana
      getirelim.`,
    		anotherDescription: `_html_ içerisinde kullandığımız {} tagları arasında 
      condition yapıları gibi döngü, fonksiyon çağırma işlemleri 
      gerçekleştirebilirsin. Bu yapılara sahip birçok işlemi birlikte 
      gerçekleştireceğiz.`,
    		id: "hello-team"
    	};

    	const code = `
    <script>
      const user = "sabuha";
    <\/script>

    <span>{user} seni izliyor!</span>
    
    <style>
      span {
        color: rebeccapurple;
      }  
    </style>`;

    	const otherCode = `
    <script>
      const user = "sabuha";  
    <\/script>

    <span>{user === "sabuha" ? "bir kedi gördüm sanki!" : "seni izliyor!"}</span>

    <style></style>
  `;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VaribleAccess> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SubHeader,
    		Paragraph,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		code,
    		otherCode,
    		title
    	});

    	return [article, code, otherCode];
    }

    class VaribleAccess extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VaribleAccess",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\Docs\WhatIsSvelte.svelte generated by Svelte v3.48.0 */
    const file$5 = "src\\components\\Docs\\WhatIsSvelte.svelte";

    function create_fragment$6(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			add_location(article_1, file$5, 27, 0, 1500);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
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
    	validate_slots('WhatIsSvelte', slots, []);

    	const article = {
    		head: `Svelte nedir?`,
    		description: `Svelte günümüz modern library ve framework habitatının komplex
      yapılarını azaltarak daha basit şekilde yüksek verimliliğe sahip 
      uygulamalar geliştirilmesini sağlamayı amaçlayan bir derleyicidir. Modern
      framework/library ile birlikte geride bıraktığımız her süreçte farklı 
      ihtiyaçlar için yeni bir öğrenme süreci ortaya çıktı. Öğrenme döngüsünün 
      sürekli olarak geliştiricilerin karşısına çıkması bir süre sonrasında 
      illallah dedirtmeye başladığı gayet aşikar. Svelte alışık olduğumuz 
      _html & css & js_ kod yapılarına benzer bir sözdizimine sahip olması, 
      props ve state/stores güncellemeleri için 40 takla atılmasına gerek 
      kalınmaması gibi özellikleri ile bu döngünün dışına çıkmayı başarabilmiş..
      ve umuyorum ki bu şekilde sadeliğini korumaya devam edebilir.`,
    		otherDescription: `[Stack Overflow Developer Survey 2021]
      (https://insights.stackoverflow.com/survey/2021#section-most-loved-
      dreaded-and-wanted-web-frameworks "Stack Overflow Developer Survey 2021") 
      anketinde geliştiriciler tarafından %71.47 oranıyla en çok sevilen
      web framework Svelte olarak seçildi.`,
    		id: "what-is-svelte"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WhatIsSvelte> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		AccessArticle,
    		article
    	});

    	return [article];
    }

    class WhatIsSvelte extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WhatIsSvelte",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Docs\ShowCardsInYourHand.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\components\\Docs\\ShowCardsInYourHand.svelte";

    function create_fragment$5(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let t3;
    	let list;
    	let t4;
    	let paragraph2;
    	let t5;
    	let codesyntax0;
    	let t6;
    	let paragraph3;
    	let t7;
    	let image0;
    	let t8;
    	let paragraph4;
    	let t9;
    	let codesyntax1;
    	let t10;
    	let paragraph5;
    	let t11;
    	let image1;
    	let t12;
    	let paragraph6;
    	let t13;
    	let codesyntax2;
    	let t14;
    	let paragraph7;
    	let t15;
    	let codesyntax3;
    	let t16;
    	let codesyntax4;
    	let t17;
    	let codesyntax5;
    	let t18;
    	let paragraph8;
    	let t19;
    	let image2;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	list = new List({
    			props: { material: /*article*/ ctx[0].terms },
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax0 = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[7]
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: { text: /*article*/ ctx[0].codeExplanation },
    			$$inline: true
    		});

    	image0 = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph4 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anAnotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax1 = new CodeSyntax({
    			props: {
    				code: /*otherCode*/ ctx[2],
    				title: /*otherTitle*/ ctx[8]
    			},
    			$$inline: true
    		});

    	paragraph5 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherCodeExplanation
    			},
    			$$inline: true
    		});

    	image1 = new Image({
    			props: {
    				image: /*article*/ ctx[0].anotherImage,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph6 = new Paragraph({
    			props: { text: /*article*/ ctx[0].moreDescription },
    			$$inline: true
    		});

    	codesyntax2 = new CodeSyntax({
    			props: {
    				code: /*oneMoreCode*/ ctx[3],
    				title: /*oneMoreTitle*/ ctx[9]
    			},
    			$$inline: true
    		});

    	paragraph7 = new Paragraph({
    			props: { text: /*article*/ ctx[0].descriptionCode },
    			$$inline: true
    		});

    	codesyntax3 = new CodeSyntax({
    			props: {
    				code: /*moreCode*/ ctx[5],
    				title: /*moreTitle*/ ctx[10]
    			},
    			$$inline: true
    		});

    	codesyntax4 = new CodeSyntax({
    			props: {
    				code: /*anotherAnOneMoreCode*/ ctx[6],
    				title: /*anotherTitle*/ ctx[11]
    			},
    			$$inline: true
    		});

    	codesyntax5 = new CodeSyntax({
    			props: {
    				code: /*anotherOneMoreCode*/ ctx[4],
    				title: /*anotherTitle*/ ctx[11]
    			},
    			$$inline: true
    		});

    	paragraph8 = new Paragraph({
    			props: { text: /*article*/ ctx[0].endStory },
    			$$inline: true
    		});

    	image2 = new Image({
    			props: {
    				image: /*article*/ ctx[0].moreImage,
    				alternativeText: /*article*/ ctx[0].moreAlternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(list.$$.fragment);
    			t4 = space();
    			create_component(paragraph2.$$.fragment);
    			t5 = space();
    			create_component(codesyntax0.$$.fragment);
    			t6 = space();
    			create_component(paragraph3.$$.fragment);
    			t7 = space();
    			create_component(image0.$$.fragment);
    			t8 = space();
    			create_component(paragraph4.$$.fragment);
    			t9 = space();
    			create_component(codesyntax1.$$.fragment);
    			t10 = space();
    			create_component(paragraph5.$$.fragment);
    			t11 = space();
    			create_component(image1.$$.fragment);
    			t12 = space();
    			create_component(paragraph6.$$.fragment);
    			t13 = space();
    			create_component(codesyntax2.$$.fragment);
    			t14 = space();
    			create_component(paragraph7.$$.fragment);
    			t15 = space();
    			create_component(codesyntax3.$$.fragment);
    			t16 = space();
    			create_component(codesyntax4.$$.fragment);
    			t17 = space();
    			create_component(codesyntax5.$$.fragment);
    			t18 = space();
    			create_component(paragraph8.$$.fragment);
    			t19 = space();
    			create_component(image2.$$.fragment);
    			add_location(article_1, file$4, 277, 0, 9962);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(list, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(codesyntax0, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(image0, article_1, null);
    			append_dev(article_1, t8);
    			mount_component(paragraph4, article_1, null);
    			append_dev(article_1, t9);
    			mount_component(codesyntax1, article_1, null);
    			append_dev(article_1, t10);
    			mount_component(paragraph5, article_1, null);
    			append_dev(article_1, t11);
    			mount_component(image1, article_1, null);
    			append_dev(article_1, t12);
    			mount_component(paragraph6, article_1, null);
    			append_dev(article_1, t13);
    			mount_component(codesyntax2, article_1, null);
    			append_dev(article_1, t14);
    			mount_component(paragraph7, article_1, null);
    			append_dev(article_1, t15);
    			mount_component(codesyntax3, article_1, null);
    			append_dev(article_1, t16);
    			mount_component(codesyntax4, article_1, null);
    			append_dev(article_1, t17);
    			mount_component(codesyntax5, article_1, null);
    			append_dev(article_1, t18);
    			mount_component(paragraph8, article_1, null);
    			append_dev(article_1, t19);
    			mount_component(image2, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(list.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(codesyntax0.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(image0.$$.fragment, local);
    			transition_in(paragraph4.$$.fragment, local);
    			transition_in(codesyntax1.$$.fragment, local);
    			transition_in(paragraph5.$$.fragment, local);
    			transition_in(image1.$$.fragment, local);
    			transition_in(paragraph6.$$.fragment, local);
    			transition_in(codesyntax2.$$.fragment, local);
    			transition_in(paragraph7.$$.fragment, local);
    			transition_in(codesyntax3.$$.fragment, local);
    			transition_in(codesyntax4.$$.fragment, local);
    			transition_in(codesyntax5.$$.fragment, local);
    			transition_in(paragraph8.$$.fragment, local);
    			transition_in(image2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(list.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(codesyntax0.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(image0.$$.fragment, local);
    			transition_out(paragraph4.$$.fragment, local);
    			transition_out(codesyntax1.$$.fragment, local);
    			transition_out(paragraph5.$$.fragment, local);
    			transition_out(image1.$$.fragment, local);
    			transition_out(paragraph6.$$.fragment, local);
    			transition_out(codesyntax2.$$.fragment, local);
    			transition_out(paragraph7.$$.fragment, local);
    			transition_out(codesyntax3.$$.fragment, local);
    			transition_out(codesyntax4.$$.fragment, local);
    			transition_out(codesyntax5.$$.fragment, local);
    			transition_out(paragraph8.$$.fragment, local);
    			transition_out(image2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
    			destroy_component(list);
    			destroy_component(paragraph2);
    			destroy_component(codesyntax0);
    			destroy_component(paragraph3);
    			destroy_component(image0);
    			destroy_component(paragraph4);
    			destroy_component(codesyntax1);
    			destroy_component(paragraph5);
    			destroy_component(image1);
    			destroy_component(paragraph6);
    			destroy_component(codesyntax2);
    			destroy_component(paragraph7);
    			destroy_component(codesyntax3);
    			destroy_component(codesyntax4);
    			destroy_component(codesyntax5);
    			destroy_component(paragraph8);
    			destroy_component(image2);
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
    	validate_slots('ShowCardsInYourHand', slots, []);

    	const article = {
    		head: `Elindeki Kartları Göster ♠️`,
    		description: `Arayüz üzerindeki bu güncellemelerimizin ardından, oyun 
      alınımıza kartları sereserpebiliriz. Bu bölümde kartları oyun alanına
      random ekleyeceğiz. Kullanıcının her click eventi ile birlikte kartların
      içeriği görüntülenecek.`,
    		otherDescription: `Oyun arayüzünde birtakım işlemleri gerçekleştirebilmek 
      için bazı fonksiyonlar tanımlayacağız. SRC klasörümün altında GameAction
      isminde yeni bir klasör oluşturuyorum. Bu klasör altında tanımlayacağımız
      fonksiyonlar aşağıdaki işlemleri gerçekleştirecek:`,
    		anotherDescription: `Adım adım ilerleyelim.. Seviyeye bağımlı 
      olarak Arayüz üzerinde yer alacak sayı aralığını oluşturalım.`,
    		anAnotherDescription: `Parametre olarak verdiğimiz sayı değerleri 1, 5 ve 4
      değerleri konsol üzerinde görüntülenen array değerlerini oluşturmamızı 
      sağlıyor. Belirli aralıkları kapsayan bir sayımız bulunuyorsa, array 
      içerisinde yer alan sayıları random olarak karıştırmamızın önüne 
      geçebilecek bir durum bulunmuyor.`, // 💩
    		moreDescription: `Kartları oyun arayüzü üzerinde listeleyebilmemiz için 
      gerekli fonksiyonlarımızı oluşturduk. Bunları kullanarak Playground 
      alanını coşturalım.`,
    		descriptionCode: `Playground bileşeninde mixedListOfPokemon isminde store 
      değeri oluşturduk. Bu değer random sayıları, id değerlerimiz ile birlikte
      tutuyor. Bir döngü içerisinde bu değerleri props olarak Card ismindeki
      bileşene aktaralım. Aktarılan değerleri CardFront ve CardBack isimli 
      bileşenlerimizde kullancağız.`,
    		codeExplanation: `ListCards.svelte dosyasında yer alan list fonksiyonuna 
      ihtiyacım olduğu için modülü dışarı aktardım. Fonksiyonun basit bir görevi
      bulunuyor. Parametre olarak verilen değerle birlikte 5 sayı büyüklüğünde
      bir aralığı array tipinde döndürmelidir. 'range' değerimiz erişmek 
      istediğimiz toplam aralık uzunluğunu ifade ediyor. 
      'maxNumberReachedOnRange' değeri erişilecek olan maximum sayı değerini
      verirken, minNumberReachedOnRange değeri maximum değeri kullanarak minumum
      sayıyı elde etmemize imkan sağlıyor. Playground bileşenimizde çağırarak
      nasıl bir sonuç verdiğini kontol edelim.`,
    		otherCodeExplanation: `MixCards bileşeninde oluşturacağımız fonksiyonu 
      kullanarak, list fonksiyonundan elde ettiğimiz array içerisinde yer alan
      değerleri kopyalayacağız. Sayı aralığımız 5 olduğunda, yeni oluşacak olan
      array değerimizde toplamda 10 değer yer alacak. Bu değerler belirli bir
      sırayı takip etmek yerine array içerisinde random yer alacaklar. İlerde 
      kartları eşleştirebilme işlemi için, her kartın sıra numarasına göre 
      id değeri atayalım.`,
    		endStory: `Kartlarımızı arayüz üzerine başarılı bir şekilde sıraladık. 
      Bir önceki bölümde yaptığımız gibi, .flipper class değerinin bulunduğu 
      elemente .hover eklediğimizde kartın CardFront componentini 
      gözlemleyebiliriz.`,
    		image: `assets/components/GameAction/function-of-list-cards.png`,
    		anotherImage: `assets/components/GameAction/shuffle-cards.png`,
    		moreImage: `assets/components/GameAction/card-components.png`,
    		alternativeText: `Display of ListCards module on console`,
    		anotherAlternativeText: `Display of MixCards module on console`,
    		moreAlternativeText: `Observing CardFront and CardBack components`,
    		terms: [
    			{
    				command: `LevelUpdate`,
    				description: `Arayüz üzerinde bütün kartlar doğru eşleştirildiğinde, 
          bir sonraki seviye geçilmesi sağlanacak.`
    			},
    			{
    				command: `ListCards`,
    				description: `Arayüz üzerindeki kartlar seviyeye göre getirilecek. 
          1. seviyede 0-5 aralığında kartlar getirilirken, 2. seviyede 5-10 ve 
          3. seviyede 10-15 sayılarına ait kartlar arayüze yansıtılacak. Aralık 
          değerlerini buradaki fonksiyon ile kurgulayacağız.`
    			},
    			{
    				command: `MixCards`,
    				description: `Arayüz üzerine gelen kartlar bir sıra halinde değil, 
          random dağıtılmalıdır. MixCards fonksiyonu ile bunu 
          gerçekleştireceğiz.`
    			},
    			{
    				command: `CloseOpenCards`,
    				description: `Eşleşmeyen 2 kart açıldığında veya bütün kartlar doğru 
          eşleştiğinde bir sonraki erişilecek seviye için kartlar arayüzde 
          kapalı olmalıdır. Her iki durum için fonksiyonları tanımlayacağız.`
    			}
    		],
    		id: "show-cards-in-your-hand"
    	};

    	const code = `
    <script context="module">
      export const list = (level) => {
        const list = [];
        const range = 5;
        const maxNumberReachedOnRange = level * 5;
        let minNumberReachedOnRange = maxNumberReachedOnRange - 4;

        for(minNumberReachedOnRange; 
          minNumberReachedOnRange <= maxNumberReachedOnRange; 
          minNumberReachedOnRange++) {
          list.push(levelCounter);
        }

        return list;
      }
    <\/script>
  `;

    	const otherCode = `
    <script context="module">
      export const shuffle = (pokemonList) => {
        let shakeList = [];
        const duplicateList = pokemonList.concat(pokemonList);
        const totalNumberRange = duplicateList.length - 1;

        for(let counter = 0; counter <= totalNumberRange; counter++) {
          let pokemonNo = counter;
          const randomNumb = Math.trunc(Math.random() * duplicateList.length);

          shakeList = [
            { no: pokemonNo, id: duplicateList[randomNumber] },
            ...shakeList
          ];

          duplicateList.splice(duplicateList.indexOf(duplicateList[randomNumb]), 1);
        }

        return shakeList;
      }
    <\/script>
  `;

    	const oneMoreCode = `
      <script>
        import UserGround from "../../User/UserGround.svelte";
        import { userInfo } from "../../../Store/User";
        import Card from "./Cards/Card.svelte";
        import { list } from "../../GameAction/ListCards.svelte";
        import { shuffle } from "../../GameAction/MixCards.svelte";
        import { level } from "../../../Store/Level";

        const { isStart } = userInfo;
        $: pokemonList = list($level);
        $: mixedListOfPokemon = shuffle(pokemonList);
      <\/script>

      <main class="playground">
        {#if !$isStart}
          {#each mixedListOfPokemon as pokemon}
            <Card {pokemon} />
          {/each}
        {:else}
          <UserGround />
        {/if}
      </main>

      <style>
        .playground {
          width: 900px;
          margin: 0 auto;
          text-align: center;
        }
      </style>
  `;

    	const anotherOneMoreCode = `
    <script>
      export let pokemon;

      $: pokemonId = pokemon.id;
    <\/script>

    <div class="front">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonId}.png"
        alt="card on the playing field"
        class="single-poke"
      />
    </div>
    
    <style>
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
    </style>
  `;

    	const moreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
    <\/script>

    <main class="flip-container">
      <div class="flipper"></div>
    </main>

    <style>
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
    </style>
  `;

    	const anotherAnOneMoreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";

      export let pokemon;  
    <\/script>

    <main class="flip-container">
      <div class="flipper">
        <BackCardFace {pokemon} />
        <FrontCardFace {pokemon} />
      </div>
    </main>

    <style>
      .flip-container {
        perspective: 1000px;
        transform-style: preserve-3d;
        display: inline-block;
        margin: 5px;
        width: 100px;
        height: 100px;
      }

      .flipper {
        position: relative;
      }
    </style>
  `;

    	const title = `componenets > GameAction > ListCards.svelte`;
    	const otherTitle = `componenets > GameAction > MixCards.svelte`;

    	const oneMoreTitle = `components > Playground > Cards > Wrapper > 
    Playground.svelte`;

    	const moreTitle = `components > Playground > Wrapper > Cards > Card.svelte`;

    	const anotherTitle = `components > Playground > Wrapper > Cards > 
    CardBack.svelte`;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ShowCardsInYourHand> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		List,
    		article,
    		code,
    		otherCode,
    		oneMoreCode,
    		anotherOneMoreCode,
    		moreCode,
    		anotherAnOneMoreCode,
    		title,
    		otherTitle,
    		oneMoreTitle,
    		moreTitle,
    		anotherTitle
    	});

    	return [
    		article,
    		code,
    		otherCode,
    		oneMoreCode,
    		anotherOneMoreCode,
    		moreCode,
    		anotherAnOneMoreCode,
    		title,
    		otherTitle,
    		oneMoreTitle,
    		moreTitle,
    		anotherTitle
    	];
    }

    class ShowCardsInYourHand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ShowCardsInYourHand",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\Docs\CardSpinEffect.svelte generated by Svelte v3.48.0 */
    const file$3 = "src\\components\\Docs\\CardSpinEffect.svelte";

    function create_fragment$4(ctx) {
    	let article_1;
    	let accessarticle;
    	let t0;
    	let header;
    	let t1;
    	let paragraph0;
    	let t2;
    	let paragraph1;
    	let t3;
    	let paragraph2;
    	let t4;
    	let codesyntax;
    	let t5;
    	let paragraph3;
    	let t6;
    	let image0;
    	let t7;
    	let paragraph4;
    	let t8;
    	let paragraph5;
    	let t9;
    	let image1;
    	let t10;
    	let paragraph6;
    	let t11;
    	let paragraph7;
    	let t12;
    	let paragraph8;
    	let t13;
    	let image2;
    	let current;

    	accessarticle = new AccessArticle({
    			props: { link: /*article*/ ctx[0].id },
    			$$inline: true
    		});

    	header = new Header({
    			props: { head: /*article*/ ctx[0].head },
    			$$inline: true
    		});

    	paragraph0 = new Paragraph({
    			props: { text: /*article*/ ctx[0].description },
    			$$inline: true
    		});

    	paragraph1 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherDescription
    			},
    			$$inline: true
    		});

    	paragraph2 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anotherDescription
    			},
    			$$inline: true
    		});

    	codesyntax = new CodeSyntax({
    			props: {
    				code: /*code*/ ctx[1],
    				title: /*title*/ ctx[2]
    			},
    			$$inline: true
    		});

    	paragraph3 = new Paragraph({
    			props: { text: /*article*/ ctx[0].codeExplanation },
    			$$inline: true
    		});

    	image0 = new Image({
    			props: {
    				image: /*article*/ ctx[0].image,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph4 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].anAnotherDescription
    			},
    			$$inline: true
    		});

    	paragraph5 = new Paragraph({
    			props: {
    				text: /*article*/ ctx[0].otherCodeExplanation
    			},
    			$$inline: true
    		});

    	image1 = new Image({
    			props: {
    				image: /*article*/ ctx[0].anotherImage,
    				alternativeText: /*article*/ ctx[0].alternativeText
    			},
    			$$inline: true
    		});

    	paragraph6 = new Paragraph({
    			props: { text: /*article*/ ctx[0].moreDescription },
    			$$inline: true
    		});

    	paragraph7 = new Paragraph({
    			props: { text: /*article*/ ctx[0].descriptionCode },
    			$$inline: true
    		});

    	paragraph8 = new Paragraph({
    			props: { text: /*article*/ ctx[0].endStory },
    			$$inline: true
    		});

    	image2 = new Image({
    			props: {
    				image: /*article*/ ctx[0].moreImage,
    				alternativeText: /*article*/ ctx[0].moreAlternativeText
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article_1 = element("article");
    			create_component(accessarticle.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(paragraph0.$$.fragment);
    			t2 = space();
    			create_component(paragraph1.$$.fragment);
    			t3 = space();
    			create_component(paragraph2.$$.fragment);
    			t4 = space();
    			create_component(codesyntax.$$.fragment);
    			t5 = space();
    			create_component(paragraph3.$$.fragment);
    			t6 = space();
    			create_component(image0.$$.fragment);
    			t7 = space();
    			create_component(paragraph4.$$.fragment);
    			t8 = space();
    			create_component(paragraph5.$$.fragment);
    			t9 = space();
    			create_component(image1.$$.fragment);
    			t10 = space();
    			create_component(paragraph6.$$.fragment);
    			t11 = space();
    			create_component(paragraph7.$$.fragment);
    			t12 = space();
    			create_component(paragraph8.$$.fragment);
    			t13 = space();
    			create_component(image2.$$.fragment);
    			add_location(article_1, file$3, 38, 0, 1036);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article_1, anchor);
    			mount_component(accessarticle, article_1, null);
    			append_dev(article_1, t0);
    			mount_component(header, article_1, null);
    			append_dev(article_1, t1);
    			mount_component(paragraph0, article_1, null);
    			append_dev(article_1, t2);
    			mount_component(paragraph1, article_1, null);
    			append_dev(article_1, t3);
    			mount_component(paragraph2, article_1, null);
    			append_dev(article_1, t4);
    			mount_component(codesyntax, article_1, null);
    			append_dev(article_1, t5);
    			mount_component(paragraph3, article_1, null);
    			append_dev(article_1, t6);
    			mount_component(image0, article_1, null);
    			append_dev(article_1, t7);
    			mount_component(paragraph4, article_1, null);
    			append_dev(article_1, t8);
    			mount_component(paragraph5, article_1, null);
    			append_dev(article_1, t9);
    			mount_component(image1, article_1, null);
    			append_dev(article_1, t10);
    			mount_component(paragraph6, article_1, null);
    			append_dev(article_1, t11);
    			mount_component(paragraph7, article_1, null);
    			append_dev(article_1, t12);
    			mount_component(paragraph8, article_1, null);
    			append_dev(article_1, t13);
    			mount_component(image2, article_1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accessarticle.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(paragraph0.$$.fragment, local);
    			transition_in(paragraph1.$$.fragment, local);
    			transition_in(paragraph2.$$.fragment, local);
    			transition_in(codesyntax.$$.fragment, local);
    			transition_in(paragraph3.$$.fragment, local);
    			transition_in(image0.$$.fragment, local);
    			transition_in(paragraph4.$$.fragment, local);
    			transition_in(paragraph5.$$.fragment, local);
    			transition_in(image1.$$.fragment, local);
    			transition_in(paragraph6.$$.fragment, local);
    			transition_in(paragraph7.$$.fragment, local);
    			transition_in(paragraph8.$$.fragment, local);
    			transition_in(image2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accessarticle.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(paragraph0.$$.fragment, local);
    			transition_out(paragraph1.$$.fragment, local);
    			transition_out(paragraph2.$$.fragment, local);
    			transition_out(codesyntax.$$.fragment, local);
    			transition_out(paragraph3.$$.fragment, local);
    			transition_out(image0.$$.fragment, local);
    			transition_out(paragraph4.$$.fragment, local);
    			transition_out(paragraph5.$$.fragment, local);
    			transition_out(image1.$$.fragment, local);
    			transition_out(paragraph6.$$.fragment, local);
    			transition_out(paragraph7.$$.fragment, local);
    			transition_out(paragraph8.$$.fragment, local);
    			transition_out(image2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article_1);
    			destroy_component(accessarticle);
    			destroy_component(header);
    			destroy_component(paragraph0);
    			destroy_component(paragraph1);
    			destroy_component(paragraph2);
    			destroy_component(codesyntax);
    			destroy_component(paragraph3);
    			destroy_component(image0);
    			destroy_component(paragraph4);
    			destroy_component(paragraph5);
    			destroy_component(image1);
    			destroy_component(paragraph6);
    			destroy_component(paragraph7);
    			destroy_component(paragraph8);
    			destroy_component(image2);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardSpinEffect', slots, []);

    	const article = {
    		head: `Cards Spin Effect`,
    		description: ``,
    		otherDescription: ``,
    		anotherDescription: ``,
    		anAnotherDescription: ``, // 💩
    		moreDescription: ``,
    		descriptionCode: ``,
    		codeExplanation: ``,
    		otherCodeExplanation: ``,
    		endStory: ``,
    		image: `assets/components/GameAction/function-of-list-cards.png`,
    		alternativeText: ``,
    		id: "cards-spin-effects"
    	};

    	const code = ``;
    	const otherCode = ``;
    	const oneMoreCode = ``;
    	const anotherOneMoreCode = ``;
    	const moreCode = ``;
    	const anotherAnOneMoreCode = ``;
    	const title = `componenets > GameAction > ListCards.svelte`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardSpinEffect> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Paragraph,
    		Image,
    		AccessArticle,
    		CodeSyntax,
    		article,
    		code,
    		otherCode,
    		oneMoreCode,
    		anotherOneMoreCode,
    		moreCode,
    		anotherAnOneMoreCode,
    		title
    	});

    	return [article, code, title];
    }

    class CardSpinEffect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardSpinEffect",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Docs\Documentation.svelte generated by Svelte v3.48.0 */

    function create_fragment$3(ctx) {
    	let hello;
    	let t0;
    	let aboutproject;
    	let t1;
    	let whatissvelte;
    	let t2;
    	let svelterun;
    	let t3;
    	let basicterms;
    	let t4;
    	let createasvelteproject;
    	let t5;
    	let projectdependencies;
    	let t6;
    	let examinesveltestructure;
    	let t7;
    	let practice;
    	let t8;
    	let varibleaccess;
    	let t9;
    	let reactivevariables;
    	let t10;
    	let useofcomponent;
    	let t11;
    	let communicationbetweencomponent;
    	let t12;
    	let props;
    	let t13;
    	let slots;
    	let t14;
    	let context;
    	let t15;
    	let modulecontext;
    	let t16;
    	let store;
    	let t17;
    	let startgame;
    	let t18;
    	let usercomponent;
    	let t19;
    	let headercomponent;
    	let t20;
    	let avatarcomponent;
    	let t21;
    	let namecomponent;
    	let t22;
    	let gamerequirements;
    	let t23;
    	let reactiveusercomponent;
    	let t24;
    	let gameinterface;
    	let t25;
    	let cardcomponent;
    	let t26;
    	let showcardsinyourhand;
    	let t27;
    	let cardspineffect;
    	let current;
    	hello = new Hello({ $$inline: true });
    	aboutproject = new AboutGame({ $$inline: true });
    	whatissvelte = new WhatIsSvelte({ $$inline: true });
    	svelterun = new SvelteRun({ $$inline: true });
    	basicterms = new BasicTerms({ $$inline: true });
    	createasvelteproject = new CreateASvelteProject({ $$inline: true });
    	projectdependencies = new ProjectDependencies({ $$inline: true });
    	examinesveltestructure = new ExamineSvelteStructure({ $$inline: true });
    	practice = new Practice({ $$inline: true });
    	varibleaccess = new VaribleAccess({ $$inline: true });
    	reactivevariables = new ReactiveVariables({ $$inline: true });
    	useofcomponent = new UseOfComponent({ $$inline: true });
    	communicationbetweencomponent = new CommunicationBetweenComponent({ $$inline: true });
    	props = new Props({ $$inline: true });
    	slots = new Slots({ $$inline: true });
    	context = new Context({ $$inline: true });
    	modulecontext = new ModuleContext({ $$inline: true });
    	store = new Store({ $$inline: true });
    	startgame = new StartGame({ $$inline: true });
    	usercomponent = new UserComponent({ $$inline: true });
    	headercomponent = new HeaderComponent({ $$inline: true });
    	avatarcomponent = new AvatarComponent({ $$inline: true });
    	namecomponent = new NameComponent({ $$inline: true });
    	gamerequirements = new GameRequirements({ $$inline: true });
    	reactiveusercomponent = new ReactiveUserComponent({ $$inline: true });
    	gameinterface = new GameInterface({ $$inline: true });
    	cardcomponent = new CardComponent({ $$inline: true });
    	showcardsinyourhand = new ShowCardsInYourHand({ $$inline: true });
    	cardspineffect = new CardSpinEffect({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(hello.$$.fragment);
    			t0 = space();
    			create_component(aboutproject.$$.fragment);
    			t1 = space();
    			create_component(whatissvelte.$$.fragment);
    			t2 = space();
    			create_component(svelterun.$$.fragment);
    			t3 = space();
    			create_component(basicterms.$$.fragment);
    			t4 = space();
    			create_component(createasvelteproject.$$.fragment);
    			t5 = space();
    			create_component(projectdependencies.$$.fragment);
    			t6 = space();
    			create_component(examinesveltestructure.$$.fragment);
    			t7 = space();
    			create_component(practice.$$.fragment);
    			t8 = space();
    			create_component(varibleaccess.$$.fragment);
    			t9 = space();
    			create_component(reactivevariables.$$.fragment);
    			t10 = space();
    			create_component(useofcomponent.$$.fragment);
    			t11 = space();
    			create_component(communicationbetweencomponent.$$.fragment);
    			t12 = space();
    			create_component(props.$$.fragment);
    			t13 = space();
    			create_component(slots.$$.fragment);
    			t14 = space();
    			create_component(context.$$.fragment);
    			t15 = space();
    			create_component(modulecontext.$$.fragment);
    			t16 = space();
    			create_component(store.$$.fragment);
    			t17 = space();
    			create_component(startgame.$$.fragment);
    			t18 = space();
    			create_component(usercomponent.$$.fragment);
    			t19 = space();
    			create_component(headercomponent.$$.fragment);
    			t20 = space();
    			create_component(avatarcomponent.$$.fragment);
    			t21 = space();
    			create_component(namecomponent.$$.fragment);
    			t22 = space();
    			create_component(gamerequirements.$$.fragment);
    			t23 = space();
    			create_component(reactiveusercomponent.$$.fragment);
    			t24 = space();
    			create_component(gameinterface.$$.fragment);
    			t25 = space();
    			create_component(cardcomponent.$$.fragment);
    			t26 = space();
    			create_component(showcardsinyourhand.$$.fragment);
    			t27 = space();
    			create_component(cardspineffect.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(hello, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(aboutproject, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(whatissvelte, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(svelterun, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(basicterms, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(createasvelteproject, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(projectdependencies, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(examinesveltestructure, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(practice, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(varibleaccess, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(reactivevariables, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(useofcomponent, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(communicationbetweencomponent, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(props, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(slots, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(context, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(modulecontext, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(store, target, anchor);
    			insert_dev(target, t17, anchor);
    			mount_component(startgame, target, anchor);
    			insert_dev(target, t18, anchor);
    			mount_component(usercomponent, target, anchor);
    			insert_dev(target, t19, anchor);
    			mount_component(headercomponent, target, anchor);
    			insert_dev(target, t20, anchor);
    			mount_component(avatarcomponent, target, anchor);
    			insert_dev(target, t21, anchor);
    			mount_component(namecomponent, target, anchor);
    			insert_dev(target, t22, anchor);
    			mount_component(gamerequirements, target, anchor);
    			insert_dev(target, t23, anchor);
    			mount_component(reactiveusercomponent, target, anchor);
    			insert_dev(target, t24, anchor);
    			mount_component(gameinterface, target, anchor);
    			insert_dev(target, t25, anchor);
    			mount_component(cardcomponent, target, anchor);
    			insert_dev(target, t26, anchor);
    			mount_component(showcardsinyourhand, target, anchor);
    			insert_dev(target, t27, anchor);
    			mount_component(cardspineffect, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hello.$$.fragment, local);
    			transition_in(aboutproject.$$.fragment, local);
    			transition_in(whatissvelte.$$.fragment, local);
    			transition_in(svelterun.$$.fragment, local);
    			transition_in(basicterms.$$.fragment, local);
    			transition_in(createasvelteproject.$$.fragment, local);
    			transition_in(projectdependencies.$$.fragment, local);
    			transition_in(examinesveltestructure.$$.fragment, local);
    			transition_in(practice.$$.fragment, local);
    			transition_in(varibleaccess.$$.fragment, local);
    			transition_in(reactivevariables.$$.fragment, local);
    			transition_in(useofcomponent.$$.fragment, local);
    			transition_in(communicationbetweencomponent.$$.fragment, local);
    			transition_in(props.$$.fragment, local);
    			transition_in(slots.$$.fragment, local);
    			transition_in(context.$$.fragment, local);
    			transition_in(modulecontext.$$.fragment, local);
    			transition_in(store.$$.fragment, local);
    			transition_in(startgame.$$.fragment, local);
    			transition_in(usercomponent.$$.fragment, local);
    			transition_in(headercomponent.$$.fragment, local);
    			transition_in(avatarcomponent.$$.fragment, local);
    			transition_in(namecomponent.$$.fragment, local);
    			transition_in(gamerequirements.$$.fragment, local);
    			transition_in(reactiveusercomponent.$$.fragment, local);
    			transition_in(gameinterface.$$.fragment, local);
    			transition_in(cardcomponent.$$.fragment, local);
    			transition_in(showcardsinyourhand.$$.fragment, local);
    			transition_in(cardspineffect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hello.$$.fragment, local);
    			transition_out(aboutproject.$$.fragment, local);
    			transition_out(whatissvelte.$$.fragment, local);
    			transition_out(svelterun.$$.fragment, local);
    			transition_out(basicterms.$$.fragment, local);
    			transition_out(createasvelteproject.$$.fragment, local);
    			transition_out(projectdependencies.$$.fragment, local);
    			transition_out(examinesveltestructure.$$.fragment, local);
    			transition_out(practice.$$.fragment, local);
    			transition_out(varibleaccess.$$.fragment, local);
    			transition_out(reactivevariables.$$.fragment, local);
    			transition_out(useofcomponent.$$.fragment, local);
    			transition_out(communicationbetweencomponent.$$.fragment, local);
    			transition_out(props.$$.fragment, local);
    			transition_out(slots.$$.fragment, local);
    			transition_out(context.$$.fragment, local);
    			transition_out(modulecontext.$$.fragment, local);
    			transition_out(store.$$.fragment, local);
    			transition_out(startgame.$$.fragment, local);
    			transition_out(usercomponent.$$.fragment, local);
    			transition_out(headercomponent.$$.fragment, local);
    			transition_out(avatarcomponent.$$.fragment, local);
    			transition_out(namecomponent.$$.fragment, local);
    			transition_out(gamerequirements.$$.fragment, local);
    			transition_out(reactiveusercomponent.$$.fragment, local);
    			transition_out(gameinterface.$$.fragment, local);
    			transition_out(cardcomponent.$$.fragment, local);
    			transition_out(showcardsinyourhand.$$.fragment, local);
    			transition_out(cardspineffect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hello, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(aboutproject, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(whatissvelte, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(svelterun, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(basicterms, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(createasvelteproject, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(projectdependencies, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(examinesveltestructure, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(practice, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(varibleaccess, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(reactivevariables, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(useofcomponent, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(communicationbetweencomponent, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(props, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(slots, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(context, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(modulecontext, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(store, detaching);
    			if (detaching) detach_dev(t17);
    			destroy_component(startgame, detaching);
    			if (detaching) detach_dev(t18);
    			destroy_component(usercomponent, detaching);
    			if (detaching) detach_dev(t19);
    			destroy_component(headercomponent, detaching);
    			if (detaching) detach_dev(t20);
    			destroy_component(avatarcomponent, detaching);
    			if (detaching) detach_dev(t21);
    			destroy_component(namecomponent, detaching);
    			if (detaching) detach_dev(t22);
    			destroy_component(gamerequirements, detaching);
    			if (detaching) detach_dev(t23);
    			destroy_component(reactiveusercomponent, detaching);
    			if (detaching) detach_dev(t24);
    			destroy_component(gameinterface, detaching);
    			if (detaching) detach_dev(t25);
    			destroy_component(cardcomponent, detaching);
    			if (detaching) detach_dev(t26);
    			destroy_component(showcardsinyourhand, detaching);
    			if (detaching) detach_dev(t27);
    			destroy_component(cardspineffect, detaching);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Documentation', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Documentation> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		AboutProject: AboutGame,
    		AvatarComponent,
    		BasicTerms,
    		CardComponent,
    		CommunicationBetweenComponent,
    		Context,
    		CreateASvelteProject,
    		ExamineSvelteStructure,
    		GameInterface,
    		GameRequirements,
    		HeaderComponent,
    		Hello,
    		ModuleContext,
    		NameComponent,
    		Practice,
    		ProjectDependencies,
    		Props,
    		ReactiveUserComponent,
    		ReactiveVariables,
    		Slots,
    		StartGame,
    		Store,
    		SvelteRun,
    		UseOfComponent,
    		UserComponent,
    		VaribleAccess,
    		WhatIsSvelte,
    		ShowCardsInYourHand,
    		CardSpinEffect
    	});

    	return [];
    }

    class Documentation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Documentation",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var Title="ContentMap";var Description="content headers of description files";var SupportedLanguages=["ENG"];var Headers={English:[{title:"hi",target:"#hi-to-you"},{title:"about the project",target:"#about-the-project"},{title:"what is svelte?",target:"#what-is-svelte"},{title:"how does Svelte work?",target:"#how-does-svelte-work"},{title:"create a Svelte project",target:"#create-a-svelte-project"},{title:"dependencies",target:"#dependencies"},{title:"directory and component structure",target:"directory-and-component-structure"},{title:"deploy with github page",target:"deploy-with-github-pages"}]};var content = {Title:Title,Description:Description,SupportedLanguages:SupportedLanguages,Headers:Headers};

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
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (16:6) {#each English as ContentMap}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*ContentMap*/ ctx[2].title[0].toUpperCase() + /*ContentMap*/ ctx[2].title.slice(1) + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", /*ContentMap*/ ctx[2].target);
    			attr_dev(a, "class", "svelte-glmfl1");
    			add_location(a, file$2, 17, 10, 416);
    			attr_dev(li, "class", "svelte-glmfl1");
    			add_location(li, file$2, 16, 8, 400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(16:6) {#each English as ContentMap}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let docs;
    	let t0;
    	let div;
    	let img;
    	let img_src_value;
    	let t1;
    	let ul;
    	let current;
    	docs = new Documentation({ $$inline: true });
    	let each_value = /*English*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(docs.$$.fragment);
    			t0 = space();
    			div = element("div");
    			img = element("img");
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img.src, img_src_value = /*svelteLogo*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Svelte logo");
    			attr_dev(img, "class", "logo svelte-glmfl1");
    			add_location(img, file$2, 13, 4, 288);
    			attr_dev(ul, "class", "svelte-glmfl1");
    			add_location(ul, file$2, 14, 4, 349);
    			attr_dev(div, "class", "content-map svelte-glmfl1");
    			add_location(div, file$2, 12, 2, 257);
    			attr_dev(main, "class", "container svelte-glmfl1");
    			add_location(main, file$2, 9, 0, 215);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(docs, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			append_dev(div, img);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*English*/ 1) {
    				each_value = /*English*/ ctx[0];
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
    			if (detaching) detach_dev(main);
    			destroy_component(docs);
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
    	let { English } = Headers;
    	let svelteLogo = "assets/svelte-logo.png";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Docs: Documentation, ContentMap, English, svelteLogo });

    	$$self.$inject_state = $$props => {
    		if ('English' in $$props) $$invalidate(0, English = $$props.English);
    		if ('svelteLogo' in $$props) $$invalidate(1, svelteLogo = $$props.svelteLogo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [English, svelteLogo];
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
    			attr_dev(li, "class", "svelte-1vde9jl");
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

    			attr_dev(ul, "class", "svelte-1vde9jl");
    			add_location(ul, file$1, 9, 2, 182);
    			attr_dev(div, "class", "contents svelte-1vde9jl");
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
