tests   [![Build Status](https://travis-ci.org/vapory/tests.svg?branch=develop)](https://travis-ci.org/vapory/tests)
=====

Common tests for all clients to test against. See the documentation http://vapory-tests.readthedocs.io/

Do not change test files in folders: 
* StateTests
* BlockchainTests
* TransactionTests 
* VMTests

It is being created by the testFillers which could be found at https://github.com/vaporyco/cpp-vapory/tree/develop/test/tools/jsontests at src folder. The filler specification and wiki are in development so please ask on gitter channel for more details.

If you want to modify a test filler or add a new test please contact @winsvega at https://gitter.im/vapory/cpp-vapory

All files should be of the form:

```
{
	"test1name":
	{
		"test1property1": ...,
		"test1property2": ...,
		...
	},
	"test2name":
	{
		"test2property1": ...,
		"test2property2": ...,
		...
	}
}
```

Arrays are allowed, but don't use them for sets of properties - only use them for data that is clearly a continuous contiguous sequence of values.

Links
-----

* [cpp-vapory guide to generate test cases](https://github.com/vaporyco/cpp-vapory/blob/develop/doc/generating_tests.rst)
