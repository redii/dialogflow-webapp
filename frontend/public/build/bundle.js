
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
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
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
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
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

    function isObject$1(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    /* node_modules/sveltestrap/src/Col.svelte generated by Svelte v3.48.0 */
    const file$3 = "node_modules/sveltestrap/src/Col.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: div_class_value = /*colClasses*/ ctx[0].join(' ')
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$3, 63, 0, 1536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				{ class: div_class_value }
    			]));
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	const omit_props_names = ["class","xs","sm","md","lg","xl","xxl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Col', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { xs = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	const colClasses = [];
    	const lookup = { xs, sm, md, lg, xl, xxl };

    	Object.keys(lookup).forEach(colWidth => {
    		const columnProp = lookup[colWidth];

    		if (!columnProp && columnProp !== '') {
    			return; //no value for this width
    		}

    		const isXs = colWidth === 'xs';

    		if (isObject$1(columnProp)) {
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			if (columnProp.size || columnProp.size === '') {
    				colClasses.push(colClass);
    			}

    			if (columnProp.push) {
    				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
    			}

    			if (columnProp.pull) {
    				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
    			}

    			if (columnProp.offset) {
    				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    			}

    			if (columnProp.order) {
    				colClasses.push(`order${colSizeInterfix}${columnProp.order}`);
    			}
    		} else {
    			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    		}
    	});

    	if (!colClasses.length) {
    		colClasses.push('col');
    	}

    	if (className) {
    		colClasses.push(className);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('xs' in $$new_props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(7, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(8, xxl = $$new_props.xxl);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getColumnSizeClass,
    		isObject: isObject$1,
    		className,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		colClasses,
    		lookup
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('xs' in $$props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(7, xl = $$new_props.xl);
    		if ('xxl' in $$props) $$invalidate(8, xxl = $$new_props.xxl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colClasses, $$restProps, className, xs, sm, md, lg, xl, xxl, $$scope, slots];
    }

    class Col extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			class: 2,
    			xs: 3,
    			sm: 4,
    			md: 5,
    			lg: 6,
    			xl: 7,
    			xxl: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Col",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get class() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xxl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xxl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Row.svelte generated by Svelte v3.48.0 */
    const file$2 = "node_modules/sveltestrap/src/Row.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$2, 40, 0, 1012);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[9](null);
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

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === 'object') {
    		return ['xs', 'sm', 'md', 'lg', 'xl'].map(colWidth => {
    			const isXs = colWidth === 'xs';
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === 'number' && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols","inner"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;
    	let { inner = undefined } = $$props;

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('noGutters' in $$new_props) $$invalidate(4, noGutters = $$new_props.noGutters);
    		if ('form' in $$new_props) $$invalidate(5, form = $$new_props.form);
    		if ('cols' in $$new_props) $$invalidate(6, cols = $$new_props.cols);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		noGutters,
    		form,
    		cols,
    		inner,
    		getCols,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('noGutters' in $$props) $$invalidate(4, noGutters = $$new_props.noGutters);
    		if ('form' in $$props) $$invalidate(5, form = $$new_props.form);
    		if ('cols' in $$props) $$invalidate(6, cols = $$new_props.cols);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 120) {
    			$$invalidate(1, classes = classnames(className, noGutters ? 'gx-0' : null, form ? 'form-row' : 'row', ...getCols(cols)));
    		}
    	};

    	return [
    		inner,
    		classes,
    		$$restProps,
    		className,
    		noGutters,
    		form,
    		cols,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			class: 3,
    			noGutters: 4,
    			form: 5,
    			cols: 6,
    			inner: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get class() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutters() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutters(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // eslint-lint-disable-next-line @typescript-eslint/naming-convention
    class HTTPError extends Error {
        constructor(response, request, options) {
            const code = (response.status || response.status === 0) ? response.status : '';
            const title = response.statusText || '';
            const status = `${code} ${title}`.trim();
            const reason = status ? `status code ${status}` : 'an unknown error';
            super(`Request failed with ${reason}`);
            this.name = 'HTTPError';
            this.response = response;
            this.request = request;
            this.options = options;
        }
    }

    class TimeoutError extends Error {
        constructor(request) {
            super('Request timed out');
            this.name = 'TimeoutError';
            this.request = request;
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    const isObject = (value) => value !== null && typeof value === 'object';

    const validateAndMerge = (...sources) => {
        for (const source of sources) {
            if ((!isObject(source) || Array.isArray(source)) && typeof source !== 'undefined') {
                throw new TypeError('The `options` argument must be an object');
            }
        }
        return deepMerge({}, ...sources);
    };
    const mergeHeaders = (source1 = {}, source2 = {}) => {
        const result = new globalThis.Headers(source1);
        const isHeadersInstance = source2 instanceof globalThis.Headers;
        const source = new globalThis.Headers(source2);
        for (const [key, value] of source.entries()) {
            if ((isHeadersInstance && value === 'undefined') || value === undefined) {
                result.delete(key);
            }
            else {
                result.set(key, value);
            }
        }
        return result;
    };
    // TODO: Make this strongly-typed (no `any`).
    const deepMerge = (...sources) => {
        let returnValue = {};
        let headers = {};
        for (const source of sources) {
            if (Array.isArray(source)) {
                if (!Array.isArray(returnValue)) {
                    returnValue = [];
                }
                returnValue = [...returnValue, ...source];
            }
            else if (isObject(source)) {
                for (let [key, value] of Object.entries(source)) {
                    if (isObject(value) && key in returnValue) {
                        value = deepMerge(returnValue[key], value);
                    }
                    returnValue = { ...returnValue, [key]: value };
                }
                if (isObject(source.headers)) {
                    headers = mergeHeaders(headers, source.headers);
                    returnValue.headers = headers;
                }
            }
        }
        return returnValue;
    };

    const supportsAbortController = typeof globalThis.AbortController === 'function';
    const supportsStreams = typeof globalThis.ReadableStream === 'function';
    const supportsFormData = typeof globalThis.FormData === 'function';
    const requestMethods = ['get', 'post', 'put', 'patch', 'head', 'delete'];
    const responseTypes = {
        json: 'application/json',
        text: 'text/*',
        formData: 'multipart/form-data',
        arrayBuffer: '*/*',
        blob: '*/*',
    };
    // The maximum value of a 32bit int (see issue #117)
    const maxSafeTimeout = 2147483647;
    const stop = Symbol('stop');

    const normalizeRequestMethod = (input) => requestMethods.includes(input) ? input.toUpperCase() : input;
    const retryMethods = ['get', 'put', 'head', 'delete', 'options', 'trace'];
    const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];
    const retryAfterStatusCodes = [413, 429, 503];
    const defaultRetryOptions = {
        limit: 2,
        methods: retryMethods,
        statusCodes: retryStatusCodes,
        afterStatusCodes: retryAfterStatusCodes,
        maxRetryAfter: Number.POSITIVE_INFINITY,
    };
    const normalizeRetryOptions = (retry = {}) => {
        if (typeof retry === 'number') {
            return {
                ...defaultRetryOptions,
                limit: retry,
            };
        }
        if (retry.methods && !Array.isArray(retry.methods)) {
            throw new Error('retry.methods must be an array');
        }
        if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
            throw new Error('retry.statusCodes must be an array');
        }
        return {
            ...defaultRetryOptions,
            ...retry,
            afterStatusCodes: retryAfterStatusCodes,
        };
    };

    // `Promise.race()` workaround (#91)
    const timeout = async (request, abortController, options) => new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            if (abortController) {
                abortController.abort();
            }
            reject(new TimeoutError(request));
        }, options.timeout);
        void options
            .fetch(request)
            .then(resolve)
            .catch(reject)
            .then(() => {
            clearTimeout(timeoutId);
        });
    });
    const delay = async (ms) => new Promise(resolve => {
        setTimeout(resolve, ms);
    });

    class Ky {
        // eslint-disable-next-line complexity
        constructor(input, options = {}) {
            var _a, _b, _c;
            this._retryCount = 0;
            this._input = input;
            this._options = {
                // TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
                credentials: this._input.credentials || 'same-origin',
                ...options,
                headers: mergeHeaders(this._input.headers, options.headers),
                hooks: deepMerge({
                    beforeRequest: [],
                    beforeRetry: [],
                    beforeError: [],
                    afterResponse: [],
                }, options.hooks),
                method: normalizeRequestMethod((_a = options.method) !== null && _a !== void 0 ? _a : this._input.method),
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                prefixUrl: String(options.prefixUrl || ''),
                retry: normalizeRetryOptions(options.retry),
                throwHttpErrors: options.throwHttpErrors !== false,
                timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout,
                fetch: (_b = options.fetch) !== null && _b !== void 0 ? _b : globalThis.fetch.bind(globalThis),
            };
            if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
                throw new TypeError('`input` must be a string, URL, or Request');
            }
            if (this._options.prefixUrl && typeof this._input === 'string') {
                if (this._input.startsWith('/')) {
                    throw new Error('`input` must not begin with a slash when using `prefixUrl`');
                }
                if (!this._options.prefixUrl.endsWith('/')) {
                    this._options.prefixUrl += '/';
                }
                this._input = this._options.prefixUrl + this._input;
            }
            if (supportsAbortController) {
                this.abortController = new globalThis.AbortController();
                if (this._options.signal) {
                    this._options.signal.addEventListener('abort', () => {
                        this.abortController.abort();
                    });
                }
                this._options.signal = this.abortController.signal;
            }
            this.request = new globalThis.Request(this._input, this._options);
            if (this._options.searchParams) {
                // eslint-disable-next-line unicorn/prevent-abbreviations
                const textSearchParams = typeof this._options.searchParams === 'string'
                    ? this._options.searchParams.replace(/^\?/, '')
                    : new URLSearchParams(this._options.searchParams).toString();
                // eslint-disable-next-line unicorn/prevent-abbreviations
                const searchParams = '?' + textSearchParams;
                const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
                // To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
                if (((supportsFormData && this._options.body instanceof globalThis.FormData)
                    || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers['content-type'])) {
                    this.request.headers.delete('content-type');
                }
                this.request = new globalThis.Request(new globalThis.Request(url, this.request), this._options);
            }
            if (this._options.json !== undefined) {
                this._options.body = JSON.stringify(this._options.json);
                this.request.headers.set('content-type', (_c = this._options.headers.get('content-type')) !== null && _c !== void 0 ? _c : 'application/json');
                this.request = new globalThis.Request(this.request, { body: this._options.body });
            }
        }
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        static create(input, options) {
            const ky = new Ky(input, options);
            const fn = async () => {
                if (ky._options.timeout > maxSafeTimeout) {
                    throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
                }
                // Delay the fetch so that body method shortcuts can set the Accept header
                await Promise.resolve();
                let response = await ky._fetch();
                for (const hook of ky._options.hooks.afterResponse) {
                    // eslint-disable-next-line no-await-in-loop
                    const modifiedResponse = await hook(ky.request, ky._options, ky._decorateResponse(response.clone()));
                    if (modifiedResponse instanceof globalThis.Response) {
                        response = modifiedResponse;
                    }
                }
                ky._decorateResponse(response);
                if (!response.ok && ky._options.throwHttpErrors) {
                    let error = new HTTPError(response, ky.request, ky._options);
                    for (const hook of ky._options.hooks.beforeError) {
                        // eslint-disable-next-line no-await-in-loop
                        error = await hook(error);
                    }
                    throw error;
                }
                // If `onDownloadProgress` is passed, it uses the stream API internally
                /* istanbul ignore next */
                if (ky._options.onDownloadProgress) {
                    if (typeof ky._options.onDownloadProgress !== 'function') {
                        throw new TypeError('The `onDownloadProgress` option must be a function');
                    }
                    if (!supportsStreams) {
                        throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
                    }
                    return ky._stream(response.clone(), ky._options.onDownloadProgress);
                }
                return response;
            };
            const isRetriableMethod = ky._options.retry.methods.includes(ky.request.method.toLowerCase());
            const result = (isRetriableMethod ? ky._retry(fn) : fn());
            for (const [type, mimeType] of Object.entries(responseTypes)) {
                result[type] = async () => {
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    ky.request.headers.set('accept', ky.request.headers.get('accept') || mimeType);
                    const awaitedResult = await result;
                    const response = awaitedResult.clone();
                    if (type === 'json') {
                        if (response.status === 204) {
                            return '';
                        }
                        if (options.parseJson) {
                            return options.parseJson(await response.text());
                        }
                    }
                    return response[type]();
                };
            }
            return result;
        }
        _calculateRetryDelay(error) {
            this._retryCount++;
            if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
                if (error instanceof HTTPError) {
                    if (!this._options.retry.statusCodes.includes(error.response.status)) {
                        return 0;
                    }
                    const retryAfter = error.response.headers.get('Retry-After');
                    if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
                        let after = Number(retryAfter);
                        if (Number.isNaN(after)) {
                            after = Date.parse(retryAfter) - Date.now();
                        }
                        else {
                            after *= 1000;
                        }
                        if (typeof this._options.retry.maxRetryAfter !== 'undefined' && after > this._options.retry.maxRetryAfter) {
                            return 0;
                        }
                        return after;
                    }
                    if (error.response.status === 413) {
                        return 0;
                    }
                }
                const BACKOFF_FACTOR = 0.3;
                return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
            }
            return 0;
        }
        _decorateResponse(response) {
            if (this._options.parseJson) {
                response.json = async () => this._options.parseJson(await response.text());
            }
            return response;
        }
        async _retry(fn) {
            try {
                return await fn();
                // eslint-disable-next-line @typescript-eslint/no-implicit-any-catch
            }
            catch (error) {
                const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
                if (ms !== 0 && this._retryCount > 0) {
                    await delay(ms);
                    for (const hook of this._options.hooks.beforeRetry) {
                        // eslint-disable-next-line no-await-in-loop
                        const hookResult = await hook({
                            request: this.request,
                            options: this._options,
                            error: error,
                            retryCount: this._retryCount,
                        });
                        // If `stop` is returned from the hook, the retry process is stopped
                        if (hookResult === stop) {
                            return;
                        }
                    }
                    return this._retry(fn);
                }
                throw error;
            }
        }
        async _fetch() {
            for (const hook of this._options.hooks.beforeRequest) {
                // eslint-disable-next-line no-await-in-loop
                const result = await hook(this.request, this._options);
                if (result instanceof Request) {
                    this.request = result;
                    break;
                }
                if (result instanceof Response) {
                    return result;
                }
            }
            if (this._options.timeout === false) {
                return this._options.fetch(this.request.clone());
            }
            return timeout(this.request.clone(), this.abortController, this._options);
        }
        /* istanbul ignore next */
        _stream(response, onDownloadProgress) {
            const totalBytes = Number(response.headers.get('content-length')) || 0;
            let transferredBytes = 0;
            return new globalThis.Response(new globalThis.ReadableStream({
                async start(controller) {
                    const reader = response.body.getReader();
                    if (onDownloadProgress) {
                        onDownloadProgress({ percent: 0, transferredBytes: 0, totalBytes }, new Uint8Array());
                    }
                    async function read() {
                        const { done, value } = await reader.read();
                        if (done) {
                            controller.close();
                            return;
                        }
                        if (onDownloadProgress) {
                            transferredBytes += value.byteLength;
                            const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
                            onDownloadProgress({ percent, transferredBytes, totalBytes }, value);
                        }
                        controller.enqueue(value);
                        await read();
                    }
                    await read();
                },
            }));
        }
    }

    /*! MIT License © Sindre Sorhus */
    const createInstance = (defaults) => {
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        const ky = (input, options) => Ky.create(input, validateAndMerge(defaults, options));
        for (const method of requestMethods) {
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            ky[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, { method }));
        }
        ky.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
        ky.extend = (newDefaults) => createInstance(validateAndMerge(defaults, newDefaults));
        ky.stop = stop;
        return ky;
    };
    const ky = createInstance();
    var ky$1 = ky;

    const options = {
        credentials: "include",
        headers: {},
        hooks: {},
    };

    const http = ky$1.extend(options);

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    /* src/ChatBot.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/ChatBot.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    // (115:24) {#if msg.videos}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*msg*/ ctx[24].videos;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*messages*/ 8192) {
    				each_value_2 = /*msg*/ ctx[24].videos;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(115:24) {#if msg.videos}",
    		ctx
    	});

    	return block;
    }

    // (116:28) {#each msg.videos as videoID}
    function create_each_block_2(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "title", "YouTube Video");
    			attr_dev(iframe, "width", 300);
    			attr_dev(iframe, "height", 200);
    			if (!src_url_equal(iframe.src, iframe_src_value = `https://www.youtube.com/embed/${/*videoID*/ ctx[30]}`)) attr_dev(iframe, "src", iframe_src_value);
    			add_location(iframe, file$1, 116, 32, 3716);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*messages*/ 8192 && !src_url_equal(iframe.src, iframe_src_value = `https://www.youtube.com/embed/${/*videoID*/ ctx[30]}`)) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(116:28) {#each msg.videos as videoID}",
    		ctx
    	});

    	return block;
    }

    // (127:16) {#if msg.responses && msg.uid === messages.slice(-1)[0].uid}
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*msg*/ ctx[24].responses;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sendMessage, messages*/ 73728) {
    				each_value_1 = /*msg*/ ctx[24].responses;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(127:16) {#if msg.responses && msg.uid === messages.slice(-1)[0].uid}",
    		ctx
    	});

    	return block;
    }

    // (128:20) {#each msg.responses as response}
    function create_each_block_1(ctx) {
    	let button;
    	let t_value = /*response*/ ctx[27] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[21](/*response*/ ctx[27]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "chat-response svelte-sf0g8a");
    			add_location(button, file$1, 128, 24, 4270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*messages*/ 8192 && t_value !== (t_value = /*response*/ ctx[27] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(128:20) {#each msg.responses as response}",
    		ctx
    	});

    	return block;
    }

    // (110:12) {#each messages as msg}
    function create_each_block(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t0_value = /*msg*/ ctx[24].user + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*msg*/ ctx[24].text + "";
    	let t2;
    	let t3;
    	let div0_class_value;
    	let t4;
    	let show_if = /*msg*/ ctx[24].responses && /*msg*/ ctx[24].uid === /*messages*/ ctx[13].slice(-1)[0].uid;
    	let if_block1_anchor;
    	let if_block0 = /*msg*/ ctx[24].videos && create_if_block_2(ctx);
    	let if_block1 = show_if && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(":\n                        ");
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(span, "class", "svelte-sf0g8a");
    			add_location(span, file$1, 112, 24, 3518);
    			attr_dev(p, "class", "svelte-sf0g8a");
    			add_location(p, file$1, 113, 24, 3567);

    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty([
    				"chat-message",
    				/*msg*/ ctx[24].user === /*botName*/ ctx[0]
    				? "bot"
    				: "user"
    			].join(" ")) + " svelte-sf0g8a"));

    			add_location(div0, file$1, 111, 20, 3414);
    			attr_dev(div1, "class", "chat-message-wrapper svelte-sf0g8a");
    			add_location(div1, file$1, 110, 16, 3359);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			append_dev(div0, t3);
    			if (if_block0) if_block0.m(div0, null);
    			insert_dev(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*messages*/ 8192 && t0_value !== (t0_value = /*msg*/ ctx[24].user + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*messages*/ 8192 && t2_value !== (t2_value = /*msg*/ ctx[24].text + "")) set_data_dev(t2, t2_value);

    			if (/*msg*/ ctx[24].videos) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*messages, botName*/ 8193 && div0_class_value !== (div0_class_value = "" + (null_to_empty([
    				"chat-message",
    				/*msg*/ ctx[24].user === /*botName*/ ctx[0]
    				? "bot"
    				: "user"
    			].join(" ")) + " svelte-sf0g8a"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty[0] & /*messages*/ 8192) show_if = /*msg*/ ctx[24].responses && /*msg*/ ctx[24].uid === /*messages*/ ctx[13].slice(-1)[0].uid;

    			if (show_if) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t4);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(110:12) {#each messages as msg}",
    		ctx
    	});

    	return block;
    }

    // (133:12) {#if botTyping}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let span;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "   ...   ";
    			attr_dev(span, "class", "svelte-sf0g8a");
    			add_location(span, file$1, 135, 24, 4583);
    			attr_dev(div0, "class", "chat-message bot svelte-sf0g8a");
    			add_location(div0, file$1, 134, 20, 4528);
    			attr_dev(div1, "class", "chat-message-wrapper svelte-sf0g8a");
    			add_location(div1, file$1, 133, 16, 4473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(133:12) {#if botTyping}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div8;
    	let div4;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div3;
    	let div1;
    	let t1;
    	let t2;
    	let div2;
    	let t3;
    	let t4;
    	let div6;
    	let div5;
    	let t5;
    	let t6;
    	let div7;
    	let textarea;
    	let t7;
    	let button;
    	let img1;
    	let img1_src_value;
    	let mounted;
    	let dispose;
    	let each_value = /*messages*/ ctx[13];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*botTyping*/ ctx[12] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t1 = text(/*botName*/ ctx[0]);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(/*botStatus*/ ctx[1]);
    			t4 = space();
    			div6 = element("div");
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			div7 = element("div");
    			textarea = element("textarea");
    			t7 = space();
    			button = element("button");
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = /*botImage*/ ctx[2])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", /*botName*/ ctx[0]);
    			attr_dev(img0, "class", "svelte-sf0g8a");
    			add_location(img0, file$1, 100, 12, 2995);
    			attr_dev(div0, "class", "chat-header-image svelte-sf0g8a");
    			add_location(div0, file$1, 99, 8, 2951);
    			attr_dev(div1, "class", "chat-header-name svelte-sf0g8a");
    			add_location(div1, file$1, 103, 12, 3101);
    			attr_dev(div2, "class", "chat-header-info svelte-sf0g8a");
    			add_location(div2, file$1, 104, 12, 3159);
    			attr_dev(div3, "class", "chat-header-content svelte-sf0g8a");
    			add_location(div3, file$1, 102, 8, 3055);
    			attr_dev(div4, "class", "chat-header svelte-sf0g8a");
    			add_location(div4, file$1, 98, 4, 2917);
    			attr_dev(div5, "class", "chat-content svelte-sf0g8a");
    			add_location(div5, file$1, 108, 8, 3280);
    			attr_dev(div6, "class", "chat-content-wrapper svelte-sf0g8a");
    			add_location(div6, file$1, 107, 4, 3237);
    			attr_dev(textarea, "class", "chat-input svelte-sf0g8a");
    			add_location(textarea, file$1, 142, 8, 4768);
    			if (!src_url_equal(img1.src, img1_src_value = "https://i.ibb.co/fqwq9Y2/send.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Send");
    			attr_dev(img1, "class", "svelte-sf0g8a");
    			add_location(img1, file$1, 151, 12, 5032);
    			attr_dev(button, "class", "chat-submit svelte-sf0g8a");
    			button.disabled = /*botTyping*/ ctx[12];
    			add_location(button, file$1, 147, 8, 4898);
    			attr_dev(div7, "class", "chat-footer svelte-sf0g8a");
    			add_location(div7, file$1, 141, 4, 4734);
    			attr_dev(div8, "id", /*uid*/ ctx[15]);
    			attr_dev(div8, "class", "chat svelte-sf0g8a");
    			set_style(div8, "--font-family", /*fontFamily*/ ctx[3]);
    			set_style(div8, "--font-size", /*fontSize*/ ctx[4]);
    			set_style(div8, "--font-weight", /*fontWeight*/ ctx[5]);
    			set_style(div8, "--font-color-bot", /*fontColorBot*/ ctx[6]);
    			set_style(div8, "--font-color-user", /*fontColorUser*/ ctx[7]);
    			set_style(div8, "--bubble-color-bot", /*bubbleColorBot*/ ctx[8]);
    			set_style(div8, "--bubble-color-user", /*bubbleColorUser*/ ctx[9]);
    			set_style(div8, "--header-background-color", /*headerBackgroundColor*/ ctx[10]);
    			set_style(div8, "--chat-background-color", /*chatBackgroundColor*/ ctx[11]);
    			add_location(div8, file$1, 84, 0, 2460);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div4);
    			append_dev(div4, div0);
    			append_dev(div0, img0);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, t3);
    			append_dev(div8, t4);
    			append_dev(div8, div6);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			append_dev(div5, t5);
    			if (if_block) if_block.m(div5, null);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, textarea);
    			set_input_value(textarea, /*input*/ ctx[14]);
    			append_dev(div7, t7);
    			append_dev(div7, button);
    			append_dev(button, img1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[22]),
    					listen_dev(textarea, "keydown", /*textareaEnter*/ ctx[17], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*botImage*/ 4 && !src_url_equal(img0.src, img0_src_value = /*botImage*/ ctx[2])) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty[0] & /*botName*/ 1) {
    				attr_dev(img0, "alt", /*botName*/ ctx[0]);
    			}

    			if (dirty[0] & /*botName*/ 1) set_data_dev(t1, /*botName*/ ctx[0]);
    			if (dirty[0] & /*botStatus*/ 2) set_data_dev(t3, /*botStatus*/ ctx[1]);

    			if (dirty[0] & /*messages, sendMessage, botName*/ 73729) {
    				each_value = /*messages*/ ctx[13];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div5, t5);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*botTyping*/ ctx[12]) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div5, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*input*/ 16384) {
    				set_input_value(textarea, /*input*/ ctx[14]);
    			}

    			if (dirty[0] & /*botTyping*/ 4096) {
    				prop_dev(button, "disabled", /*botTyping*/ ctx[12]);
    			}

    			if (dirty[0] & /*fontFamily*/ 8) {
    				set_style(div8, "--font-family", /*fontFamily*/ ctx[3]);
    			}

    			if (dirty[0] & /*fontSize*/ 16) {
    				set_style(div8, "--font-size", /*fontSize*/ ctx[4]);
    			}

    			if (dirty[0] & /*fontWeight*/ 32) {
    				set_style(div8, "--font-weight", /*fontWeight*/ ctx[5]);
    			}

    			if (dirty[0] & /*fontColorBot*/ 64) {
    				set_style(div8, "--font-color-bot", /*fontColorBot*/ ctx[6]);
    			}

    			if (dirty[0] & /*fontColorUser*/ 128) {
    				set_style(div8, "--font-color-user", /*fontColorUser*/ ctx[7]);
    			}

    			if (dirty[0] & /*bubbleColorBot*/ 256) {
    				set_style(div8, "--bubble-color-bot", /*bubbleColorBot*/ ctx[8]);
    			}

    			if (dirty[0] & /*bubbleColorUser*/ 512) {
    				set_style(div8, "--bubble-color-user", /*bubbleColorUser*/ ctx[9]);
    			}

    			if (dirty[0] & /*headerBackgroundColor*/ 1024) {
    				set_style(div8, "--header-background-color", /*headerBackgroundColor*/ ctx[10]);
    			}

    			if (dirty[0] & /*chatBackgroundColor*/ 2048) {
    				set_style(div8, "--chat-background-color", /*chatBackgroundColor*/ ctx[11]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('ChatBot', slots, []);
    	let { apiUrl = "http://localhost:3000", botType = "dev", botName = "Max Mustermann", botStatus = "Online", botImage = "https://i.ibb.co/d29TyqJ/man-wearing-headset-giving-online-chat-support-attractive-unshaven-young-offering-client-services-he.jpg", typingTime = 500, fontFamily = "Helvetica", fontSize = "16px", fontWeight = "inherit", fontColorBot = "black", fontColorUser = "black", bubbleColorBot = "lightgrey", bubbleColorUser = "lightgreen", headerBackgroundColor = "white", chatBackgroundColor = "white" } = $$props;
    	const uid = v4();
    	let botTyping = false;
    	let messages = [];
    	let input = "";

    	function sendMessage(query) {
    		if (!query || botTyping) return;
    		$$invalidate(14, input = "");
    		$$invalidate(13, messages = [...messages, { uid: v4(), user: "You", text: query }]);
    		$$invalidate(12, botTyping = true);

    		setTimeout(
    			async () => {
    				const response = await http.get(`${apiUrl}?bot=${botType}&query=${query}`).json();
    				let msg = response.queryResult.fulfillmentText;

    				// check for responses
    				let responses = [];

    				if (msg.split("responses=").length > 1) {
    					responses = msg.split("responses=")[1].split(";");
    					msg = msg.split("responses=")[0];
    				}

    				// check for videos
    				let videos = [];

    				if (msg.split("youtube=").length > 1) {
    					videos = msg.split("youtube=")[1].split(";");
    					msg = msg.split("youtube=")[0];
    				}

    				$$invalidate(13, messages = [
    					...messages,
    					{
    						uid: v4(),
    						user: botName,
    						text: msg,
    						videos: videos.length ? videos : false,
    						responses: responses.length ? responses : false
    					}
    				]);

    				$$invalidate(12, botTyping = false);
    			},
    			typingTime
    		);
    	}

    	function textareaEnter(event) {
    		if (event.key === "Enter") {
    			event.preventDefault();
    			sendMessage(input);
    		}
    	}

    	const writable_props = [
    		'apiUrl',
    		'botType',
    		'botName',
    		'botStatus',
    		'botImage',
    		'typingTime',
    		'fontFamily',
    		'fontSize',
    		'fontWeight',
    		'fontColorBot',
    		'fontColorUser',
    		'bubbleColorBot',
    		'bubbleColorUser',
    		'headerBackgroundColor',
    		'chatBackgroundColor'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChatBot> was created with unknown prop '${key}'`);
    	});

    	const click_handler = response => sendMessage(response);

    	function textarea_input_handler() {
    		input = this.value;
    		$$invalidate(14, input);
    	}

    	const click_handler_1 = () => sendMessage(input);

    	$$self.$$set = $$props => {
    		if ('apiUrl' in $$props) $$invalidate(18, apiUrl = $$props.apiUrl);
    		if ('botType' in $$props) $$invalidate(19, botType = $$props.botType);
    		if ('botName' in $$props) $$invalidate(0, botName = $$props.botName);
    		if ('botStatus' in $$props) $$invalidate(1, botStatus = $$props.botStatus);
    		if ('botImage' in $$props) $$invalidate(2, botImage = $$props.botImage);
    		if ('typingTime' in $$props) $$invalidate(20, typingTime = $$props.typingTime);
    		if ('fontFamily' in $$props) $$invalidate(3, fontFamily = $$props.fontFamily);
    		if ('fontSize' in $$props) $$invalidate(4, fontSize = $$props.fontSize);
    		if ('fontWeight' in $$props) $$invalidate(5, fontWeight = $$props.fontWeight);
    		if ('fontColorBot' in $$props) $$invalidate(6, fontColorBot = $$props.fontColorBot);
    		if ('fontColorUser' in $$props) $$invalidate(7, fontColorUser = $$props.fontColorUser);
    		if ('bubbleColorBot' in $$props) $$invalidate(8, bubbleColorBot = $$props.bubbleColorBot);
    		if ('bubbleColorUser' in $$props) $$invalidate(9, bubbleColorUser = $$props.bubbleColorUser);
    		if ('headerBackgroundColor' in $$props) $$invalidate(10, headerBackgroundColor = $$props.headerBackgroundColor);
    		if ('chatBackgroundColor' in $$props) $$invalidate(11, chatBackgroundColor = $$props.chatBackgroundColor);
    	};

    	$$self.$capture_state = () => ({
    		http,
    		uuid: v4,
    		apiUrl,
    		botType,
    		botName,
    		botStatus,
    		botImage,
    		typingTime,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		fontColorBot,
    		fontColorUser,
    		bubbleColorBot,
    		bubbleColorUser,
    		headerBackgroundColor,
    		chatBackgroundColor,
    		uid,
    		botTyping,
    		messages,
    		input,
    		sendMessage,
    		textareaEnter
    	});

    	$$self.$inject_state = $$props => {
    		if ('apiUrl' in $$props) $$invalidate(18, apiUrl = $$props.apiUrl);
    		if ('botType' in $$props) $$invalidate(19, botType = $$props.botType);
    		if ('botName' in $$props) $$invalidate(0, botName = $$props.botName);
    		if ('botStatus' in $$props) $$invalidate(1, botStatus = $$props.botStatus);
    		if ('botImage' in $$props) $$invalidate(2, botImage = $$props.botImage);
    		if ('typingTime' in $$props) $$invalidate(20, typingTime = $$props.typingTime);
    		if ('fontFamily' in $$props) $$invalidate(3, fontFamily = $$props.fontFamily);
    		if ('fontSize' in $$props) $$invalidate(4, fontSize = $$props.fontSize);
    		if ('fontWeight' in $$props) $$invalidate(5, fontWeight = $$props.fontWeight);
    		if ('fontColorBot' in $$props) $$invalidate(6, fontColorBot = $$props.fontColorBot);
    		if ('fontColorUser' in $$props) $$invalidate(7, fontColorUser = $$props.fontColorUser);
    		if ('bubbleColorBot' in $$props) $$invalidate(8, bubbleColorBot = $$props.bubbleColorBot);
    		if ('bubbleColorUser' in $$props) $$invalidate(9, bubbleColorUser = $$props.bubbleColorUser);
    		if ('headerBackgroundColor' in $$props) $$invalidate(10, headerBackgroundColor = $$props.headerBackgroundColor);
    		if ('chatBackgroundColor' in $$props) $$invalidate(11, chatBackgroundColor = $$props.chatBackgroundColor);
    		if ('botTyping' in $$props) $$invalidate(12, botTyping = $$props.botTyping);
    		if ('messages' in $$props) $$invalidate(13, messages = $$props.messages);
    		if ('input' in $$props) $$invalidate(14, input = $$props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		botName,
    		botStatus,
    		botImage,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		fontColorBot,
    		fontColorUser,
    		bubbleColorBot,
    		bubbleColorUser,
    		headerBackgroundColor,
    		chatBackgroundColor,
    		botTyping,
    		messages,
    		input,
    		uid,
    		sendMessage,
    		textareaEnter,
    		apiUrl,
    		botType,
    		typingTime,
    		click_handler,
    		textarea_input_handler,
    		click_handler_1
    	];
    }

    class ChatBot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				apiUrl: 18,
    				botType: 19,
    				botName: 0,
    				botStatus: 1,
    				botImage: 2,
    				typingTime: 20,
    				fontFamily: 3,
    				fontSize: 4,
    				fontWeight: 5,
    				fontColorBot: 6,
    				fontColorUser: 7,
    				bubbleColorBot: 8,
    				bubbleColorUser: 9,
    				headerBackgroundColor: 10,
    				chatBackgroundColor: 11
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChatBot",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get apiUrl() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set apiUrl(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get botType() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set botType(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get botName() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set botName(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get botStatus() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set botStatus(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get botImage() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set botImage(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get typingTime() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set typingTime(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontFamily() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontFamily(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontWeight() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontWeight(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontColorBot() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontColorBot(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontColorUser() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontColorUser(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bubbleColorBot() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bubbleColorBot(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bubbleColorUser() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bubbleColorUser(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headerBackgroundColor() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headerBackgroundColor(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get chatBackgroundColor() {
    		throw new Error("<ChatBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chatBackgroundColor(value) {
    		throw new Error("<ChatBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    // (9:8) <Col md={6}>
    function create_default_slot_2(ctx) {
    	let chatbot;
    	let current;

    	chatbot = new ChatBot({
    			props: {
    				botType: "default",
    				botName: "Philipp Meier",
    				botStatus: "Dekan der Fakultät Maschinenbau",
    				fontFamily: "Times New Roman",
    				fontSize: "14px",
    				headerBackgroundColor: "lightgrey",
    				chatBackgroundColor: "lightgrey",
    				fontColorBot: "lightgrey",
    				fontColorUser: "lightgrey",
    				bubbleColorBot: "black",
    				bubbleColorUser: "#363b3f"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chatbot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chatbot, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chatbot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chatbot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chatbot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(9:8) <Col md={6}>",
    		ctx
    	});

    	return block;
    }

    // (23:8) <Col md={6}>
    function create_default_slot_1(ctx) {
    	let chatbot;
    	let current;

    	chatbot = new ChatBot({
    			props: {
    				botType: "inclusive",
    				botName: "Anushka",
    				botImage: "https://i.ibb.co/hgXR1qq/anushka.png",
    				fontFamily: "Arial",
    				fontSize: "20px",
    				fontColorBot: "black",
    				fontColorUser: "black",
    				bubbleColorBot: "#bccee1",
    				bubbleColorUser: "#b0efb0"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chatbot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chatbot, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chatbot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chatbot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chatbot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(23:8) <Col md={6}>",
    		ctx
    	});

    	return block;
    }

    // (8:4) <Row>
    function create_default_slot(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				md: 6,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				md: 6,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(8:4) <Row>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(row.$$.fragment);
    			attr_dev(main, "class", "svelte-eld5wd");
    			add_location(main, file, 6, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(row, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(row);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Row, Col, ChatBot });
    	return [];
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
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
