# Entur SDK

This SDK simplifies the use of Entur's travel APIs in JavaScript apps. For more information about Entur's APIs, see https://developer.entur.org

Miss anything? Found a bug? File an [issue](https://github.com/entur/sdk/issues/new) or create a pull request!

## Install
```bash
npm install @entur/sdk --save
```

## Setup
```javascript
import EnturService from '@entur/sdk'

const service = new EnturService({ clientName: 'awesomecompany-awesomeapp' })
```

### Configuration
| Name        | Type                  | Default     | Description                             |
|:------------|:----------------------|:------------|:----------------------------------------|
| clientName  | `string`              | `undefined` | The name of your application            |
| hosts       | `{object of hosts}`   | `{}`        | Override default endpoints              |


#### clientName (required)
We require that you pass a `clientName` that identifies your application. It should contain the name of your company or organization,
followed by a hyphen and your application's name. See https://developer.entur.org/pages-intro-authentication for more information.

#### hosts
The Entur SDK uses multiple endpoints for its services. Each endpoint can be overridden with hosts config (in case you use a proxy or a local instance of the endpoint). Available hosts are:

```javascript
{
    journeyPlanner: '',
    geocoder: ''
}
```

## Flow and TypeScript

We provide library definitions for Flow and TypeScript. TypeScript should work out of the box. For Flow, make sure you include the following in your .flowconfig:

```
[libs]
node_modules/@entur/sdk/lib/libdef.flow.js
```
