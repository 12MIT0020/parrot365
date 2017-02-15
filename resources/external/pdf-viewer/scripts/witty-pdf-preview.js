(function() {
    'use strict';
    var AnnotatePDF = window.AnnotatePDF = window.AnnotatePDF || {};
    var annotations = {};
    var showAnnotation = false;
    var canvasStateContainer = [];
    var parent = window.parent;

    AnnotatePDF.loadFile = function(params) {
        var file = params.file;
        var authorization = parent.document.getElementsByTagName('pdf-viewer')[0].dataset.auth;
        delete params.file;

        for(var key in params) {
            if (key === 'witlinkid') {
                file += '?witLinkId='+params.witlinkid;
            }else if (key === 'embedcodeid') {
                file += '?embedCodeId='+params.embedcodeid;
            }else if (key === 'micrositeid') {
                file += '?micrositeid='+params.micrositeid;
            }
        }

        var xhr = new XMLHttpRequest();

        xhr.onload = function() {
          PDFViewerApplication.open(new Uint8Array(xhr.response));
        };

        xhr.onprogress = function(e) {
          if(e.lengthComputable) {
            PDFViewerApplication.progress(e.loaded / e.total);
          }
        };

        try {
          xhr.open('GET', file);
          xhr.responseType = 'arraybuffer';
          if(authorization) {
            xhr.setRequestHeader('authorization', authorization);
          }
          xhr.send();
        } catch (e) {
          PDFViewerApplication.error(mozL10n.get('loading_error', null,
            'An error occurred while loading the PDF.'), e);
        }
        return;
    }

    AnnotatePDF.setAnnotations = function(preDefinedAnnotations) {
        annotations = preDefinedAnnotations;
    };

    AnnotatePDF.showAnnotations = function(showDocAnnotation) {
        showAnnotation = showDocAnnotation;

        var pages = Object.keys(annotations),page, canvas, ctx;
        if(showDocAnnotation) {
            //Move to first page with annotations
            PDFViewerApplication.page = parseInt(pages[0]);

            for (var j = pages.length - 1; j >= 0; j--) {
                page = pages[j];
                drawAnnotations(page, annotations[page]);
            }
        } else {
            for (var i = pages.length - 1; i >= 0; i--) {
                page = pages[i];

                canvas = document.getElementById("annotationpage" + page);
                if (canvas) {
                    ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
    };

    AnnotatePDF.showAnnotation = function(annotation) {
        var annoteData = JSON.parse(annotation);
        PDFViewerApplication.page = annoteData.page;

        var annotationPage = document.getElementById("annotationpage"+annoteData.page);

        if(annotationPage) {
            drawAnnotations(annoteData.page, annoteData.coords, 'single');
        } else {
            if(!anchorCoords) {
                anchorCoords = {};
            }
            anchorCoords[annoteData.page] = annoteData.coords;
        }
    };

    var PDFViewerApplication = window.PDFViewerApplication;
    var contextMenu = document.getElementById("wittyContextMenu");

    //Saving pdf viewer conttrolller scope
    var pdfViewer = parent.document.getElementById('pdfViewer');
    var pdfControllerCtrl = null;
    var pdfControllerScope = null;
    var anchorCoords = null;

    if (pdfViewer) {
        pdfControllerScope = parent.angular.element(pdfViewer).scope();
        if (pdfControllerScope) {
            pdfControllerCtrl = pdfControllerScope.pdfViewerCtrl;
            if(pdfControllerCtrl.anchors) {
                anchorCoords = {};
                var anchors = JSON.parse(pdfControllerCtrl.anchors);
                anchorCoords[anchors.page] = anchors.coords;
            }
        }
    }

    document.addEventListener('pagerendered', function(event) {
        var page = parseInt(event.target.id.replace(/^\D+/g, ''));
        var pageContainer = event.target;

        var pdfCanvas = pageContainer.firstChild.firstChild;

        var annotationLayer = document.createElement('canvas');
        annotationLayer.setAttribute('id', 'annotationpage' + page);
        annotationLayer.style.zIndex = 900;
        annotationLayer.style.position = 'absolute';
        annotationLayer.style.top = '0';
        annotationLayer.style.pointerEvents = 'none';
        annotationLayer.width = pdfCanvas.width;
        annotationLayer.height = pdfCanvas.height;

        pageContainer.appendChild(annotationLayer);

        if (anchorCoords && anchorCoords[page]) {
            drawAnnotations(page, anchorCoords[page], 'single');
        } else if(showAnnotation) {
            if(annotations[page]) {
                drawAnnotations(page, annotations[page]);
            }
        }
    });

    document.addEventListener('pagesinit', function() {
        if (anchorCoords) {
            var page = Object.keys(anchorCoords)[0];
            PDFViewerApplication.page = parseInt(page);
            PDFViewerApplication.pdfViewer.currentScaleValue = 'page-fit';
        }
    });

    if (pdfControllerCtrl.canCreateAnchors === 'true') {
        document.addEventListener('contextmenu', function(event) {
            var selectedText = window.getSelection().toString();
            if (selectedText) {
                event.preventDefault();
                var anchorReference = document.getElementById('anchorRefrenceContext');
                anchorReference.classList.remove('hidden');
                toggleContextMenu();
                contextMenu.style.top = event.pageY + 'px';
                contextMenu.style.left = event.pageX + 'px';
            }
        });

        contextMenu.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            toggleContextMenu();
            var anchorReference = null, selectedData = {};
            if (event.target.id === 'anchorRefrenceContext') {
                anchorReference = document.getElementById('anchorRefrenceContext');
                anchorReference.classList.add('hidden');

                selectedData = getHightlightCoords();
                selectedData.content = window.getSelection().toString();

            } else if(event.target.id === 'rectangleSelectionContext') {
                anchorReference = document.getElementById('rectangleSelectionContext');
                anchorReference.classList.add('hidden');

                selectedData.content = '';
                selectedData.page = PDFViewerApplication.pdfViewer.currentPageNumber;

                var canvasState = canvasStateContainer[selectedData.page -1];
                var shape = canvasState.shapes[canvasState.shapes.length - 1];

                if(shape) {
                    selectedData.coords = [shape.x, shape.y, shape.w, shape.h];
                    selectedData.type = 'RECTANGLE';
                }
            }

            if (pdfControllerScope && pdfControllerScope.pdfViewerCtrl) {
                pdfControllerScope.pdfViewerCtrl.createAnchorLink(selectedData);
            }
        });

        document.addEventListener('click', function(ev) {
            if (contextMenu.style.display === 'block' && ev.button !== 2) {
                contextMenu.style.display = 'none';
            }
        });

        var toggleContextMenu = function() {
            if (contextMenu.style.display === 'block') {
                contextMenu.style.display = 'none';
            } else if (contextMenu.style.display === 'none') {
                contextMenu.style.display = 'block';
            }
        };
    }



    function drawAnnotations(page, coords, type) {
        var canvas = document.getElementById("annotationpage" + page);
        if (!canvas) {
            return;
        }
        var annotateData;
        if(type === 'single') {
            var ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            annotateData = {
                page: page,
                coords: coords
            };

            showHighlight(canvas, annotateData);
        } else {
            var anchor;
            for (var i = coords.length - 1; i >= 0; i--) {
                anchor = coords[i];
                annotateData = {
                    page: page,
                    coords: anchor.coords
                };
                showHighlight(canvas, annotateData);
            }
        }
    }

    function getHightlightCoords() {
        var range = window.getSelection().getRangeAt(0);
        var parent = range.endContainer.parentElement;
        while(parent.id.indexOf('page') === -1) {
            parent = parent.parentElement;
        }

        var pageNumber = parseInt(parent.id.replace(/^\D+/g, ''));
        var selectionRects = range.getClientRects();
        var page = PDFViewerApplication.pdfViewer.getPageView(pageNumber - 1);
        var pageRect = page.canvas.getClientRects()[0];
        var viewport = page.viewport;

        //Get lodash from parent
        var _ = window.parent._;
        var selected = _.map(selectionRects, function(r) {
            return viewport.convertToPdfPoint(r.left - pageRect.left, r.top - pageRect.top).concat(
                viewport.convertToPdfPoint(r.right - pageRect.left, r.bottom - pageRect.top));
        });

        return {
            page: pageNumber,
            coords: selected
        };
    }


    function showHighlight(canvas, highlightData) {
        var ctx = canvas.getContext('2d');
        var pageIndex = highlightData.page - 1;
        var page = PDFViewerApplication.pdfViewer.getPageView(pageIndex);

        var viewport = page.viewport;
        highlightData.coords.forEach(function(rect) {
            var bounds = viewport.convertToViewportRectangle(rect);
            ctx.fillStyle = 'rgba(238, 170, 0, .2)';
            ctx.fillRect(Math.min(bounds[0], bounds[2]), Math.min(bounds[1],
                bounds[3]), Math.abs(bounds[0] - bounds[2]), Math.abs(bounds[1] - bounds[3]));
        });
    }

    var rectangleRegion = document.getElementById("createRectangle");

    rectangleRegion.addEventListener('click', function() {
        var page = PDFViewerApplication.pdfViewer.currentPageNumber;
        var annotationCanvas = document.getElementById('annotationpage' + page);
        if (annotationCanvas.style.pointerEvents === 'none') {
            annotationCanvas.style.pointerEvents = 'auto';
        } else {
            annotationCanvas.style.pointerEvents = 'none';
        }
    });

    // Constructor for Shape objects to hold data for all drawn objects.
    // For now they will just be defined as rectangles.
    function Shape(x, y, w, h, fill) {
        // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
        // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
        // But we aren't checking anything else! We could put "Lalala" for the value of x
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 1;
        this.h = h || 1;
        this.fill = fill || '#AAAAAA';
        this.canEdit = true;
    }

    var selectionHandles = [];

    // Draws this shape to a given context
    Shape.prototype.draw = function(context, mySel) {
        context.fillStyle = this.fill;
        context.fillRect(this.x, this.y, this.w, this.h);

        // draw selection
        // this is a stroke along the box and also 8 new selection handles
        if (mySel === this) {
            context.strokeStyle = '#CC0000';
            context.lineWidth = 2;
            context.strokeRect(this.x, this.y, this.w, this.h);

            var half = 6 / 2;

            // 0  1  2
            // 3     4
            // 5  6  7

            // top left, middle, right
            selectionHandles[0].x = this.x - half;
            selectionHandles[0].y = this.y - half;

            selectionHandles[1].x = this.x + this.w / 2 - half;
            selectionHandles[1].y = this.y - half;

            selectionHandles[2].x = this.x + this.w - half;
            selectionHandles[2].y = this.y - half;

            //middle left
            selectionHandles[3].x = this.x - half;
            selectionHandles[3].y = this.y + this.h / 2 - half;

            //middle right
            selectionHandles[4].x = this.x + this.w - half;
            selectionHandles[4].y = this.y + this.h / 2 - half;

            //bottom left, middle, right
            selectionHandles[6].x = this.x + this.w / 2 - half;
            selectionHandles[6].y = this.y + this.h - half;

            selectionHandles[5].x = this.x - half;
            selectionHandles[5].y = this.y + this.h - half;

            selectionHandles[7].x = this.x + this.w - half;
            selectionHandles[7].y = this.y + this.h - half;


            context.fillStyle = 'darkred';

            for (var i = 0; i < 8; i++) {
                var cur = selectionHandles[i];
                context.fillRect(cur.x, cur.y, 6, 6);
            }
        }
    }

    // Determine if a point is inside the shape's bounds
    Shape.prototype.contains = function(mx, my) {
        // All we have to do is make sure the Mouse X,Y fall in the area between
        // the shape's X and (X + Width) and its Y and (Y + Height)
        return (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
    }

    function CanvasState(canvas, container) {
        // **** First some setup! ****

        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        // This complicates things a little but but fixes mouse co-ordinate problems
        // when there's a border or padding. See getMouse for more detail
        var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
        if (document.defaultView && document.defaultView.getComputedStyle) {
            this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
            this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
            this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
            this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
        }
        // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
        // They will mess up mouse coordinates and this fixes that
        var html = document.body.parentNode;
        this.htmlTop = html.offsetTop;
        this.htmlLeft = html.offsetLeft;

        // **** Keep track of state! ****

        this.valid = false; // when set to false, the canvas will redraw everything
        this.shapes = []; // the collection of things to be drawn
        this.dragging = false; // Keep track of when we are dragging
        this.isResizeDrag = false;
        this.expectResize = -1;
        // the current selected object. In the future we could turn this into an array for multiple selection
        this.selection = null;
        this.dragoffx = 0; // See mousedown and mousemove events for explanation
        this.dragoffy = 0;

        // draw the boxes
        for (var i = 0; i < 8; i++) {
            var rect = new Box();
            selectionHandles.push(rect);
        }

        // **** Then events! ****

        var myState = this;

        //fixes a problem where double clicking causes text to get selected on the canvas
        canvas.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        }, false);
        // Up, down, and move are for dragging
        canvas.addEventListener('mousedown', function(e) {
            if (e.which === 3 || e.button === 2) {
                return;
            }
            var mouse = myState.getMouse(e);
            var mx = mouse.x;
            var my = mouse.y;

            if (myState.expectResize !== -1) {
                myState.isResizeDrag = true;
                return;
            }

            var shapes = myState.shapes;
            var l = shapes.length;
            for (var i = l - 1; i >= 0; i--) {
                if (shapes[i].contains(mx, my)) {
                    var mySel = shapes[i];
                    // Keep track of where in the object we clicked
                    // so we can move it smoothly (see mousemove)
                    myState.dragoffx = mx - mySel.x;
                    myState.dragoffy = my - mySel.y;
                    myState.dragging = true;
                    myState.selection = mySel;
                    myState.valid = false;
                    return;
                }
            }
            // havent returned means we have failed to select anything.
            // If there was an object selected, we deselect it
            if (myState.selection) {
                myState.selection = null;
                myState.valid = false; // Need to clear the old selection border
            }
        }, true);

        canvas.addEventListener('contextmenu', function(e) {
            var shape = null;
            if (myState.shapes.length) {
                e.preventDefault();
                shape = myState.shapes[myState.shapes.length - 1];

                var anchorReference = document.getElementById('rectangleSelectionContext');
                anchorReference.classList.remove('hidden');

                toggleContextMenu();
                contextMenu.style.top = e.pageY + 'px';
                contextMenu.style.left = e.pageX + 'px';
            }

        }, true);

        canvas.addEventListener('mousemove', function(e) {
            var mouse = myState.getMouse(e);
            var mx = mouse.x;
            var my = mouse.y;
            if (myState.dragging) {
                // We don't want to drag the object by its top-left corner, we want to drag it
                // from where we clicked. Thats why we saved the offset and use it here
                myState.selection.x = mouse.x - myState.dragoffx;
                myState.selection.y = mouse.y - myState.dragoffy;
                myState.valid = false; // Something's dragging so we must redraw
            } else if (myState.isResizeDrag) {
                // time ro resize!
                var mySel = myState.selection;
                var oldx = mySel.x;
                var oldy = mySel.y;

                // 0  1  2
                // 3     4
                // 5  6  7
                switch (myState.expectResize) {
                    case 0:
                        mySel.x = mx;
                        mySel.y = my;
                        mySel.w += oldx - mx;
                        mySel.h += oldy - my;
                        break;
                    case 1:
                        mySel.y = my;
                        mySel.h += oldy - my;
                        break;
                    case 2:
                        mySel.y = my;
                        mySel.w = mx - oldx;
                        mySel.h += oldy - my;
                        break;
                    case 3:
                        mySel.x = mx;
                        mySel.w += oldx - mx;
                        break;
                    case 4:
                        mySel.w = mx - oldx;
                        break;
                    case 5:
                        mySel.x = mx;
                        mySel.w += oldx - mx;
                        mySel.h = my - oldy;
                        break;
                    case 6:
                        mySel.h = my - oldy;
                        break;
                    case 7:
                        mySel.w = mx - oldx;
                        mySel.h = my - oldy;
                        break;
                }

                myState.valid = false;
            }

            if (myState.selection !== null && !myState.isResizeDrag) {
                for (var i = 0; i < 8; i++) {
                    var cur = selectionHandles[i];
                    if (mx >= cur.x && mx <= cur.x + 6 &&
                        my >= cur.y && my <= cur.y + 6) {

                        myState.expectResize = i;
                        myState.valid = false;

                        switch (i) {
                            case 0:
                                this.style.cursor = 'nw-resize';
                                break;
                            case 1:
                                this.style.cursor = 'n-resize';
                                break;
                            case 2:
                                this.style.cursor = 'ne-resize';
                                break;
                            case 3:
                                this.style.cursor = 'w-resize';
                                break;
                            case 4:
                                this.style.cursor = 'e-resize';
                                break;
                            case 5:
                                this.style.cursor = 'sw-resize';
                                break;
                            case 6:
                                this.style.cursor = 's-resize';
                                break;
                            case 7:
                                this.style.cursor = 'se-resize';
                                break;
                        }
                        return;
                    }

                    myState.isResizeDrag = false;
                    myState.expectResize = -1;
                    this.style.cursor = 'auto';
                }
            }
        }, true);
        canvas.addEventListener('mouseup', function(e) {
            if (e.which === 3 || e.button === 2) {
                return;
            }
            myState.dragging = false;
            myState.isResizeDrag = false;
            myState.expectResize = -1;
        }, true);
        // double click for making new shapes
        canvas.addEventListener('click', function(e) {
            if (e.which === 3 || e.button === 2) {
                return;
            }
            var shapesLength = myState.shapes.length;
            var shape = null;
            if (shapesLength > 0) {
                shape = myState.shapes[myState.shapes.length - 1];
            }
            if (shapesLength === 0 || !shape.canEdit) {
                var mouse = myState.getMouse(e);
                var newShape = new Shape(mouse.x - 10, mouse.y - 10, 200, 200, 'rgba(238, 170, 0, .2)');
                myState.addShape(newShape);
                myState.dragoffx = mouse.x - newShape.x;
                myState.dragoffy = mouse.y - newShape.y;
                myState.dragging = true;
                myState.selection = newShape;
                myState.valid = false;
            }
        }, true);

        // **** Options! ****

        this.selectionColor = '#CC0000';
        this.selectionWidth = 2;
        this.interval = 30;
        setInterval(function() {
            myState.draw();
        }, myState.interval);
    }

    CanvasState.prototype.addShape = function(shape) {
        this.shapes.push(shape);
        this.valid = false;
    }

    CanvasState.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // While draw is called as often as the INTERVAL variable demands,
    // It only ever does something if the canvas gets invalidated by our code
    CanvasState.prototype.draw = function() {
        // if our state is invalid, redraw and validate!
        if (!this.valid) {
            var ctx = this.ctx;
            var shapes = this.shapes;
            this.clear();

            // ** Add stuff you want drawn in the background all the time here **

            // draw all shapes
            var l = shapes.length;
            for (var i = 0; i < l; i++) {
                var shape = shapes[i];
                // We can skip the drawing of elements that have moved off the screen:
                if (shape.x > this.width || shape.y > this.height ||
                    shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
                shapes[i].draw(ctx, this.selection);
            }

            // ** Add stuff you want drawn on top all the time here **

            this.valid = true;
        }
    }


    // Creates an object with x and y defined, set to the mouse position relative to the state's canvas
    // If you wanna be super-correct this can be tricky, we have to worry about padding and borders
    CanvasState.prototype.getMouse = function(e) {
        var canvas = this.canvas;

        var rect = canvas.getBoundingClientRect();

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    // Box object to hold data
    function Box() {
        this.x = 0;
        this.y = 0;
        this.w = 1; // default width and height?
        this.h = 1;
        this.fill = '#444444';
    }
})();
