define('toaster', ['toast'], function (toast) {

    'use strict'

    return class Toaster {

        static showToaster (type, title, content) {
            $.toast({
                type: type,
                title: title,
                content: content,
                delay: 5000,
                container: $('.toaster')
            })
        }

        static showError (content) {
            Toaster.showToaster('error', 'Error', content)
        }
    }
})
