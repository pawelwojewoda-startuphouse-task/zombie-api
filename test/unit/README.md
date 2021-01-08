# Unit tests

## Unit test location

For convenience, every unit test is located in the same directory where the corresponding unit can be found. Also, it ensures simple and pleasant imports, no need to think about "reflecting" directory structures as well as quick jumping from file to file.

## Running unit tests

The most convenient way is to use the command:

`$ npm run test:watch`

## Generating coverage

Use command:

`$ npm run test:cov`

**Note**: You need to delete the coverage directory before running the app!

## Design considerations 

There was a need for the decision to make on how exactly test individual units and what a unit should be. Following concerns were considered:
  1. There is no much business value in testing classes that in fact have no logic. Often, controllers are tend such ones. They tend to be basically simple forwarders. <sup>[1](#dc_footnote_1)</sup>
  2. Given the above, while it doesn't bring much value, it slows down the product code development. 
  3. Especially in testing JS applications (with Jest for React, but it's the same with Karma and Jasmine for Angular), the line between unit and integration tests is blurred. <sup>[2](#dc_footnote_2)</sup>
  4. It the quality, not the coverage, which should be the goal of unit tests. Coverage should be more like guidance. 
  5. The unit does *not* necessarily has to be a class.
  6. SUT's behavior, not implementation, should be tested. In other words, one needs to be careful and beware testing classes / methods "too deeply".

Although it would be wise not to *forcibly* cover the whole codebase with unit tests due to points (1.), (2.) and finally (3.), the decision has been made to cover also the controllers (which mainly forward calls). This decision is justified by points (4.), (5.) and (6.). 

<a name="dc_footnote_1"><sup>1 </sup></a><small>"The line between unit and integration tests can be quite blurry in a component heavy world.", "Write clean unit tests if there is actual value in testing a complex piece of logic in isolation to prevent it from breaking in the future" -- although this is intented as fronted guidelines, it seems reasonable in the general case too. https://docs.gitlab.com/ee/development/testing_guide/frontend_testing.html</small>


<a name="dc_footnote_2"><sup>2 </sup></a><small>"The line between unit and integration tests can be quite blurry in a component heavy world." https://docs.gitlab.com/ee/development/testing_guide/frontend_testing.html</small>

## Testing @Module-decorated classes

For the sake of higher coverage (around ~100%), the decision was made to test classes decorated with @Module also.

Although it probably does not make much sense, it demonstrates how it is possible to mock such constructs as ES5 imports or Nest / Angular module decorators using Jest.

However, this could potentatially bring some value. Nest will certainly throw an error if it prevents it from initialization (no provider for a dependency, etc.), but we cannot be sure whether it detects all kind of errors. Therefore, if we depend on certain module setups, we may want to harden that with some unit tests. For example, maybe we would like to know if `.forFeature` is called with appropriate parameters (like certain entities) or we do not export too much. The latter is presented in the zombie module unit test.

Module unit tests other than zombie.module.unit.test.ts are just *simple placeholders*. As said ealier, they probably don't bring any value, but perhaps it would make sense to expand it when needed.

## Mocking dependencies

Only needed dependencies were mocked. If a dependency was lightweight (did not really influence on the duration of a test), no mocking was provided for it (e. g. 'config' dependency - or is it? filesystem reads?).