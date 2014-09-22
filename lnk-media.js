/*
LNK-MEDIA (lnk-media.js) - Javascript code for this CapLnk component.

Copyright (C) 2014 by Gregory J Lamoree

This file is part of the LNK-MEDIA component which is part of the
CapLnk (Component - Application - Link) suite of components. 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
        var sizes;
        Polymer('lnk-media', {
            globalValues: null,
            sizes: null,
            element: null,
            mqHandler: null,
            ready: function() {
                //console.log(this.nodeName + ": ready.");
                //window.addEventListener('resize', (function(theEvent) {theEvent.target.clientWidth;}).bind(this));
                this.$.lnkGlobals.setAttribute("elementisready",true);
                //console.log("abk-media is ready");
            },
            globalsready: function(theEvent) {
                //console.log(this.nodeName + ": Really ready.");
                this.myGlobalValues = this.$.lnkGlobals.myValues;
                //console.log("abk-media globals are ready");
                //window.addEventListener('resize', this.resize);
                
                var myInstanceGlobals = this.myGlobalValues;
                var myInstanceElement = this;
                
                
                if(typeof this.myGlobalValues.optimizedResize != "undefined") {
                    // Do Nothing (it's a placeholder)
                } else {
                    this.myGlobalValues["optimizedResize"] = (function() {

                        var callbacks = [],
                            running = false;

                        // fired on resize event
                        function resize() {

                            if (!running) {
                                running = true;

                                if (window.requestAnimationFrame) {
                                    window.requestAnimationFrame(runCallbacks);
                                } else {
                                    setTimeout(runCallbacks, 66);
                                }
                            }

                        }

                        // run the actual callbacks
                        function runCallbacks() {

                            callbacks.forEach(function(callback) {
                                callback();
                            });

                            running = false;
                        }

                        // adds callback to loop
                        function addCallback(callback) {

                            if (callback) {
                                callbacks.push(callback);
                            }

                        }

                        return {
                            // initalize resize event listener
                            init: function(callback) {
                                window.addEventListener('resize', resize);
                                addCallback(callback);
                            },

                            // public method to add additional callback
                            add: function(callback) {
                                addCallback(callback);
                            }
                        };
                    }()); 
                    
                    
                    
                    this.myGlobalValues.optimizedResize.init(function() {
                        myInstanceGlobals["windowHeight"] = window.document.body.clientHeight;
                        myInstanceGlobals["windowWidth"]  = window.document.body.clientWidth;
                        
                        //console.log("Resized!");
                        
                        //myInstanceElement.setAttribute("windowHeight", myInstanceGlobals["windowHeight"]);
                        //myInstanceElement.setAttribute("windowWidth", myInstanceGlobals["windowWidth"]);
                    });
                    
                    myInstanceGlobals["windowHeight"] = window.document.body.clientHeight;
                    myInstanceGlobals["windowWidth"]  = window.document.body.clientWidth;

                    
                    //this.windowHeight = this.myGlobalValues["windowHeight"];
                    //this.windowWidth = this.myGlobalValues["windowWidth"];
                }

                this.sizes = sizes = this.myGlobalValues["sizes"] = [];
                this.element = this;
                this.mqHandler = this.theMediaListener.bind(this);

                for (var i = 0; i < this.attributes.length; ++i) {
                    var attr = this.attributes[i];
                    if(RegExp("size$","i").test(attr.nodeName)) {
                        var theNode = {};
                        theNode["name"] = attr.nodeName;
                        theNode["minsize"] = parseFloat(attr.nodeValue);
                        sizes.push(theNode);
                    }

                }
                //sizes.sort(function(a, b){ return a.minsize - b.minsize;});

                for (var key = 0; key < sizes.length; key++) {
                    this.completeGlobalSetup(sizes[key]);
                } 
            },
            theMediaListener: function(changed) {
                var theNode = null;
                var isAttributeName = null;
                for (var key = 0; key < sizes.length; key++) {
                    if(sizes[key].listener && sizes[key].listener.isType.media == changed.media) {
                        theNode = sizes[key];
                        isAttributeName = "is" + theNode.name.replace(/size$/i,"");
                        break;
                    }
                }

                if(theNode) {
                    if(changed.matches) {
                        this.element.setAttributeNode(document.createAttribute(isAttributeName));
                    } else {
                        this.element.removeAttribute(isAttributeName);
                    }
                }
            },
            completeGlobalSetup: function(sizeData) {
                // It is assumed that "name" and "minsize" have already been set up.
                if(sizeData["listener"]) {
                    sizeData.listener.istype.removeListener(this.mqHandler);
                }
                sizeData["listener"] = new Array;
                sizeData["listener"]["isType"] = window.matchMedia("screen and (min-width:" + sizeData["minsize"] + "em)");
                sizeData["listener"]["isType"].addListener(this.mqHandler);
                this.mqHandler(sizeData["listener"]["isType"]);
            },
            attributeChanged: function(attrName, oldVal, newVal) {
                if(this.$) {
                    if(RegExp("size$","i").test(attrName)) {
                        //console.log("*** abk-media attributeChanged!");
                        var sizes = this.sizes;

                        var foundIt = false;
                        for (var key = 0; key < sizes.length; key++) {
                            if (sizes[key]["name"] == attrName) {
                                if(newVal && newVal.length > 0) {
                                    sizes[key]["minsize"] = newVal;
                                    this.completeGlobalSetup(sizes[key]);
                                } else {
                                    sizes[key].listener.istype.removeListener(this.mqHandler);
                                }
                                foundIt = true;
                                break;
                            }
                        }
                        if(!foundIt) {
                            var theNode = {};
                            theNode["name"] = attrName;
                            theNode["minsize"] = newVal;
                            var key = sizes.push(theNode);
                            this.completeGlobalSetup(sizes[key]);
                        }
                    }
                }
            }
        });
