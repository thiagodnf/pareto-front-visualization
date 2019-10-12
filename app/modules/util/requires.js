define('requires', [], function () {

    'use strict'

    class Arrays {

        constructor(object){
            this.object = object;
        }

        withSizeGreaterThanOrEqualTo (size) {

            if (this.object.length >= size) {
                return this;
            }

            throw new Error(`The arrays should be greater than or equal to ${size} but it was ${this.object.length}`)
        }

        withSizeEqualsTo (size) {

            if (this.object.length === size) {
                return this;
            }

            throw new Error(`The arrays should have size equal to ${size} but it was ${this.object.length}`)
        }
    }

    class Requires {

        constructor(object){
            this.object = object;
        }

        isNotUndefined(){

            if (this.object) {
                return this;
            }

            throw new Error("The parameter is undefined")
        }

        isArray () {
            this.isNotUndefined();

            if(Array.isArray(this.object)){
                return new Arrays(this.object);
            }

            throw new Error("The parameter is not an array");
        }
    }

    return function(object){
        return new Requires(object);
    }
})
