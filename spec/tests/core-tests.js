function CoreTests() { return this; };
CoreTests.prototype.run = function () {
    // ---
    /// base.js specs
    // ---
    
    module("xui base (base.js)", {
        setup:function() {
            x = x$('ul#has_tests li');
        },
        teardown:function() {
            x = null;
        }
    });
        test( '.find()', function(){
            x = x$('#find_tests_inner').find('.foo');
            equals(x[0].innerHTML, 'second', 'Should set context properly and limit tree searches to base xui object');
        });
        test( '.has()', function(){
            equals(x.has(".foo").length, 2, 'Should return number of elements after including a specific class as defined in markup');
        });
        test( '.not()', function(){
            equals(x.not(".foo").length, 3, 'Should return number of elements after omitting a specific class as defined in markup');
        });

    // ---
    /// dom.js specs
    // ---
    
    module("Selectors (base.js)", {
        setup:function() {},
        teardown:function() {
            x = null;
        }
    });
        test( 'ID selector', function(){
            x = x$('#item_1');
            equals(x.length, 1, 'Should return non-zero length array for existing elements with specified ID');
            equals(x[0].innerHTML, 'this is item one', 'Should contain innerHTML as exists in markup');
            x = x$('#idontthinkthisitemexists');
            equals(x.length, 0, 'Should return a zero length array for non-existing elements');
        });
        test('Class selector', function() {
            x = x$(".item");
            equals(x.length, 3, 'Should return number of elements with class the proper specified class');
            equals(x[0].innerHTML, 'this is item one', 'Should have text as specified in markup');
            equals(x[x.length -1].innerHTML, 'this is item three', 'Should have text as specified in markup');
        });
        test('Element reference selector', function() {
            el = document.getElementById("item_1"),
            x = x$(el);
            equals(x.length, 1, 'Should return array with one element');
            equals(x[0].innerHTML, 'this is item one', 'Should have proper text as defined in page markup');
            el = null;
        });
        test('Tag name selector', function() {
            expect(2);
            x = x$("item_1");
            equals(x.length, 0, 'Non-existent tag name should return xui object with length 0');
            x = x$('li');
            ok(x.length > 0, 'Should return plenty of elements by tag name if elements are present in markup');
        });

    // ---
    /// style.js specs
    // ---

    module("Style (style.js)", {
        setup:function() {
            e = x$('#get-style-element');
        },
        teardown:function() {
            e = null;
        }
    });
        test( '.getStyle()', function(){
            expect(3);
            var style = e.getStyle('background-color').toLowerCase();
            ok(style == 'rgb(0, 0, 255)' || style == '#0000ff', 'Should return proper style');
            var styletwo = e.getStyle('backgroundColor').toLowerCase();
            ok(styletwo == 'rgb(0, 0, 255)' || styletwo == '#0000ff', 'Should return proper style');
            stop();
            e.getStyle('background-color', function(v){
                v = v.toLowerCase();
                ok(v == 'rgb(0, 0, 255)' || v == '#0000ff', 'Should return proper style in callback function');
                start();
            });
        });
        test( '.setStyle()', function(){
            expect(2);
            e.setStyle('background-color', '#008000');
            ok(e[0].style.backgroundColor == 'rgb(0, 128, 0)' || e[0].style.backgroundColor == '#008000', 'Should be able to change styles via background-color');
            e.setStyle('backgroundColor', '#800000');
            ok(e[0].style.backgroundColor == 'rgb(128, 0, 0)' || e[0].style.backgroundColor == '#800000', 'Should be able to change styles via backgroundColor');
        });
        test( '.addClass()', function(){
            expect(2);
            var x = x$('#add-class-element');
            x.addClass('foo');
            equals(x[0].className, "foo", 'Should properly add class to an element with no existing classes');
            x.addClass('bar');
            equals(x[0].className, "foo bar", 'Should properly add class to an element with an existing class');
        });
        test('.removeClass()', function() {
            expect(3);
            var x = x$('#remove-class-element');
            x.removeClass('bar');
            var classes = x[0].className.split(' ');
            ok(classes.indexOf('bar') == -1, 'Should remove a class from an element');
            ok(classes.indexOf('foo') > -1,  'Should keep surrounding classes intact');
            ok(classes.indexOf('baz') > -1,  'Should keep surrounding classes intact');
        });
        test('.hasClass()', function() {
            var x = x$('#has-class-element');
            ok(x.hasClass('bar'), 'Should return true when element has specified class');
            equals(x.hasClass('zug'), false, 'Should return false when element does not have the specified class');
            
            var y = x$('#this-should-never-exist-in-the-dom');
            equals(y.hasClass('bar'), false, 'Should return false when the selector matches zero elements');
            
            var z = x$('#style_tests').find('p');
            var numFound = 0;
            stop();
            z.hasClass('foo', function(el) {
                numFound++;
                ok(el.className.indexOf('foo') > -1, 'Callback function element parameter should always contain specified class');
                if (numFound > 2) start();
            });
            equals(numFound, x$('#style_tests').find('.foo').length, 'Should invoke callback function properly for every item with matching class');
        });

    // --
    /// dom specs
    // --

    module( "DOM", {
        setup:function() {
            inner  = x$('#html-test-inner');
            outer  = x$('#html-test-outer');
            topTest    = x$('#html-test-top');
            bottom = x$('#html-test-bottom');
            h = x$('#html-test-html');
        },
        teardown:function() {
            inner = null, outer = null, topTest = null, bottom = null, h = null;
        }
    });
        test( 'Inserting html "after" should create a new sibling element following selected element', function() {
            h.html('after', '<div>after</div>');
            equals(h[0].nextSibling.innerHTML, 'after', 'Next sibling element should contain text "after"');
            equals(h[0].nextSibling.tagName.toLowerCase(), 'div', 'Next sibling element should have tagName "div"');
        });

        test( 'Inserting html "before" should create a new sibling element preceding selected element', function() {
            h.html('before', '<div>before</div>');
            equals(h[0].previousSibling.innerHTML, 'before', 'Previous sibling element should contain text "before"');
            equals(h[0].previousSibling.tagName.toLowerCase(), 'div', 'Previous sibling element should have tagName "div"');
        });

        test( 'Inserting html into an element via "inner" should work :)', function(){
            inner.html('inner', '<p>hello world</p>');
            equals(inner[0].childNodes[0].tagName.toLowerCase(), 'p', 'Element should have childNode whose tagName is "p"'); 
            equals(inner[0].childNodes[0].innerHTML, 'hello world', 'Element should have childNode whose contents is "hello world"'); 
        });

        test( 'Inserting html via "outer"', function(){
            outer.html('outer', '<div id="html-test-outer">sneaky</div>');
            equals(document.getElementById('html-test-outer').innerHTML, 'sneaky'); 
        });

        test( 'Inserting html into the "top" of an element should insert element at the head of childNode', function(){
            topTest.html('top', '<div>come out on top</div>');
            equals(topTest[0].childNodes[0].tagName.toLowerCase(), 'div', '"top"-inserted element should have tagName "div"'); 
            equals(topTest[0].childNodes[0].innerHTML, 'come out on top', '"top"-inserted element should contain text "come out on top"'); 
            ok(topTest[0].childNodes.length == 2, 'Existing element inside selected element should remain after a "top" insertion.');
        });

        test( 'Inserting html into the "bottom" of an element should append the element to childNode', function(){
            bottom.html('bottom', '<div>undertow</div>');
            var last = bottom[0].childNodes.length - 1;
            equals(bottom[0].childNodes[last].tagName.toLowerCase(), 'div', '"bottom"-inserted element should have tagName "div"'); 
            equals(bottom[0].childNodes[last].innerHTML, 'undertow', '"bottom"-inserted element should contain text "undertow"'); 
            ok(bottom[0].childNodes.length == 2, 'Existing element inside selected element should remain after a "bottom" insertion.');
        });
        
        test('Inserting multiple HTML items into the "bottom" of an element should append the elements to childNode', function () {
            var childNodesAtStart = bottom[0].childNodes.length;
            var numerousItems = '' +
              '<a href="#1" class="link_o">one link</a>' +
              '<a href="#2" class="link_o">two link</a>' +
              '<a href="#3" class="link_o">three link</a>';
            bottom.html('bottom', numerousItems);
            ok(bottom[0].childNodes.length == (childNodesAtStart + 3), 'Three extra child nodes should have been appended to the element.');
        });
        
        test( 'should return innerHTML of element when called with no arguments', function(){
            equals(h.html(), h[0].innerHTML);
        });
        
        test( 'should insert list items with newlines', function(){
          var newListItem = "<li>\nHello\n</li>";
          x$("#html-list-test").html('bottom', newListItem);
          equals(x$("#html-list-test")[0].innerHTML.toLowerCase(), newListItem.toLowerCase());
        });
        
        test('should insert complex DOM elements', function () {
          // putting attributes with empty strings since safari does it anyway
          // i.e. 'controls' becomes 'controls=""'
          var myVideo = '<video src="myAwesomeVideo.mp4" id="my_video" autobuffer="" controls=""></video>';
          x$("#html-complex-test").html('inner', myVideo);
          equals(x$("#html-complex-test")[0].innerHTML, myVideo);
        })
        
        test('should properly insert Number-type elements using .html()', function() {
            h.html(1);
            equals(h[0].innerHTML, "1");
        });
        
        test('.attr()', function() {
            var checkbox = x$('#first-check');
            checkbox.attr('checked',true);
            equals(checkbox[0].checked, true, 'Should be able to check a checkbox-type input element');
            checkbox.attr('checked',false);
            equals(checkbox[0].checked, false, 'Should be able to un-check a checkbox-type input element');
        });

    // --
    /// xhr specs
    // --

    module( "XHR.function", {
        setup:function() {
            x = x$('#xhr-test-function');
        },
        teardown:function() {
            x.html('');
            x = null;
        }
    });
        test( 'Should insert partial into element', function(){
            x.xhr("helpers/example.html");
            equals(x[0].innerHTML.toLowerCase(), '<h1>this is a html partial</h1>');
        });
        asyncTest( 'Should call callback function defined in options properly', function() {
            expect(2);
            x.xhr("helpers/example.html", {
                callback:function() {
                    ok(true, 'Specified callback function should be triggered properly');
                    equals(x[0].innerHTML,'','Defined callback should override default behaviour of injecting response into innerHTML');
                    start();
                }
            });
        });

    // --
    /// fx specs
    // --

    module( "Fx.tween", {
        setup:function() {
            x = x$('#square');
        },
        teardown:function() {
            var s = x[0].style;
            s.position = 'relative',
                s.width = '50px',
                s.height = '50px',
                s.backgroundColor = 'red',
                s.top = '0px',
                s.left = '0px',
                x = null;
        }
    });
        asyncTest( 'Should call callback function following tween', function() {
            expect(1);
            x.tween({left:'100px'}, function() {
                ok(true, 'Callback should be called following tween');
                start();
            });
        });
        asyncTest( 'Should be able to tween position properties', function() {
            expect(1);
            x.tween({left:'100px'}, function() {
                equals(x[0].style.left,'100px', 'Tweened property should be set to final value as specified in tween call');
                start();
            });
        });

    // --
    /// event specs
    // --
    module("Events", {
        setup:function() {
            // updated to create new element to reset events associated
            var div = document.createElement('div');
            document.getElementById('test-elements').appendChild(div);
            x = x$(div);
        },
        teardown:function() {
            document.getElementById('test-elements').removeChild(x[0]);
            x = null;
        }
    });
        asyncTest('.on(event,function() { ... }) should bind anonymous function to selected element, and should be triggered by .fire(event) call', function () {
            expect(2);
            x.on('click', function () {
                ok(true, 'Click handler fired using fire("click") call');
                this.innerHTML = 'firedclick';
                equals(x[0].innerHTML, 'firedclick', 'Click handler function should have been able to modify innerHTML of element using "this" reference');
                start();
            }).fire('click').un('click');
        });

        asyncTest('.un(event) should unbind event handler from selected element', function () {
            expect(0);
            x.on('click', function () {
                ok(false, 'Click handler should not be fired after calling .un(event)');
                start();
            }).un('click').fire('click');
            start();
        });
      
        asyncTest('.on(event) should be able to bind a custom event', function () {
            expect(1);
            x.on('brianisadonkey', function () {
                ok(true, '"brianisadonkey" event handler should be called by .fire("brianisadonkey")');
                start();
            }).fire('brianisadonkey').un('brianisadonkey');
        });
      
        asyncTest('.un(event) doesn\'t interfere with other events registered on the element', function () {
            expect(1);
            x.on('custom', function () {
                ok(true, '"custom" event handler should be called properly following "click" event unbinding and "custom" event firing');
                start();
            });
            x.on('click', function () {
                ok(false, '"click" event handler should not be called following "click" event unbinding and "custom" event firing');
            }).un('click');
            x.fire('custom');
        });
              
        test('.on(event) and .fire(event) should handle multiple events gracefully', function () {
            var fired = 0;
            function incfired() {
                fired++;
            }
            x.on('click', incfired).on('custom1', incfired).on('touchstart', incfired).fire('click').fire('custom1').fire('touchstart');
            equals(fired, 3, 'Counter should be incremented by three different event handlers');
        });
      
        asyncTest('Should be able to unbind specific events using .un(event, handler)', function () {
            expect(1);
            function one() {
                ok(false, '.un(event, handler) should prevent function "handler" from being called');
                start();
            }
            function two() {
                ok(true, '.fire("click") should trigger the only registered event on element');
                start();
            }
            x.on('click', one).on('click', two).un('click', one).fire('click');
        });

        test('Should not bubble custom events if stopping propagation', function () {
            var parent = x[0].parentNode,
                fired = 0;
            function incfired() {
                fired++;
            }
            x$(parent).on('custom', incfired);
            x.on('custom', incfired).fire('custom');
            equals(fired, 2);
        });
        
        asyncTest('Should be able to create bespoke events', function () {
            // note that teardown methods are needed - this is an early system
            expect(1);
            
            // triple click bespoke event
            x$.events.tripleclick = function (details) {
                var clicked = 0, 
                    $el = x$(this).on('click', function () {
                        clicked++;
                        if (clicked === 3) {
                            clicked = 0;
                            details.handler.call(this);
                        }
                    });
            };
            
            var fired = false;
            x.on('tripleclick', function () {
                ok(true, 'tripleclick bespoke event fired on element');
                start();
            }).fire('click').fire('click').fire('click');
        });
        
        test('Bespoke events should not leak to other elements', function () {
            // Don't know if this test will work. Since it's not an async test, QUnit won't wait for the callbacks to be called
            // as soon as it passes the first if conditional below it'll keep going to the next tests (and pass, since we are expecting 0 assertions).
            expect(0);
            if (x$.events.tripleclick) {
                var div = document.createElement('div'),
                    y = x$(div);
                document.body.appendChild(div);

                y.on('tripleclick', function () {
                    ok(false, 'tripleclick leaked to a completely separate element');
                });
                x.on('tripleclick', function () {});
                x.fire('click').fire('click').fire('click');                
            } else {
                ok(false, 'tripleclick bespoke event missing');
            }
        });
}
