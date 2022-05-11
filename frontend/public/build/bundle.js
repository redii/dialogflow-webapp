
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

    /* src/Chat.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/Chat.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (78:24) {#if msg.video}
    function create_if_block_1(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "title", "youtube-video");
    			attr_dev(iframe, "width", 300);
    			attr_dev(iframe, "height", 200);
    			if (!src_url_equal(iframe.src, iframe_src_value = /*msg*/ ctx[7].video)) attr_dev(iframe, "src", iframe_src_value);
    			add_location(iframe, file$1, 78, 28, 2280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 2 && !src_url_equal(iframe.src, iframe_src_value = /*msg*/ ctx[7].video)) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(78:24) {#if msg.video}",
    		ctx
    	});

    	return block;
    }

    // (68:12) {#each messages as msg}
    function create_each_block(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t0_value = /*msg*/ ctx[7].user + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*msg*/ ctx[7].text + "";
    	let t2;
    	let t3;
    	let div0_class_value;
    	let if_block = /*msg*/ ctx[7].video && create_if_block_1(ctx);

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
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "svelte-tpqn1d");
    			add_location(span, file$1, 75, 24, 2145);
    			add_location(p, file$1, 76, 24, 2194);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(["chat-message", /*msg*/ ctx[7].user === "You" ? "user" : "bot"].join(" ")) + " svelte-tpqn1d"));
    			add_location(div0, file$1, 69, 20, 1915);
    			attr_dev(div1, "class", "chat-message-wrapper svelte-tpqn1d");
    			add_location(div1, file$1, 68, 16, 1860);
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
    			if (if_block) if_block.m(div0, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 2 && t0_value !== (t0_value = /*msg*/ ctx[7].user + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*messages*/ 2 && t2_value !== (t2_value = /*msg*/ ctx[7].text + "")) set_data_dev(t2, t2_value);

    			if (/*msg*/ ctx[7].video) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*messages*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(["chat-message", /*msg*/ ctx[7].user === "You" ? "user" : "bot"].join(" ")) + " svelte-tpqn1d"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(68:12) {#each messages as msg}",
    		ctx
    	});

    	return block;
    }

    // (89:12) {#if botTyping}
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
    			attr_dev(span, "class", "svelte-tpqn1d");
    			add_location(span, file$1, 91, 24, 2764);
    			attr_dev(div0, "class", "chat-message bot svelte-tpqn1d");
    			add_location(div0, file$1, 90, 20, 2709);
    			attr_dev(div1, "class", "chat-message-wrapper svelte-tpqn1d");
    			add_location(div1, file$1, 89, 16, 2654);
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
    		source: "(89:12) {#if botTyping}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let t2;
    	let div4;
    	let div3;
    	let t3;
    	let t4;
    	let div5;
    	let textarea;
    	let t5;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*messages*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*botTyping*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = `${/*bot*/ ctx[3].name}`;
    			t2 = space();
    			div4 = element("div");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			div5 = element("div");
    			textarea = element("textarea");
    			t5 = space();
    			button = element("button");
    			button.textContent = "=>";
    			if (!src_url_equal(img.src, img_src_value = /*bot*/ ctx[3].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Bot");
    			attr_dev(img, "class", "svelte-tpqn1d");
    			add_location(img, file$1, 61, 12, 1619);
    			attr_dev(div0, "class", "chat-header-image svelte-tpqn1d");
    			add_location(div0, file$1, 60, 8, 1575);
    			attr_dev(div1, "class", "chat-header-info svelte-tpqn1d");
    			add_location(div1, file$1, 63, 8, 1676);
    			attr_dev(div2, "class", "chat-header svelte-tpqn1d");
    			add_location(div2, file$1, 59, 4, 1541);
    			attr_dev(div3, "class", "chat-content svelte-tpqn1d");
    			add_location(div3, file$1, 66, 8, 1781);
    			attr_dev(div4, "class", "chat-content-wrapper svelte-tpqn1d");
    			add_location(div4, file$1, 65, 4, 1738);
    			attr_dev(textarea, "class", "chat-input svelte-tpqn1d");
    			add_location(textarea, file$1, 98, 8, 2949);
    			attr_dev(button, "class", "chat-submit svelte-tpqn1d");
    			add_location(button, file$1, 103, 8, 3079);
    			attr_dev(div5, "class", "chat-footer svelte-tpqn1d");
    			add_location(div5, file$1, 97, 4, 2915);
    			attr_dev(div6, "class", "chat svelte-tpqn1d");
    			add_location(div6, file$1, 58, 0, 1518);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div6, t2);
    			append_dev(div6, div4);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div3, t3);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, textarea);
    			set_input_value(textarea, /*input*/ ctx[2]);
    			append_dev(div5, t5);
    			append_dev(div5, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[6]),
    					listen_dev(textarea, "keydown", /*textareaEnter*/ ctx[5], false, false, false),
    					listen_dev(button, "click", /*sendMessage*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*messages*/ 2) {
    				each_value = /*messages*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, t3);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*botTyping*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*input*/ 4) {
    				set_input_value(textarea, /*input*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
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
    	validate_slots('Chat', slots, []);

    	const bot = {
    		name: "Max Mustermann",
    		image: "https://i.ibb.co/d29TyqJ/man-wearing-headset-giving-online-chat-support-attractive-unshaven-young-offering-client-services-he.jpg",
    		url: "https://dialogflow-backend.capr.hand.group"
    	};

    	let botTyping = false;
    	let messages = [];
    	let input = "";

    	function sendMessage() {
    		if (!input) return;
    		const query = input;
    		$$invalidate(2, input = "");
    		$$invalidate(1, messages = [...messages, { user: "You", text: query }]);

    		setTimeout(
    			async () => {
    				$$invalidate(0, botTyping = true);
    				const response = await http.get(`${bot.url}?query=${query}`).json();
    				let msg = response.queryResult.fulfillmentText;
    				let video_url = false;

    				if (msg.match(/(?:https?|ftp):\/\/[\n\S]+/g)) {
    					video_url = msg.match(/\bhttps?:\/\/\S+/gi)[0];
    					msg = msg.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
    				}

    				$$invalidate(1, messages = [
    					...messages,
    					{
    						user: bot.name,
    						text: msg,
    						video: video_url ? video_url : false
    					}
    				]);

    				$$invalidate(0, botTyping = false);
    			},
    			500
    		);
    	}

    	function textareaEnter(event) {
    		if (event.key === "Enter") {
    			event.preventDefault();
    			sendMessage();
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chat> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		input = this.value;
    		$$invalidate(2, input);
    	}

    	$$self.$capture_state = () => ({
    		http,
    		bot,
    		botTyping,
    		messages,
    		input,
    		sendMessage,
    		textareaEnter
    	});

    	$$self.$inject_state = $$props => {
    		if ('botTyping' in $$props) $$invalidate(0, botTyping = $$props.botTyping);
    		if ('messages' in $$props) $$invalidate(1, messages = $$props.messages);
    		if ('input' in $$props) $$invalidate(2, input = $$props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		botTyping,
    		messages,
    		input,
    		bot,
    		sendMessage,
    		textareaEnter,
    		textarea_input_handler
    	];
    }

    class Chat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chat",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let chat;
    	let current;
    	chat = new Chat({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(chat.$$.fragment);
    			attr_dev(main, "class", "svelte-eld5wd");
    			add_location(main, file, 5, 0, 100);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(chat, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(chat);
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

    	$$self.$capture_state = () => ({ Row, Col, Chat });
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
