// Trigger Method
// --------------

import _         from 'underscore';

// split the event name on the ":"
const splitter = /(^|:)(\w)/gi;

function getEventName(match, prefix, eventName) {
  return eventName.toUpperCase();
}

// take the event section ("section1:section2:section3")
// and turn it in to uppercase name onSection1Section2Section3
function getOnMethodName(event) {
  return 'on' + event.replace(splitter, getEventName);
}

getOnMethodName = _.memoize(getOnMethodName);

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.
export function triggerMethod(event) {
  // get the method name from the event name
  const methodName = getOnMethodName(event);

  const method = this[methodName];

  if (_.isFunction(method)) {
    method.apply(this, _.drop(arguments));
  }

  // trigger the event
  this.trigger.apply(this, arguments);

  return this;
}

// triggerMethodOn invokes triggerMethod on a specific context
//
// e.g. `Marionette.triggerMethodOn(view, 'show')`
// will trigger a "show" event or invoke onShow the view.
export function triggerMethodOn(context) {
  const fnc = _.isFunction(context.triggerMethod) ? context.triggerMethod : triggerMethod;
  fnc.apply(context, _.drop(arguments));

  return this;
}
