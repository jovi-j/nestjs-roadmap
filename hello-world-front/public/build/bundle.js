
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
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
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
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text$1(' ');
    }
    function empty() {
        return text$1('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function set_custom_element_data_map(node, data_map) {
        Object.keys(data_map).forEach((key) => {
            set_custom_element_data(node, key, data_map[key]);
        });
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
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
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
        else if (callback) {
            callback();
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

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
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    /** regex of all html void element names */
    const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
    function is_void(name) {
        return void_element_names.test(name) || name.toLowerCase() === '!doctype';
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
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
            ctx: [],
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
            if (!is_function(callback)) {
                return noop;
            }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.53.1' }, detail), { bubbles: true }));
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
    function validate_dynamic_element(tag) {
        const is_string = typeof tag === 'string';
        if (tag && !is_string) {
            throw new Error('<svelte:element> expects "this" attribute to be a string.');
        }
    }
    function validate_void_dynamic_element(tag) {
        if (tag && is_void(tag)) {
            console.warn(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
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

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    function dispatch(element, eventType, detail, eventInit = { bubbles: true }, 
    /** This is an internal thing used by SMUI to duplicate some SMUI events as MDC events. */
    duplicateEventForMDC = false) {
        if (typeof Event !== 'undefined' && element) {
            const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
            element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
            if (duplicateEventForMDC && eventType.startsWith('SMUI')) {
                const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => 'MDC'), Object.assign(Object.assign({}, eventInit), { detail }));
                element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
                if (duplicateEvent.defaultPrevented) {
                    event.preventDefault();
                }
            }
            return event;
        }
    }

    function exclude(obj, keys) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const cashIndex = name.indexOf('$');
            if (cashIndex !== -1 &&
                keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
                continue;
            }
            if (keys.indexOf(name) !== -1) {
                continue;
            }
            newObj[name] = obj[name];
        }
        return newObj;
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = parts.slice(1).reduce((obj, mod) => {
                        obj[mod] = true;
                        return obj;
                    }, {});
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function prefixFilter(obj, prefix) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (name.substring(0, prefix.length) === prefix) {
                newObj[name.substring(prefix.length)] = obj[name];
            }
        }
        return newObj;
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$2 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$2 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$1 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded = false;
            _this.activationTimer = 0;
            _this.fgDeactivationRemovalTimer = 0;
            _this.fgScale = '0';
            _this.frame = { width: 0, height: 0 };
            _this.initialSize = 0;
            _this.layoutFrame = 0;
            _this.maxRadius = 0;
            _this.unboundedCoords = { left: 0, top: 0 };
            _this.activationState = _this.defaultActivationState();
            _this.activationTimerCallback = function () {
                _this.activationAnimationHasEnded = true;
                _this.runDeactivationUXLogicIfReady();
            };
            _this.activateHandler = function (e) {
                _this.activateImpl(e);
            };
            _this.deactivateHandler = function () {
                _this.deactivateImpl();
            };
            _this.focusHandler = function () {
                _this.handleFocus();
            };
            _this.blurHandler = function () {
                _this.handleBlur();
            };
            _this.resizeHandler = function () {
                _this.layout();
            };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple();
            this.registerRootHandlers(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple()) {
                if (this.activationTimer) {
                    clearTimeout(this.activationTimer);
                    this.activationTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer) {
                    clearTimeout(this.fgDeactivationRemovalTimer);
                    this.fgDeactivationRemovalTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars();
                });
            }
            this.deregisterRootHandlers();
            this.deregisterDeactivationHandlers();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activateImpl(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivateImpl();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame) {
                cancelAnimationFrame(this.layoutFrame);
            }
            this.layoutFrame = requestAnimationFrame(function () {
                _this.layoutInternal();
                _this.layoutFrame = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
            var e_1, _a;
            if (supportsPressRipple) {
                try {
                    for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler);
            this.adapter.registerInteractionHandler('blur', this.blurHandler);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
            var e_2, _a;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
            }
            else {
                try {
                    for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
            var e_3, _a;
            try {
                for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
            var e_4, _a;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        MDCRippleFoundation.prototype.removeCssVars = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activateImpl = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState = _this.defaultActivationState();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer);
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.rmBoundedActivationClasses();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer = setTimeout(function () {
                _this.activationTimerCallback();
            }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
            var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame.width / 2,
                    y: this.frame.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize / 2),
                y: startPoint.y - (this.initialSize / 2),
            };
            var endPoint = {
                x: (this.frame.width / 2) - (this.initialSize / 2),
                y: (this.frame.height / 2) - (this.initialSize / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded) {
                this.rmBoundedActivationClasses();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$1.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState = function () {
            var _this = this;
            this.previousActivationEvent = this.activationState.activationEvent;
            this.activationState = this.defaultActivationState();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivateImpl = function () {
            var _this = this;
            var activationState = this.activationState;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () {
                    _this.animateDeactivation(state);
                });
                this.resetActivationState();
            }
            else {
                this.deregisterDeactivationHandlers();
                requestAnimationFrame(function () {
                    _this.activationState.hasDeactivationUXRun = true;
                    _this.animateDeactivation(state);
                    _this.resetActivationState();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal = function () {
            var _this = this;
            this.frame = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame.height, this.frame.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
            }
            else {
                this.initialSize = initialSize;
            }
            this.fgScale = "" + this.maxRadius / this.initialSize;
            this.updateLayoutCssVars();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                    left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                    top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    const { applyPassive } = events;
    const { matches } = ponyfill;
    function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
        let instance;
        let addLayoutListener = getContext('SMUI:addLayoutListener');
        let removeLayoutListener;
        let oldActive = active;
        let oldEventTarget = eventTarget;
        let oldActiveTarget = activeTarget;
        function handleProps() {
            if (surface) {
                addClass('mdc-ripple-surface');
                if (color === 'primary') {
                    addClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                else if (color === 'secondary') {
                    removeClass('smui-ripple-surface--primary');
                    addClass('smui-ripple-surface--secondary');
                }
                else {
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
            }
            else {
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            // Handle activation first.
            if (instance && oldActive !== active) {
                oldActive = active;
                if (active) {
                    instance.activate();
                }
                else if (active === false) {
                    instance.deactivate();
                }
            }
            // Then create/destroy an instance.
            if (ripple && !instance) {
                instance = new MDCRippleFoundation({
                    addClass,
                    browserSupportsCssVars: () => supportsCssVariables(window),
                    computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                    containsEventTarget: (target) => node.contains(target),
                    deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                    deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                    deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                    getWindowPageOffset: () => ({
                        x: window.pageXOffset,
                        y: window.pageYOffset,
                    }),
                    isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                    isSurfaceDisabled: () => !!disabled,
                    isUnbounded: () => !!unbounded,
                    registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                    registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                    registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                    removeClass,
                    updateCssVariable: addStyle,
                });
                initPromise.then(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            else if (instance && !ripple) {
                initPromise.then(() => {
                    if (instance) {
                        instance.destroy();
                        instance = undefined;
                    }
                });
            }
            // Now handle event/active targets
            if (instance &&
                (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
                oldEventTarget = eventTarget;
                oldActiveTarget = activeTarget;
                instance.destroy();
                requestAnimationFrame(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            if (!ripple && unbounded) {
                addClass('mdc-ripple-upgraded--unbounded');
            }
        }
        handleProps();
        if (addLayoutListener) {
            removeLayoutListener = addLayoutListener(layout);
        }
        function layout() {
            if (instance) {
                instance.layout();
            }
        }
        return {
            update(props) {
                ({
                    ripple,
                    surface,
                    unbounded,
                    disabled,
                    color,
                    active,
                    rippleElement,
                    eventTarget,
                    activeTarget,
                    addClass,
                    removeClass,
                    addStyle,
                    initPromise,
                } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
                handleProps();
            },
            destroy() {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                    removeClass('mdc-ripple-surface');
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                if (removeLayoutListener) {
                    removeLayoutListener();
                }
            },
        };
    }

    /* node_modules/@smui/common/dist/CommonLabel.svelte generated by Svelte v3.53.1 */

    // (1:0) <svelte:component   this={component}   {tag}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-button__label': context === 'button',     'mdc-fab__label': context === 'fab',     'mdc-tab__text-label': context === 'tab',     'mdc-image-list__label': context === 'image-list',     'mdc-snackbar__label': context === 'snackbar',     'mdc-banner__text': context === 'banner',     'mdc-segmented-button__label': context === 'segmented-button',     'mdc-data-table__pagination-rows-per-page-label':       context === 'data-table:pagination',     'mdc-data-table__header-cell-label':       context === 'data-table:sortable-header-cell',   })}   {...context === 'snackbar' ? { 'aria-atomic': 'false' } : {}}   {tabindex}   {...$$restProps}>
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
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
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   {tag}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-button__label': context === 'button',     'mdc-fab__label': context === 'fab',     'mdc-tab__text-label': context === 'tab',     'mdc-image-list__label': context === 'image-list',     'mdc-snackbar__label': context === 'snackbar',     'mdc-banner__text': context === 'banner',     'mdc-segmented-button__label': context === 'segmented-button',     'mdc-data-table__pagination-rows-per-page-label':       context === 'data-table:pagination',     'mdc-data-table__header-cell-label':       context === 'data-table:sortable-header-cell',   })}   {...context === 'snackbar' ? { 'aria-atomic': 'false' } : {}}   {tabindex}   {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ tag: /*tag*/ ctx[3] },
    		{
    			use: [/*forwardEvents*/ ctx[5], .../*use*/ ctx[0]]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-button__label': /*context*/ ctx[6] === 'button',
    				'mdc-fab__label': /*context*/ ctx[6] === 'fab',
    				'mdc-tab__text-label': /*context*/ ctx[6] === 'tab',
    				'mdc-image-list__label': /*context*/ ctx[6] === 'image-list',
    				'mdc-snackbar__label': /*context*/ ctx[6] === 'snackbar',
    				'mdc-banner__text': /*context*/ ctx[6] === 'banner',
    				'mdc-segmented-button__label': /*context*/ ctx[6] === 'segmented-button',
    				'mdc-data-table__pagination-rows-per-page-label': /*context*/ ctx[6] === 'data-table:pagination',
    				'mdc-data-table__header-cell-label': /*context*/ ctx[6] === 'data-table:sortable-header-cell'
    			})
    		},
    		/*context*/ ctx[6] === 'snackbar'
    		? { 'aria-atomic': 'false' }
    		: {},
    		{ tabindex: /*tabindex*/ ctx[7] },
    		/*$$restProps*/ ctx[8]
    	];

    	var switch_value = /*component*/ ctx[2];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$1] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    		/*switch_instance_binding*/ ctx[11](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*tag, forwardEvents, use, classMap, className, context, tabindex, $$restProps*/ 491)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*tag*/ 8 && { tag: /*tag*/ ctx[3] },
    					dirty & /*forwardEvents, use*/ 33 && {
    						use: [/*forwardEvents*/ ctx[5], .../*use*/ ctx[0]]
    					},
    					dirty & /*classMap, className, context*/ 66 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-button__label': /*context*/ ctx[6] === 'button',
    							'mdc-fab__label': /*context*/ ctx[6] === 'fab',
    							'mdc-tab__text-label': /*context*/ ctx[6] === 'tab',
    							'mdc-image-list__label': /*context*/ ctx[6] === 'image-list',
    							'mdc-snackbar__label': /*context*/ ctx[6] === 'snackbar',
    							'mdc-banner__text': /*context*/ ctx[6] === 'banner',
    							'mdc-segmented-button__label': /*context*/ ctx[6] === 'segmented-button',
    							'mdc-data-table__pagination-rows-per-page-label': /*context*/ ctx[6] === 'data-table:pagination',
    							'mdc-data-table__header-cell-label': /*context*/ ctx[6] === 'data-table:sortable-header-cell'
    						})
    					},
    					dirty & /*context*/ 64 && get_spread_object(/*context*/ ctx[6] === 'snackbar'
    					? { 'aria-atomic': 'false' }
    					: {}),
    					dirty & /*tabindex*/ 128 && { tabindex: /*tabindex*/ ctx[7] },
    					dirty & /*$$restProps*/ 256 && get_spread_object(/*$$restProps*/ ctx[8])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 4096) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					/*switch_instance_binding*/ ctx[11](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[11](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
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

    function instance$2($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","component","tag","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommonLabel', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;
    	let { component = SmuiElement } = $$props;
    	let { tag = component === SmuiElement ? 'span' : undefined } = $$props;
    	const context = getContext('SMUI:label:context');
    	const tabindex = getContext('SMUI:label:tabindex');

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('component' in $$new_props) $$invalidate(2, component = $$new_props.component);
    		if ('tag' in $$new_props) $$invalidate(3, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		SmuiElement,
    		forwardEvents,
    		use,
    		className,
    		element,
    		component,
    		tag,
    		context,
    		tabindex,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    		if ('component' in $$props) $$invalidate(2, component = $$new_props.component);
    		if ('tag' in $$props) $$invalidate(3, tag = $$new_props.tag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		component,
    		tag,
    		element,
    		forwardEvents,
    		context,
    		tabindex,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class CommonLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$4, safe_not_equal, {
    			use: 0,
    			class: 1,
    			component: 2,
    			tag: 3,
    			getElement: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommonLabel",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get use() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[9];
    	}

    	set getElement(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/dist/SmuiElement.svelte generated by Svelte v3.53.1 */
    const file$3 = "node_modules/@smui/common/dist/SmuiElement.svelte";

    // (9:0) {:else}
    function create_else_block(ctx) {
    	let previous_tag = /*tag*/ ctx[1];
    	let svelte_element_anchor;
    	let current;
    	validate_dynamic_element(/*tag*/ ctx[1]);
    	validate_void_dynamic_element(/*tag*/ ctx[1]);
    	let svelte_element = /*tag*/ ctx[1] && create_dynamic_element_1(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*tag*/ ctx[1]) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element_1(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*tag*/ ctx[1])) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*tag*/ ctx[1]);
    					validate_void_dynamic_element(/*tag*/ ctx[1]);
    					svelte_element = create_dynamic_element_1(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    			}

    			previous_tag = /*tag*/ ctx[1];
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelte_element);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelte_element);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(9:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if selfClosing}
    function create_if_block(ctx) {
    	let previous_tag = /*tag*/ ctx[1];
    	let svelte_element_anchor;
    	validate_dynamic_element(/*tag*/ ctx[1]);
    	let svelte_element = /*tag*/ ctx[1] && create_dynamic_element(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*tag*/ ctx[1]) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*tag*/ ctx[1])) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*tag*/ ctx[1]);
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    			}

    			previous_tag = /*tag*/ ctx[1];
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(1:0) {#if selfClosing}",
    		ctx
    	});

    	return block;
    }

    // (10:2) <svelte:element     this={tag}     bind:this={element}     use:useActions={use}     use:forwardEvents     {...$$restProps}>
    function create_dynamic_element_1(ctx) {
    	let svelte_element;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let svelte_element_levels = [/*$$restProps*/ ctx[5]];
    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*tag*/ ctx[1]);
    			if (default_slot) default_slot.c();

    			if ((/-/).test(/*tag*/ ctx[1])) {
    				set_custom_element_data_map(svelte_element, svelte_element_data);
    			} else {
    				set_attributes(svelte_element, svelte_element_data);
    			}

    			add_location(svelte_element, file$3, 9, 2, 158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);

    			if (default_slot) {
    				default_slot.m(svelte_element, null);
    			}

    			/*svelte_element_binding_1*/ ctx[10](svelte_element);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, svelte_element, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[4].call(null, svelte_element))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
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

    			svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]]);

    			if ((/-/).test(/*tag*/ ctx[1])) {
    				set_custom_element_data_map(svelte_element, svelte_element_data);
    			} else {
    				set_attributes(svelte_element, svelte_element_data);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
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
    			if (detaching) detach_dev(svelte_element);
    			if (default_slot) default_slot.d(detaching);
    			/*svelte_element_binding_1*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element_1.name,
    		type: "child_dynamic_element",
    		source: "(10:2) <svelte:element     this={tag}     bind:this={element}     use:useActions={use}     use:forwardEvents     {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (2:2) <svelte:element     this={tag}     bind:this={element}     use:useActions={use}     use:forwardEvents     {...$$restProps}   />
    function create_dynamic_element(ctx) {
    	let svelte_element;
    	let useActions_action;
    	let mounted;
    	let dispose;
    	let svelte_element_levels = [/*$$restProps*/ ctx[5]];
    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*tag*/ ctx[1]);

    			if ((/-/).test(/*tag*/ ctx[1])) {
    				set_custom_element_data_map(svelte_element, svelte_element_data);
    			} else {
    				set_attributes(svelte_element, svelte_element_data);
    			}

    			add_location(svelte_element, file$3, 1, 2, 20);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);
    			/*svelte_element_binding*/ ctx[9](svelte_element);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, svelte_element, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[4].call(null, svelte_element))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]]);

    			if ((/-/).test(/*tag*/ ctx[1])) {
    				set_custom_element_data_map(svelte_element, svelte_element_data);
    			} else {
    				set_attributes(svelte_element, svelte_element_data);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			/*svelte_element_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element.name,
    		type: "child_dynamic_element",
    		source: "(2:2) <svelte:element     this={tag}     bind:this={element}     use:useActions={use}     use:forwardEvents     {...$$restProps}   />",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selfClosing*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
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
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let selfClosing;
    	const omit_props_names = ["use","tag","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SmuiElement', slots, ['default']);
    	let { use = [] } = $$props;
    	let { tag } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	$$self.$$.on_mount.push(function () {
    		if (tag === undefined && !('tag' in $$props || $$self.$$.bound[$$self.$$.props['tag']])) {
    			console.warn("<SmuiElement> was created without expected prop 'tag'");
    		}
    	});

    	function svelte_element_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	function svelte_element_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('tag' in $$new_props) $$invalidate(1, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		tag,
    		forwardEvents,
    		element,
    		getElement,
    		selfClosing
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('tag' in $$props) $$invalidate(1, tag = $$new_props.tag);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    		if ('selfClosing' in $$props) $$invalidate(3, selfClosing = $$new_props.selfClosing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*tag*/ 2) {
    			$$invalidate(3, selfClosing = [
    				'area',
    				'base',
    				'br',
    				'col',
    				'embed',
    				'hr',
    				'img',
    				'input',
    				'link',
    				'meta',
    				'param',
    				'source',
    				'track',
    				'wbr'
    			].indexOf(tag) > -1);
    		}
    	};

    	return [
    		use,
    		tag,
    		element,
    		selfClosing,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		svelte_element_binding,
    		svelte_element_binding_1
    	];
    }

    class SmuiElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$3, safe_not_equal, { use: 0, tag: 1, getElement: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SmuiElement",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get use() {
    		throw new Error("<SmuiElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<SmuiElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<SmuiElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<SmuiElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[6];
    	}

    	set getElement(value) {
    		throw new Error("<SmuiElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$1 = {
        ANIM_CHECKED_INDETERMINATE: 'mdc-checkbox--anim-checked-indeterminate',
        ANIM_CHECKED_UNCHECKED: 'mdc-checkbox--anim-checked-unchecked',
        ANIM_INDETERMINATE_CHECKED: 'mdc-checkbox--anim-indeterminate-checked',
        ANIM_INDETERMINATE_UNCHECKED: 'mdc-checkbox--anim-indeterminate-unchecked',
        ANIM_UNCHECKED_CHECKED: 'mdc-checkbox--anim-unchecked-checked',
        ANIM_UNCHECKED_INDETERMINATE: 'mdc-checkbox--anim-unchecked-indeterminate',
        BACKGROUND: 'mdc-checkbox__background',
        CHECKED: 'mdc-checkbox--checked',
        CHECKMARK: 'mdc-checkbox__checkmark',
        CHECKMARK_PATH: 'mdc-checkbox__checkmark-path',
        DISABLED: 'mdc-checkbox--disabled',
        INDETERMINATE: 'mdc-checkbox--indeterminate',
        MIXEDMARK: 'mdc-checkbox__mixedmark',
        NATIVE_CONTROL: 'mdc-checkbox__native-control',
        ROOT: 'mdc-checkbox',
        SELECTED: 'mdc-checkbox--selected',
        UPGRADED: 'mdc-checkbox--upgraded',
    };
    var strings$1 = {
        ARIA_CHECKED_ATTR: 'aria-checked',
        ARIA_CHECKED_INDETERMINATE_VALUE: 'mixed',
        DATA_INDETERMINATE_ATTR: 'data-indeterminate',
        NATIVE_CONTROL_SELECTOR: '.mdc-checkbox__native-control',
        TRANSITION_STATE_CHECKED: 'checked',
        TRANSITION_STATE_INDETERMINATE: 'indeterminate',
        TRANSITION_STATE_INIT: 'init',
        TRANSITION_STATE_UNCHECKED: 'unchecked',
    };
    var numbers = {
        ANIM_END_LATCH_MS: 250,
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCCheckboxFoundation = /** @class */ (function (_super) {
        __extends(MDCCheckboxFoundation, _super);
        function MDCCheckboxFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCCheckboxFoundation.defaultAdapter), adapter)) || this;
            _this.currentCheckState = strings$1.TRANSITION_STATE_INIT;
            _this.currentAnimationClass = '';
            _this.animEndLatchTimer = 0;
            _this.enableAnimationEndHandler = false;
            return _this;
        }
        Object.defineProperty(MDCCheckboxFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCCheckboxFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCCheckboxFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCCheckboxFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    forceLayout: function () { return undefined; },
                    hasNativeControl: function () { return false; },
                    isAttachedToDOM: function () { return false; },
                    isChecked: function () { return false; },
                    isIndeterminate: function () { return false; },
                    removeClass: function () { return undefined; },
                    removeNativeControlAttr: function () { return undefined; },
                    setNativeControlAttr: function () { return undefined; },
                    setNativeControlDisabled: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCCheckboxFoundation.prototype.init = function () {
            this.currentCheckState = this.determineCheckState();
            this.updateAriaChecked();
            this.adapter.addClass(cssClasses$1.UPGRADED);
        };
        MDCCheckboxFoundation.prototype.destroy = function () {
            clearTimeout(this.animEndLatchTimer);
        };
        MDCCheckboxFoundation.prototype.setDisabled = function (disabled) {
            this.adapter.setNativeControlDisabled(disabled);
            if (disabled) {
                this.adapter.addClass(cssClasses$1.DISABLED);
            }
            else {
                this.adapter.removeClass(cssClasses$1.DISABLED);
            }
        };
        /**
         * Handles the animationend event for the checkbox
         */
        MDCCheckboxFoundation.prototype.handleAnimationEnd = function () {
            var _this = this;
            if (!this.enableAnimationEndHandler) {
                return;
            }
            clearTimeout(this.animEndLatchTimer);
            this.animEndLatchTimer = setTimeout(function () {
                _this.adapter.removeClass(_this.currentAnimationClass);
                _this.enableAnimationEndHandler = false;
            }, numbers.ANIM_END_LATCH_MS);
        };
        /**
         * Handles the change event for the checkbox
         */
        MDCCheckboxFoundation.prototype.handleChange = function () {
            this.transitionCheckState();
        };
        MDCCheckboxFoundation.prototype.transitionCheckState = function () {
            if (!this.adapter.hasNativeControl()) {
                return;
            }
            var oldState = this.currentCheckState;
            var newState = this.determineCheckState();
            if (oldState === newState) {
                return;
            }
            this.updateAriaChecked();
            var TRANSITION_STATE_UNCHECKED = strings$1.TRANSITION_STATE_UNCHECKED;
            var SELECTED = cssClasses$1.SELECTED;
            if (newState === TRANSITION_STATE_UNCHECKED) {
                this.adapter.removeClass(SELECTED);
            }
            else {
                this.adapter.addClass(SELECTED);
            }
            // Check to ensure that there isn't a previously existing animation class, in case for example
            // the user interacted with the checkbox before the animation was finished.
            if (this.currentAnimationClass.length > 0) {
                clearTimeout(this.animEndLatchTimer);
                this.adapter.forceLayout();
                this.adapter.removeClass(this.currentAnimationClass);
            }
            this.currentAnimationClass =
                this.getTransitionAnimationClass(oldState, newState);
            this.currentCheckState = newState;
            // Check for parentNode so that animations are only run when the element is attached
            // to the DOM.
            if (this.adapter.isAttachedToDOM() &&
                this.currentAnimationClass.length > 0) {
                this.adapter.addClass(this.currentAnimationClass);
                this.enableAnimationEndHandler = true;
            }
        };
        MDCCheckboxFoundation.prototype.determineCheckState = function () {
            var TRANSITION_STATE_INDETERMINATE = strings$1.TRANSITION_STATE_INDETERMINATE, TRANSITION_STATE_CHECKED = strings$1.TRANSITION_STATE_CHECKED, TRANSITION_STATE_UNCHECKED = strings$1.TRANSITION_STATE_UNCHECKED;
            if (this.adapter.isIndeterminate()) {
                return TRANSITION_STATE_INDETERMINATE;
            }
            return this.adapter.isChecked() ? TRANSITION_STATE_CHECKED :
                TRANSITION_STATE_UNCHECKED;
        };
        MDCCheckboxFoundation.prototype.getTransitionAnimationClass = function (oldState, newState) {
            var TRANSITION_STATE_INIT = strings$1.TRANSITION_STATE_INIT, TRANSITION_STATE_CHECKED = strings$1.TRANSITION_STATE_CHECKED, TRANSITION_STATE_UNCHECKED = strings$1.TRANSITION_STATE_UNCHECKED;
            var _a = MDCCheckboxFoundation.cssClasses, ANIM_UNCHECKED_CHECKED = _a.ANIM_UNCHECKED_CHECKED, ANIM_UNCHECKED_INDETERMINATE = _a.ANIM_UNCHECKED_INDETERMINATE, ANIM_CHECKED_UNCHECKED = _a.ANIM_CHECKED_UNCHECKED, ANIM_CHECKED_INDETERMINATE = _a.ANIM_CHECKED_INDETERMINATE, ANIM_INDETERMINATE_CHECKED = _a.ANIM_INDETERMINATE_CHECKED, ANIM_INDETERMINATE_UNCHECKED = _a.ANIM_INDETERMINATE_UNCHECKED;
            switch (oldState) {
                case TRANSITION_STATE_INIT:
                    if (newState === TRANSITION_STATE_UNCHECKED) {
                        return '';
                    }
                    return newState === TRANSITION_STATE_CHECKED ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
                case TRANSITION_STATE_UNCHECKED:
                    return newState === TRANSITION_STATE_CHECKED ? ANIM_UNCHECKED_CHECKED : ANIM_UNCHECKED_INDETERMINATE;
                case TRANSITION_STATE_CHECKED:
                    return newState === TRANSITION_STATE_UNCHECKED ? ANIM_CHECKED_UNCHECKED : ANIM_CHECKED_INDETERMINATE;
                default: // TRANSITION_STATE_INDETERMINATE
                    return newState === TRANSITION_STATE_CHECKED ? ANIM_INDETERMINATE_CHECKED : ANIM_INDETERMINATE_UNCHECKED;
            }
        };
        MDCCheckboxFoundation.prototype.updateAriaChecked = function () {
            // Ensure aria-checked is set to mixed if checkbox is in indeterminate state.
            if (this.adapter.isIndeterminate()) {
                this.adapter.setNativeControlAttr(strings$1.ARIA_CHECKED_ATTR, strings$1.ARIA_CHECKED_INDETERMINATE_VALUE);
            }
            else {
                // The on/off state does not need to keep track of aria-checked, since
                // the screenreader uses the checked property on the checkbox element.
                this.adapter.removeNativeControlAttr(strings$1.ARIA_CHECKED_ATTR);
            }
        };
        return MDCCheckboxFoundation;
    }(MDCFoundation));

    /* node_modules/@smui/checkbox/dist/Checkbox.svelte generated by Svelte v3.53.1 */
    const file$2 = "node_modules/@smui/checkbox/dist/Checkbox.svelte";

    function create_fragment$2(ctx) {
    	let div3;
    	let input;
    	let input_class_value;
    	let input_value_value;
    	let input_data_indeterminate_value;
    	let useActions_action;
    	let t0;
    	let div1;
    	let svg;
    	let path;
    	let t1;
    	let div0;
    	let t2;
    	let div2;
    	let div3_class_value;
    	let div3_style_value;
    	let useActions_action_1;
    	let Ripple_action;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{
    			class: input_class_value = classMap({
    				[/*input$class*/ ctx[9]]: true,
    				'mdc-checkbox__native-control': true
    			})
    		},
    		{ type: "checkbox" },
    		/*inputProps*/ ctx[20],
    		{ disabled: /*disabled*/ ctx[1] },
    		{
    			__value: input_value_value = /*isUninitializedValue*/ ctx[19](/*valueKey*/ ctx[7])
    			? /*value*/ ctx[6]
    			: /*valueKey*/ ctx[7]
    		},
    		{
    			"data-indeterminate": input_data_indeterminate_value = !/*isUninitializedValue*/ ctx[19](/*indeterminate*/ ctx[0]) && /*indeterminate*/ ctx[0]
    			? 'true'
    			: undefined
    		},
    		/*nativeControlAttrs*/ ctx[16],
    		prefixFilter(/*$$restProps*/ ctx[26], 'input$')
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let div3_levels = [
    		{
    			class: div3_class_value = classMap({
    				[/*className*/ ctx[3]]: true,
    				'mdc-checkbox': true,
    				'mdc-checkbox--disabled': /*disabled*/ ctx[1],
    				'mdc-checkbox--touch': /*touch*/ ctx[5],
    				'mdc-data-table__header-row-checkbox': /*context*/ ctx[21] === 'data-table' && /*dataTableHeader*/ ctx[22],
    				'mdc-data-table__row-checkbox': /*context*/ ctx[21] === 'data-table' && !/*dataTableHeader*/ ctx[22],
    				.../*internalClasses*/ ctx[14]
    			})
    		},
    		{
    			style: div3_style_value = Object.entries(/*internalStyles*/ ctx[15]).map(func).concat([/*style*/ ctx[4]]).join(' ')
    		},
    		exclude(/*$$restProps*/ ctx[26], ['input$'])
    	];

    	let div3_data = {};

    	for (let i = 0; i < div3_levels.length; i += 1) {
    		div3_data = assign(div3_data, div3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			input = element("input");
    			t0 = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			div2 = element("div");
    			set_attributes(input, input_data);
    			add_location(input, file$2, 30, 2, 804);
    			attr_dev(path, "class", "mdc-checkbox__checkmark-path");
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "d", "M1.73,12.91 8.1,19.28 22.79,4.59");
    			add_location(path, file$2, 52, 6, 1442);
    			attr_dev(svg, "class", "mdc-checkbox__checkmark");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$2, 51, 4, 1378);
    			attr_dev(div0, "class", "mdc-checkbox__mixedmark");
    			add_location(div0, file$2, 58, 4, 1582);
    			attr_dev(div1, "class", "mdc-checkbox__background");
    			add_location(div1, file$2, 50, 2, 1335);
    			attr_dev(div2, "class", "mdc-checkbox__ripple");
    			add_location(div2, file$2, 60, 2, 1633);
    			set_attributes(div3, div3_data);
    			add_location(div3, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, input);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[36](input);
    			input.checked = /*nativeChecked*/ ctx[12];
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, svg);
    			append_dev(svg, path);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			/*div3_binding*/ ctx[38](div3);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, input, /*input$use*/ ctx[8])),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[37]),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[34], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[35], false, false, false),
    					action_destroyer(useActions_action_1 = useActions.call(null, div3, /*use*/ ctx[2])),
    					action_destroyer(/*forwardEvents*/ ctx[18].call(null, div3)),
    					action_destroyer(Ripple_action = Ripple.call(null, div3, {
    						unbounded: true,
    						addClass: /*addClass*/ ctx[23],
    						removeClass: /*removeClass*/ ctx[24],
    						addStyle: /*addStyle*/ ctx[25],
    						active: /*rippleActive*/ ctx[17],
    						eventTarget: /*checkbox*/ ctx[11]
    					})),
    					listen_dev(div3, "animationend", /*animationend_handler*/ ctx[39], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*input$class*/ 512 && input_class_value !== (input_class_value = classMap({
    					[/*input$class*/ ctx[9]]: true,
    					'mdc-checkbox__native-control': true
    				})) && { class: input_class_value },
    				{ type: "checkbox" },
    				/*inputProps*/ ctx[20],
    				dirty[0] & /*disabled*/ 2 && { disabled: /*disabled*/ ctx[1] },
    				dirty[0] & /*valueKey, value*/ 192 && input_value_value !== (input_value_value = /*isUninitializedValue*/ ctx[19](/*valueKey*/ ctx[7])
    				? /*value*/ ctx[6]
    				: /*valueKey*/ ctx[7]) && { __value: input_value_value },
    				dirty[0] & /*indeterminate*/ 1 && input_data_indeterminate_value !== (input_data_indeterminate_value = !/*isUninitializedValue*/ ctx[19](/*indeterminate*/ ctx[0]) && /*indeterminate*/ ctx[0]
    				? 'true'
    				: undefined) && {
    					"data-indeterminate": input_data_indeterminate_value
    				},
    				dirty[0] & /*nativeControlAttrs*/ 65536 && /*nativeControlAttrs*/ ctx[16],
    				dirty[0] & /*$$restProps*/ 67108864 && prefixFilter(/*$$restProps*/ ctx[26], 'input$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*input$use*/ 256) useActions_action.update.call(null, /*input$use*/ ctx[8]);

    			if (dirty[0] & /*nativeChecked*/ 4096) {
    				input.checked = /*nativeChecked*/ ctx[12];
    			}

    			set_attributes(div3, div3_data = get_spread_update(div3_levels, [
    				dirty[0] & /*className, disabled, touch, internalClasses*/ 16426 && div3_class_value !== (div3_class_value = classMap({
    					[/*className*/ ctx[3]]: true,
    					'mdc-checkbox': true,
    					'mdc-checkbox--disabled': /*disabled*/ ctx[1],
    					'mdc-checkbox--touch': /*touch*/ ctx[5],
    					'mdc-data-table__header-row-checkbox': /*context*/ ctx[21] === 'data-table' && /*dataTableHeader*/ ctx[22],
    					'mdc-data-table__row-checkbox': /*context*/ ctx[21] === 'data-table' && !/*dataTableHeader*/ ctx[22],
    					.../*internalClasses*/ ctx[14]
    				})) && { class: div3_class_value },
    				dirty[0] & /*internalStyles, style*/ 32784 && div3_style_value !== (div3_style_value = Object.entries(/*internalStyles*/ ctx[15]).map(func).concat([/*style*/ ctx[4]]).join(' ')) && { style: div3_style_value },
    				dirty[0] & /*$$restProps*/ 67108864 && exclude(/*$$restProps*/ ctx[26], ['input$'])
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty[0] & /*use*/ 4) useActions_action_1.update.call(null, /*use*/ ctx[2]);

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*rippleActive, checkbox*/ 133120) Ripple_action.update.call(null, {
    				unbounded: true,
    				addClass: /*addClass*/ ctx[23],
    				removeClass: /*removeClass*/ ctx[24],
    				addStyle: /*addStyle*/ ctx[25],
    				active: /*rippleActive*/ ctx[17],
    				eventTarget: /*checkbox*/ ctx[11]
    			});
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*input_binding*/ ctx[36](null);
    			/*div3_binding*/ ctx[38](null);
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

    const func = ([name, value]) => `${name}: ${value};`;

    function instance_1$1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","disabled","touch","indeterminate","group","checked","value","valueKey","input$use","input$class","getId","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkbox', slots, []);
    	var _a;
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { disabled = false } = $$props;
    	let { touch = false } = $$props;
    	let { indeterminate = uninitializedValue } = $$props;
    	let { group = uninitializedValue } = $$props;
    	let { checked = uninitializedValue } = $$props;
    	let { value = null } = $$props;
    	let { valueKey = uninitializedValue } = $$props;
    	let { input$use = [] } = $$props;
    	let { input$class = '' } = $$props;
    	let element;
    	let instance;
    	let checkbox;
    	let internalClasses = {};
    	let internalStyles = {};
    	let nativeControlAttrs = {};
    	let rippleActive = false;

    	let inputProps = (_a = getContext('SMUI:generic:input:props')) !== null && _a !== void 0
    	? _a
    	: {};

    	let nativeChecked = isUninitializedValue(group)
    	? isUninitializedValue(checked)
    		? false
    		: checked !== null && checked !== void 0
    			? checked
    			: undefined
    	: group.indexOf(value) !== -1;

    	let context = getContext('SMUI:checkbox:context');
    	let dataTableHeader = getContext('SMUI:data-table:row:header');
    	let previousChecked = checked;
    	let previousGroup = isUninitializedValue(group) ? [] : [...group];
    	let previousNativeChecked = nativeChecked;

    	onMount(() => {
    		$$invalidate(11, checkbox.indeterminate = !isUninitializedValue(indeterminate) && indeterminate, checkbox);

    		$$invalidate(10, instance = new MDCCheckboxFoundation({
    				addClass,
    				forceLayout: () => element.offsetWidth,
    				hasNativeControl: () => true,
    				isAttachedToDOM: () => Boolean(element.parentNode),
    				isChecked: () => nativeChecked !== null && nativeChecked !== void 0
    				? nativeChecked
    				: false,
    				isIndeterminate: () => isUninitializedValue(indeterminate)
    				? false
    				: indeterminate,
    				removeClass,
    				removeNativeControlAttr,
    				setNativeControlAttr: addNativeControlAttr,
    				setNativeControlDisabled: value => $$invalidate(1, disabled = value)
    			}));

    		const accessor = {
    			_smui_checkbox_accessor: true,
    			get element() {
    				return getElement();
    			},
    			get checked() {
    				return nativeChecked !== null && nativeChecked !== void 0
    				? nativeChecked
    				: false;
    			},
    			set checked(value) {
    				if (nativeChecked !== value) {
    					$$invalidate(12, nativeChecked = value);
    				}
    			},
    			get indeterminate() {
    				return isUninitializedValue(indeterminate)
    				? false
    				: indeterminate;
    			},
    			set indeterminate(value) {
    				$$invalidate(0, indeterminate = value);
    			},
    			activateRipple() {
    				if (!disabled) {
    					$$invalidate(17, rippleActive = true);
    				}
    			},
    			deactivateRipple() {
    				$$invalidate(17, rippleActive = false);
    			}
    		};

    		dispatch(element, 'SMUIGenericInput:mount', accessor);
    		dispatch(element, 'SMUICheckbox:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(element, 'SMUIGenericInput:unmount', accessor);
    			dispatch(element, 'SMUICheckbox:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(14, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(14, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(15, internalStyles);
    			} else {
    				$$invalidate(15, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function addNativeControlAttr(name, value) {
    		if (nativeControlAttrs[name] !== value) {
    			$$invalidate(16, nativeControlAttrs[name] = value, nativeControlAttrs);
    		}
    	}

    	function removeNativeControlAttr(name) {
    		if (!(name in nativeControlAttrs) || nativeControlAttrs[name] != null) {
    			$$invalidate(16, nativeControlAttrs[name] = undefined, nativeControlAttrs);
    		}
    	}

    	function getId() {
    		return inputProps && inputProps.id;
    	}

    	function getElement() {
    		return element;
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			checkbox = $$value;
    			((((((((($$invalidate(11, checkbox), $$invalidate(27, group)), $$invalidate(33, previousNativeChecked)), $$invalidate(12, nativeChecked)), $$invalidate(6, value)), $$invalidate(32, previousGroup)), $$invalidate(28, checked)), $$invalidate(31, previousChecked)), $$invalidate(0, indeterminate)), $$invalidate(10, instance));
    		});
    	}

    	function input_change_handler() {
    		nativeChecked = this.checked;
    		((((((((($$invalidate(12, nativeChecked), $$invalidate(27, group)), $$invalidate(33, previousNativeChecked)), $$invalidate(6, value)), $$invalidate(32, previousGroup)), $$invalidate(28, checked)), $$invalidate(31, previousChecked)), $$invalidate(0, indeterminate)), $$invalidate(11, checkbox)), $$invalidate(10, instance));
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(13, element);
    		});
    	}

    	const animationend_handler = () => instance && instance.handleAnimationEnd();

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(26, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(2, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('disabled' in $$new_props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('touch' in $$new_props) $$invalidate(5, touch = $$new_props.touch);
    		if ('indeterminate' in $$new_props) $$invalidate(0, indeterminate = $$new_props.indeterminate);
    		if ('group' in $$new_props) $$invalidate(27, group = $$new_props.group);
    		if ('checked' in $$new_props) $$invalidate(28, checked = $$new_props.checked);
    		if ('value' in $$new_props) $$invalidate(6, value = $$new_props.value);
    		if ('valueKey' in $$new_props) $$invalidate(7, valueKey = $$new_props.valueKey);
    		if ('input$use' in $$new_props) $$invalidate(8, input$use = $$new_props.input$use);
    		if ('input$class' in $$new_props) $$invalidate(9, input$class = $$new_props.input$class);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		MDCCheckboxFoundation,
    		onMount,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		disabled,
    		touch,
    		indeterminate,
    		group,
    		checked,
    		value,
    		valueKey,
    		input$use,
    		input$class,
    		element,
    		instance,
    		checkbox,
    		internalClasses,
    		internalStyles,
    		nativeControlAttrs,
    		rippleActive,
    		inputProps,
    		nativeChecked,
    		context,
    		dataTableHeader,
    		previousChecked,
    		previousGroup,
    		previousNativeChecked,
    		addClass,
    		removeClass,
    		addStyle,
    		addNativeControlAttr,
    		removeNativeControlAttr,
    		getId,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_a' in $$props) _a = $$new_props._a;
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(2, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('touch' in $$props) $$invalidate(5, touch = $$new_props.touch);
    		if ('indeterminate' in $$props) $$invalidate(0, indeterminate = $$new_props.indeterminate);
    		if ('group' in $$props) $$invalidate(27, group = $$new_props.group);
    		if ('checked' in $$props) $$invalidate(28, checked = $$new_props.checked);
    		if ('value' in $$props) $$invalidate(6, value = $$new_props.value);
    		if ('valueKey' in $$props) $$invalidate(7, valueKey = $$new_props.valueKey);
    		if ('input$use' in $$props) $$invalidate(8, input$use = $$new_props.input$use);
    		if ('input$class' in $$props) $$invalidate(9, input$class = $$new_props.input$class);
    		if ('element' in $$props) $$invalidate(13, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(10, instance = $$new_props.instance);
    		if ('checkbox' in $$props) $$invalidate(11, checkbox = $$new_props.checkbox);
    		if ('internalClasses' in $$props) $$invalidate(14, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(15, internalStyles = $$new_props.internalStyles);
    		if ('nativeControlAttrs' in $$props) $$invalidate(16, nativeControlAttrs = $$new_props.nativeControlAttrs);
    		if ('rippleActive' in $$props) $$invalidate(17, rippleActive = $$new_props.rippleActive);
    		if ('inputProps' in $$props) $$invalidate(20, inputProps = $$new_props.inputProps);
    		if ('nativeChecked' in $$props) $$invalidate(12, nativeChecked = $$new_props.nativeChecked);
    		if ('context' in $$props) $$invalidate(21, context = $$new_props.context);
    		if ('dataTableHeader' in $$props) $$invalidate(22, dataTableHeader = $$new_props.dataTableHeader);
    		if ('previousChecked' in $$props) $$invalidate(31, previousChecked = $$new_props.previousChecked);
    		if ('previousGroup' in $$props) $$invalidate(32, previousGroup = $$new_props.previousGroup);
    		if ('previousNativeChecked' in $$props) $$invalidate(33, previousNativeChecked = $$new_props.previousNativeChecked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*group, nativeChecked, value, checked, indeterminate, checkbox, instance*/ 402660417 | $$self.$$.dirty[1] & /*previousNativeChecked, previousGroup, previousChecked*/ 7) {
    			{
    				// This is a substitute for an on:change listener that is
    				// smarter about when it calls the instance's handler. I do
    				// this so that a group of changes will only trigger one
    				// handler call, since the handler will reset currently
    				// running animations.
    				let callHandleChange = false;

    				// First check for group state.
    				if (!isUninitializedValue(group)) {
    					if (previousNativeChecked !== nativeChecked) {
    						// The change needs to flow up.
    						const idx = group.indexOf(value);

    						if (nativeChecked && idx === -1) {
    							group.push(value);
    							((((((((($$invalidate(27, group), $$invalidate(33, previousNativeChecked)), $$invalidate(12, nativeChecked)), $$invalidate(6, value)), $$invalidate(32, previousGroup)), $$invalidate(28, checked)), $$invalidate(31, previousChecked)), $$invalidate(0, indeterminate)), $$invalidate(11, checkbox)), $$invalidate(10, instance));
    						} else if (!nativeChecked && idx !== -1) {
    							group.splice(idx, 1);
    							((((((((($$invalidate(27, group), $$invalidate(33, previousNativeChecked)), $$invalidate(12, nativeChecked)), $$invalidate(6, value)), $$invalidate(32, previousGroup)), $$invalidate(28, checked)), $$invalidate(31, previousChecked)), $$invalidate(0, indeterminate)), $$invalidate(11, checkbox)), $$invalidate(10, instance));
    						}

    						callHandleChange = true;
    					} else {
    						// Potential changes need to flow down.
    						const idxPrev = previousGroup.indexOf(value);

    						const idx = group.indexOf(value);

    						if (idxPrev > -1 && idx === -1) {
    							// The checkbox was removed from the group.
    							$$invalidate(12, nativeChecked = false);

    							callHandleChange = true;
    						} else if (idx > -1 && idxPrev === -1) {
    							// The checkbox was added to the group.
    							$$invalidate(12, nativeChecked = true);

    							callHandleChange = true;
    						}
    					}
    				}

    				// Now check individual state.
    				if (isUninitializedValue(checked)) {
    					if (!!previousNativeChecked !== !!nativeChecked) {
    						// The checkbox was clicked by the user.
    						callHandleChange = true;
    					}
    				} else if (checked !== (nativeChecked !== null && nativeChecked !== void 0
    				? nativeChecked
    				: null)) {
    					if (checked === previousChecked) {
    						// The checkbox was clicked by the user
    						// and the change needs to flow up.
    						$$invalidate(28, checked = nativeChecked !== null && nativeChecked !== void 0
    						? nativeChecked
    						: null);

    						if (!isUninitializedValue(indeterminate)) {
    							$$invalidate(0, indeterminate = false);
    						}
    					} else {
    						// The checkbox was changed programmatically
    						// and the change needs to flow down.
    						$$invalidate(12, nativeChecked = checked !== null && checked !== void 0
    						? checked
    						: undefined);
    					}

    					callHandleChange = true;
    				}

    				if (checkbox) {
    					// Sync indeterminate state with the native input.
    					if (isUninitializedValue(indeterminate)) {
    						if (checkbox.indeterminate) {
    							// I don't think this can happen, but just in case.
    							$$invalidate(11, checkbox.indeterminate = false, checkbox);

    							callHandleChange = true;
    						}
    					} else {
    						if (!indeterminate && checkbox.indeterminate) {
    							$$invalidate(11, checkbox.indeterminate = false, checkbox);
    							callHandleChange = true;
    						} else if (indeterminate && !checkbox.indeterminate) {
    							$$invalidate(11, checkbox.indeterminate = true, checkbox);
    							callHandleChange = true;
    						}
    					}
    				}

    				$$invalidate(31, previousChecked = checked);
    				$$invalidate(32, previousGroup = isUninitializedValue(group) ? [] : [...group]);
    				$$invalidate(33, previousNativeChecked = nativeChecked);

    				if (callHandleChange && instance) {
    					instance.handleChange();
    				}
    			}
    		}
    	};

    	return [
    		indeterminate,
    		disabled,
    		use,
    		className,
    		style,
    		touch,
    		value,
    		valueKey,
    		input$use,
    		input$class,
    		instance,
    		checkbox,
    		nativeChecked,
    		element,
    		internalClasses,
    		internalStyles,
    		nativeControlAttrs,
    		rippleActive,
    		forwardEvents,
    		isUninitializedValue,
    		inputProps,
    		context,
    		dataTableHeader,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		group,
    		checked,
    		getId,
    		getElement,
    		previousChecked,
    		previousGroup,
    		previousNativeChecked,
    		blur_handler,
    		focus_handler,
    		input_binding,
    		input_change_handler,
    		div3_binding,
    		animationend_handler
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$1,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				use: 2,
    				class: 3,
    				style: 4,
    				disabled: 1,
    				touch: 5,
    				indeterminate: 0,
    				group: 27,
    				checked: 28,
    				value: 6,
    				valueKey: 7,
    				input$use: 8,
    				input$class: 9,
    				getId: 29,
    				getElement: 30
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get use() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueKey() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueKey(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input$use() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input$use(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input$class() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input$class(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getId() {
    		return this.$$.ctx[29];
    	}

    	set getId(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[30];
    	}

    	set getElement(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses = {
        ROOT: 'mdc-form-field',
    };
    var strings = {
        LABEL_SELECTOR: '.mdc-form-field > label',
    };

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFormFieldFoundation = /** @class */ (function (_super) {
        __extends(MDCFormFieldFoundation, _super);
        function MDCFormFieldFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCFormFieldFoundation.defaultAdapter), adapter)) || this;
            _this.click = function () {
                _this.handleClick();
            };
            return _this;
        }
        Object.defineProperty(MDCFormFieldFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFormFieldFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFormFieldFoundation, "defaultAdapter", {
            get: function () {
                return {
                    activateInputRipple: function () { return undefined; },
                    deactivateInputRipple: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCFormFieldFoundation.prototype.init = function () {
            this.adapter.registerInteractionHandler('click', this.click);
        };
        MDCFormFieldFoundation.prototype.destroy = function () {
            this.adapter.deregisterInteractionHandler('click', this.click);
        };
        MDCFormFieldFoundation.prototype.handleClick = function () {
            var _this = this;
            this.adapter.activateInputRipple();
            requestAnimationFrame(function () {
                _this.adapter.deactivateInputRipple();
            });
        };
        return MDCFormFieldFoundation;
    }(MDCFoundation));

    /* node_modules/@smui/form-field/dist/FormField.svelte generated by Svelte v3.53.1 */

    const file$1 = "node_modules/@smui/form-field/dist/FormField.svelte";
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    function create_fragment$1(ctx) {
    	let div;
    	let t;
    	let label_1;
    	let useActions_action;
    	let div_class_value;
    	let useActions_action_1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const label_slot_template = /*#slots*/ ctx[13].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[12], get_label_slot_context);
    	let label_1_levels = [{ for: /*inputId*/ ctx[4] }, prefixFilter(/*$$restProps*/ ctx[10], 'label$')];
    	let label_1_data = {};

    	for (let i = 0; i < label_1_levels.length; i += 1) {
    		label_1_data = assign(label_1_data, label_1_levels[i]);
    	}

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-form-field': true,
    				'mdc-form-field--align-end': /*align*/ ctx[2] === 'end',
    				'mdc-form-field--nowrap': /*noWrap*/ ctx[3]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[10], ['label$'])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			label_1 = element("label");
    			if (label_slot) label_slot.c();
    			set_attributes(label_1, label_1_data);
    			add_location(label_1, file$1, 15, 2, 412);
    			set_attributes(div, div_data);
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, label_1);

    			if (label_slot) {
    				label_slot.m(label_1, null);
    			}

    			/*label_1_binding*/ ctx[14](label_1);
    			/*div_binding*/ ctx[15](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, label_1, /*label$use*/ ctx[5])),
    					action_destroyer(useActions_action_1 = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[9].call(null, div)),
    					listen_dev(div, "SMUIGenericInput:mount", /*SMUIGenericInput_mount_handler*/ ctx[16], false, false, false),
    					listen_dev(div, "SMUIGenericInput:unmount", /*SMUIGenericInput_unmount_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[12], dirty, get_label_slot_changes),
    						get_label_slot_context
    					);
    				}
    			}

    			set_attributes(label_1, label_1_data = get_spread_update(label_1_levels, [
    				(!current || dirty & /*inputId*/ 16) && { for: /*inputId*/ ctx[4] },
    				dirty & /*$$restProps*/ 1024 && prefixFilter(/*$$restProps*/ ctx[10], 'label$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*label$use*/ 32) useActions_action.update.call(null, /*label$use*/ ctx[5]);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, align, noWrap*/ 14 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-form-field': true,
    					'mdc-form-field--align-end': /*align*/ ctx[2] === 'end',
    					'mdc-form-field--nowrap': /*noWrap*/ ctx[3]
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[10], ['label$'])
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & /*use*/ 1) useActions_action_1.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (label_slot) label_slot.d(detaching);
    			/*label_1_binding*/ ctx[14](null);
    			/*div_binding*/ ctx[15](null);
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
    let counter = 0;

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","align","noWrap","inputId","label$use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormField', slots, ['default','label']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { align = 'start' } = $$props;
    	let { noWrap = false } = $$props;
    	let { inputId = 'SMUI-form-field-' + counter++ } = $$props;
    	let { label$use = [] } = $$props;
    	let element;
    	let instance;
    	let label;
    	let input;
    	setContext('SMUI:generic:input:props', { id: inputId });

    	onMount(() => {
    		instance = new MDCFormFieldFoundation({
    				activateInputRipple: () => {
    					if (input) {
    						input.activateRipple();
    					}
    				},
    				deactivateInputRipple: () => {
    					if (input) {
    						input.deactivateRipple();
    					}
    				},
    				deregisterInteractionHandler: (evtType, handler) => {
    					label.removeEventListener(evtType, handler);
    				},
    				registerInteractionHandler: (evtType, handler) => {
    					label.addEventListener(evtType, handler);
    				}
    			});

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function getElement() {
    		return element;
    	}

    	function label_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			label = $$value;
    			$$invalidate(7, label);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(6, element);
    		});
    	}

    	const SMUIGenericInput_mount_handler = event => $$invalidate(8, input = event.detail);
    	const SMUIGenericInput_unmount_handler = () => $$invalidate(8, input = undefined);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('noWrap' in $$new_props) $$invalidate(3, noWrap = $$new_props.noWrap);
    		if ('inputId' in $$new_props) $$invalidate(4, inputId = $$new_props.inputId);
    		if ('label$use' in $$new_props) $$invalidate(5, label$use = $$new_props.label$use);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		counter,
    		MDCFormFieldFoundation,
    		onMount,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		align,
    		noWrap,
    		inputId,
    		label$use,
    		element,
    		instance,
    		label,
    		input,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('noWrap' in $$props) $$invalidate(3, noWrap = $$new_props.noWrap);
    		if ('inputId' in $$props) $$invalidate(4, inputId = $$new_props.inputId);
    		if ('label$use' in $$props) $$invalidate(5, label$use = $$new_props.label$use);
    		if ('element' in $$props) $$invalidate(6, element = $$new_props.element);
    		if ('instance' in $$props) instance = $$new_props.instance;
    		if ('label' in $$props) $$invalidate(7, label = $$new_props.label);
    		if ('input' in $$props) $$invalidate(8, input = $$new_props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		noWrap,
    		inputId,
    		label$use,
    		element,
    		label,
    		input,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		label_1_binding,
    		div_binding,
    		SMUIGenericInput_mount_handler,
    		SMUIGenericInput_unmount_handler
    	];
    }

    class FormField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1, create_fragment$1, safe_not_equal, {
    			use: 0,
    			class: 1,
    			align: 2,
    			noWrap: 3,
    			inputId: 4,
    			label$use: 5,
    			getElement: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormField",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get use() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noWrap() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noWrap(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputId() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputId(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label$use() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label$use(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[11];
    	}

    	set getElement(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.53.1 */

    const { Error: Error_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (45:4) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t_value = /*error*/ ctx[7].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(t_value);
    			set_style(p, "color", "red");
    			add_location(p, file, 45, 6, 1067);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
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
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(45:4) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (29:4) {:then todos}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*todos*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*promise, checked*/ 3) {
    				each_value = /*todos*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(29:4) {:then todos}",
    		ctx
    	});

    	return block;
    }

    // (33:12) <FormField>
    function create_default_slot_1(ctx) {
    	let checkbox;
    	let updating_checked;
    	let t0;
    	let h1;
    	let t1_value = /*todo*/ ctx[4].titulo + "";
    	let t1;
    	let t2;
    	let spam;
    	let t3_value = /*todo*/ ctx[4].pessoaResponsavel.nome + "";
    	let t3;
    	let current;

    	function checkbox_checked_binding(value) {
    		/*checkbox_checked_binding*/ ctx[2](value);
    	}

    	let checkbox_props = {};

    	if (/*checked*/ ctx[0] !== void 0) {
    		checkbox_props.checked = /*checked*/ ctx[0];
    	}

    	checkbox = new Checkbox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, 'checked', checkbox_checked_binding));

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text$1(t1_value);
    			t2 = space();
    			spam = element("spam");
    			t3 = text$1(t3_value);
    			set_style(spam, "opacity", "0.4");
    			add_location(spam, file, 36, 16, 849);
    			add_location(h1, file, 34, 14, 798);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, spam);
    			append_dev(spam, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkbox_changes = {};

    			if (!updating_checked && dirty & /*checked*/ 1) {
    				updating_checked = true;
    				checkbox_changes.checked = /*checked*/ ctx[0];
    				add_flush_callback(() => updating_checked = false);
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(33:12) <FormField>",
    		ctx
    	});

    	return block;
    }

    // (30:6) {#each todos as todo}
    function create_each_block(ctx) {
    	let form;
    	let div;
    	let formfield;
    	let t;
    	let current;

    	formfield = new FormField({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div = element("div");
    			create_component(formfield.$$.fragment);
    			t = space();
    			set_style(div, "margin-top", "1em");
    			add_location(div, file, 31, 10, 689);
    			attr_dev(form, "action", "");
    			attr_dev(form, "method", "post");
    			add_location(form, file, 30, 8, 648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div);
    			mount_component(formfield, div, null);
    			append_dev(form, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formfield_changes = {};

    			if (dirty & /*$$scope, checked*/ 257) {
    				formfield_changes.$$scope = { dirty, ctx };
    			}

    			formfield.$set(formfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(formfield);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(30:6) {#each todos as todo}",
    		ctx
    	});

    	return block;
    }

    // (27:20)        <Label>Fetching todos...</Label>     {:then todos}
    function create_pending_block(ctx) {
    	let label;
    	let current;

    	label = new CommonLabel({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(27:20)        <Label>Fetching todos...</Label>     {:then todos}",
    		ctx
    	});

    	return block;
    }

    // (28:6) <Label>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text$1("Fetching todos...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:6) <Label>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 3,
    		error: 7,
    		blocks: [,,,]
    	};

    	handle_promise(/*promise*/ ctx[1], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Todos";
    			t1 = space();
    			div = element("div");
    			info.block.c();
    			add_location(h1, file, 24, 2, 488);
    			attr_dev(div, "class", "container-flex");
    			add_location(div, file, 25, 2, 505);
    			add_location(main, file, 23, 0, 479);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
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

    async function getAllTodos() {
    	const res = await fetch(`http://localhost:3000/todo/`);
    	const todos = await res.json();

    	if (res.ok) {
    		return todos;
    	} else {
    		throw new Error(text);
    	}
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let checked = [];
    	let promise = getAllTodos();
    	onMount(getAllTodos);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function checkbox_checked_binding(value) {
    		checked = value;
    		$$invalidate(0, checked);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Label: CommonLabel,
    		Checkbox,
    		FormField,
    		checked,
    		getAllTodos,
    		promise
    	});

    	$$self.$inject_state = $$props => {
    		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
    		if ('promise' in $$props) $$invalidate(1, promise = $$props.promise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [checked, promise, checkbox_checked_binding];
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
