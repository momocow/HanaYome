import * as colle from '../src/util/collections'
import {expect} from 'chai'
import * as _ from 'lodash'
import 'mocha'

describe('Module \'collections\'', function(){
  describe('#reduceLeaves()', function(){
    let source1 = {
      a: 1,
      b: ''
    },
    source2 = {
      a: [1, 2 , 3, undefined],
      b: {
        b1: undefined,
        b2: false
      },
      c: '',
      d: 0,
      e: {}
    }, ans1 = {
      a: 1,
      b: ''
    }, ans2 = {
      a: [1, 2 , 3],
      b: {
        b2: false
      },
      c: '',
      d: 0,
      e: {}
    }, iteratee = (src: object, leaf:string): boolean => {
      return _.get(src, leaf, undefined) !== undefined
    }, alwaysTrueIteratee = (src: object, leaf:string): boolean => {
      return true
    }, alwaysFalseIteratee = (src: object, leaf:string): boolean => {
      return false
    }

    it('should build a new object from the provided one', function(){
      let result = colle.reduceLeaves(source1, iteratee)
      expect(result).to.be.a('object').that.not.equals(source1)
    })

    it('should return an object without any undefined leaf', function(){
      let result1 = colle.reduceLeaves(source1, iteratee),
        result2 = colle.reduceLeaves(source2, iteratee)
      expect(result1).to.be.deep.equal(ans1, 'Test case 1 failed')
      expect(result2).to.be.deep.equal(ans2, 'Test case 2 failed')
    })

    it('should have an iteratee who returns \'true\' to keep the key-value pair in the source object', function(){
      let result = colle.reduceLeaves(source1, alwaysTrueIteratee)
      expect(result).to.be.deep.equal(ans1, 'Test case 1 failed')
    })

    it('should have an iteratee who returns \'false\' to remove the key-value pair from the source object', function(){
      let result = colle.reduceLeaves(source1, alwaysFalseIteratee)
      expect(result).to.be.deep.equal({}, 'Test case 1 failed')
    })
  })
})
