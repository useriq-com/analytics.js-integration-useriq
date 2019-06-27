# analytics.js-integration-mixpanel 

UserIQ integration for [Analytics.js][].


## Getting started

To get started, enable _"useriq source"_ in segment.io dashbaord. UserIQ source requires both `identify` & `group` to be called before it is fully functional! Below are some of the parameters that are required to initialize the integration.

**identify**
```js
analytics.identify("97980cfea0067", {
  name: "Peter Gibbons",  // required
  email: "peter@initech.com", 
  signup_date: "2017-07-04",
  ....
});

```

**group**
```js
analytics.group("0e8c78ea9d97a7b8185e8632", {
  name: "Initech", 
  ....
});
```

All other traits are optional & they will be added to `custom_vars` in the useriq dashboard.



## License

Released under the [MIT license](LICENSE).
