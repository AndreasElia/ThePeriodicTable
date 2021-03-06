/*
 *  Code developed by the Moose Lightning group
 *  Andreas Elia, Jack Hilton, Connell Henry, Alex Woodward
 */
// Once the page had loaded, call the init function
window.onload = init;

// Shortcut for using THREE based functions
var t = THREE;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_PLANE = 0.1;
var FAR_PLANE = 10000;

// Main variables
var scene, renderer, camera;

// Optional variables used for timing and performance
var clock, stats;

var game = false;

var answer;

// Font variables
var font, textGeometry, textMesh, textMaterial;

// Stores current element Collada and Dae file
var currentElementCollada;
var currentElementDae;

// Stores the texture and font loaders
var textureLoader, fontLoader;

// Periodic table elements and information
var elements = [];

var filterCheck = false;
var metalFilterCheck = false;
var metalloidFilterCheck = false;
var nonmetalFilterCheck = false;

// Store an array of element textures
// var elementTextures = [];

// Elements added to here for their collisions
var objects = [];

var raycaster;

var massNumber;
var type;

var mouse = {
    x: 0,
    y: 0
};

var scale = 8;

var atomicNumber;
var elementName;

var hasElements = false;

var stateTable = false;
var stateInfo = false;

var protons = [];

function init() {
    // Create the stats for tracking performance
    stats = new Stats();

    // Set the mode for the stats tracking to 0 for FPS mode
    stats.setMode(0);

    // Add the stats DOM element to the window
    document.body.appendChild(stats.domElement);

    // Create a WebGL renderer
    renderer = new t.WebGLRenderer();

    // Set the renderer size
    renderer.setSize(WIDTH, HEIGHT);

    // Change the colour of the background
    renderer.setClearColor(0xB0D2D3);

    // Add the renderers DOM element to the window
    document.body.appendChild(renderer.domElement);

    // Create a new scene
    scene = new t.Scene();

    // Create a camera
    camera = new t.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE);

    // If the position wasn't set, the camera would start at 0, 0, 0
    camera.position.set(0, 0, 470);

    // Create a new instance of the clock
    clock = new t.Clock();

    raycaster = new t.Raycaster();

    textureLoader = new t.TextureLoader();

    fontLoader = new t.FontLoader();

    // elementTextures.push(textureLoader.load('objects/images/image.png'));

    // Handled mouse clicking on elements
    document.addEventListener('mousedown', onMouseDown, false);

    // Handles the browser being resized
    window.addEventListener('resize', onWindowResize, false);

    // Create all of the elements
    var xmlRequest = new XMLHttpRequest();
    var jsonFile = "js/elements.json";

    xmlRequest.onreadystatechange = function() {
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) {
            // Parse the json data
            var jsonData = JSON.parse(xmlRequest.responseText);

            // Loop through the json data and create the elements
            for (var i = 0; i < jsonData.length; i++) {
                // Add the element to the elements array
                elements.push({
                    x: jsonData[i].x,
                    y: jsonData[i].y,
                    symbol: jsonData[i].symbol,
                    name: jsonData[i].name,
                    atomicNum: jsonData[i].atomicNum,
                    massNum: jsonData[i].massNum,
                    model: jsonData[i].model,
                    texture: jsonData[i].texture,
                    description: jsonData[i].description,
                    type: jsonData[i].type
                });
            }

            // Call a function to setup the scene
            initTableScene("nil");
        }
    };

    xmlRequest.open('get', jsonFile, true);
    xmlRequest.send();

    // Start the updating and rendering
    animate();
}

function gameText(massNumber, type) {


    if (type == 1) {
        var question = "Click the element with the mass number... " + massNumber;

        textGeometry = new t.TextGeometry(question, {
            font,
            size: 4,
            height: 0
        });

        textMaterial = new t.MultiMaterial(
            [
                new t.MeshPhongMaterial({
                    color: 0xff00ff,
                    shading: t.FlatShading
                }),
                new t.MeshPhongMaterial({
                    color: 0xffffff,
                    shading: t.SmoothShading
                })
            ]
        );

        textMesh = new t.Mesh(textGeometry, textMaterial);

        textGeometry.computeBoundingBox();

        var centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);

        textMesh.position.x = -54;
        textMesh.position.y = 50;
        textMesh.position.z = 300;
        scene.add(textMesh);

        answer = massNumber;
    } else if (type == 2) {
        var question = "Click the element with the mass number... " + massNumber;

        textGeometry = new t.TextGeometry(question, {
            font,
            size: 4,
            height: 0
        });

        textMaterial = new t.MultiMaterial(
            [
                new t.MeshPhongMaterial({
                    color: 0xff00ff,
                    shading: t.FlatShading
                }),
                new t.MeshPhongMaterial({
                    color: 0xffffff,
                    shading: t.SmoothShading
                })
            ]
        );

        textMesh = new t.Mesh(textGeometry, textMaterial);

        textGeometry.computeBoundingBox();

        var centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);

        textMesh.position.x = -54;
        textMesh.position.y = 50;
        textMesh.position.z = 300;
        scene.add(textMesh);


        answer = massNumber;
    } else {
        var elementN = elements[random(0, elements.length - 1)].name;
        var question = "Click the element " + elementN;


        textGeometry = new t.TextGeometry(question, {
            font,
            size: 4,
            height: 0
        });

        textMaterial = new t.MultiMaterial(
            [
                new t.MeshPhongMaterial({
                    color: 0xff00ff,
                    shading: t.FlatShading
                }),
                new t.MeshPhongMaterial({
                    color: 0xffffff,
                    shading: t.SmoothShading
                })
            ]
        );

        textMesh = new t.Mesh(textGeometry, textMaterial);

        textGeometry.computeBoundingBox();

        var centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);

        textMesh.position.x = -54;
        textMesh.position.y = 50;
        textMesh.position.z = 300;
        scene.add(textMesh);

        answer = elementN;
    }

}

function createTextTableSceneText() {

    for (var i = 0; i < elements.length; i++) {
        if (elements[i] != undefined) {
            var x = elements[i].x;
            var y = elements[i].y;
            textGeometry = new t.TextGeometry(elements[i].symbol, {
                font,
                size: 2,
                height: 0
            });

            textMaterial = new t.MultiMaterial(
                [
                    new t.MeshPhongMaterial({
                        color: 0xff00ff,
                        shading: t.FlatShading
                    }),
                    new t.MeshPhongMaterial({
                        color: 0xffffff,
                        shading: t.SmoothShading
                    })
                ]
            );

            textMesh = new t.Mesh(textGeometry, textMaterial);

            textGeometry.computeBoundingBox();

            var textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            var textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;

            textMesh.position.x = -75.5 + (x * 8.5) + (-0.5 * textWidth);
            textMesh.position.y = 29 + -(y * 8.5) + (-0.5 * textHeight);
            textMesh.position.z = 300;

            scene.add(textMesh);
        }
    }

    textGeometry = new t.TextGeometry("Metals", {
        font,
        size: 2,
        height: 0
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xff00ff,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xffffff,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textMesh.position.x = -22.5;
    textMesh.position.y = -57.5;
    textMesh.position.z = 300;

    scene.add(textMesh);

    textGeometry = new t.TextGeometry("Metalloids", {
        font,
        size: 2,
        height: 0
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xff00ff,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xffffff,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textMesh.position.x = 12.5;
    textMesh.position.y = -57.5;
    textMesh.position.z = 300;

    scene.add(textMesh);

    textGeometry = new t.TextGeometry("Non-Metal", {
        font,
        size: 2,
        height: 0
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xff00ff,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xffffff,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textMesh.position.x = -6.5;
    textMesh.position.y = -57.5;
    textMesh.position.z = 300;

    scene.add(textMesh);

    textGeometry = new t.TextGeometry("Element Game", {
        font,
        size: 2,
        height: 0
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xff00ff,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xffffff,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textMesh.position.x = 48;
    textMesh.position.y = -57.5;
    textMesh.position.z = 300;

    scene.add(textMesh);
}

function initTableScene(filterStyle) {
    // // Create the background protons
    for (var i = 0; i < 5; i++) {
        var proton = new Proton();
        proton.init();
        proton.cube.position.set(Math.random() * 400 - 200, Math.random() * 400 - 200, 0);
        protons.push(proton);
        scene.add(proton.cube);
    }

    stateTable = true;

    if (hasElements == false) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] != undefined) {
                var x = elements[i].x;
                var y = elements[i].y;


                var element = new t.Mesh(new t.CubeGeometry(scale, scale, 0), new t.MeshBasicMaterial());

                element.position.set(-(scale * 10) + x + (x * scale), -y + -(y * scale) + 30, 290);

                if (filterStyle.localeCompare(elements[i].type) == 0) {
                    element.material.color.setHex(0x666666);
                } else {
                    element.material.color.setHex(0xFFFFFF);
                }
                element.name = {
                    id: i,
                    b: true
                };

                // Add the "element" to the scene
                scene.add(element);

                // Add the element to the objects array so we can detect when it is clicked
                objects.push(element);
            }
        }
        hasElements = true;
    }

    var fontLoader = new t.FontLoader();

    fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
        font = response;

        createTextTableSceneText();

    });

    var metalFilter = new t.Mesh(new t.CubeGeometry(scale + 10, scale, 0), new t.MeshBasicMaterial());

    metalFilter.position.set(-20, -60, 290);
    metalFilter.material.color.setHex(0xFFFFFF);
    metalFilter.name = {
        id: "metal",
        a: true

    };

    var metalloidFilter = new t.Mesh(new t.CubeGeometry(scale + 10, scale, 0), new t.MeshBasicMaterial());

    metalloidFilter.position.set(20, -60, 290);
    metalloidFilter.material.color.setHex(0xFFFFFF);
    metalloidFilter.name = {
        id: "metalloid",
        a: true

    };

    var nonmetalFilter = new t.Mesh(new t.CubeGeometry(scale + 10, scale, 0), new t.MeshBasicMaterial());

    nonmetalFilter.position.set(0, -60, 290);
    nonmetalFilter.material.color.setHex(0xFFFFFF);
    nonmetalFilter.name = {
        id: "nonmetal",
        a: true

    };

    var game = new t.Mesh(new t.CubeGeometry(scale + 15, scale, 0), new t.MeshBasicMaterial());

    game.position.set(60, -60, 290);
    game.material.color.setHex(0xFFFFFF);
    game.name = {
        id: "game",
        game: true

    };


    // Add the "element" to the scene
    scene.add(metalFilter);
    scene.add(nonmetalFilter);
    scene.add(metalloidFilter);
    scene.add(game);

    // Add the element to the objects array so we can detect when it is clicked
    objects.push(metalFilter);
    objects.push(nonmetalFilter);
    objects.push(metalloidFilter);
    objects.push(game);

}

function initTableSceneGame() {
    // // Create the background protons
    for (var i = 0; i < 5; i++) {
        var proton = new Proton();
        proton.init();
        proton.cube.position.set(Math.random() * 400 - 200, Math.random() * 400 - 200, 0);
        protons.push(proton);
        scene.add(proton.cube);
    }

    stateTable = true;

    if (hasElements == false) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] != undefined) {
                var x = elements[i].x;
                var y = elements[i].y;


                var element = new t.Mesh(new t.CubeGeometry(scale, scale, 0), new t.MeshBasicMaterial());

                element.position.set(-(scale * 10) + x + (x * scale), -y + -(y * scale) + 30, 290);


                element.material.color.setHex(0xFFFFFF);

                element.name = {
                    id: i,
                    b: true
                };

                // Add the "element" to the scene
                scene.add(element);

                // Add the element to the objects array so we can detect when it is clicked
                objects.push(element);




            }
        }
        hasElements = true;
    }

    var fontLoader = new t.FontLoader();

    fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
        font = response;

        createTextTableSceneText();

    });

    var metalFilter = new t.Mesh(new t.CubeGeometry(scale + 10, scale, 0), new t.MeshBasicMaterial());

    metalFilter.position.set(-20, -60, 290);
    metalFilter.material.color.setHex(0xFFFFFF);
    metalFilter.name = {
        id: "metal",
        a: true

    };

    var metalloidFilter = new t.Mesh(new t.CubeGeometry(scale + 10, scale, 0), new t.MeshBasicMaterial());

    metalloidFilter.position.set(20, -60, 290);
    metalloidFilter.material.color.setHex(0xFFFFFF);
    metalloidFilter.name = {
        id: "metalloid",
        a: true

    };

    var nonmetalFilter = new t.Mesh(new t.CubeGeometry(scale + 10, scale, 0), new t.MeshBasicMaterial());

    nonmetalFilter.position.set(0, -60, 290);
    nonmetalFilter.material.color.setHex(0xFFFFFF);
    nonmetalFilter.name = {
        id: "nonmetal",
        a: true

    };

    var game = new t.Mesh(new t.CubeGeometry(scale + 15, scale, 0), new t.MeshBasicMaterial());

    game.position.set(60, -60, 290);
    game.material.color.setHex(0xFFFFFF);
    game.name = {
        id: "game",
        game: true

    };


    // Add the "element" to the scene
    scene.add(metalFilter);
    scene.add(nonmetalFilter);
    scene.add(metalloidFilter);
    scene.add(game);

    // Add the element to the objects array so we can detect when it is clicked
    objects.push(metalFilter);
    objects.push(nonmetalFilter);
    objects.push(metalloidFilter);
    objects.push(game);




    generateQuestion();

}

function generateQuestion() {

    massNumber = elements[random(0, elements.length - 1)].massNum;
    atomicNumber = elements[random(0, elements.length - 1)].atomicNum;
    elementName = elements[random(0, elements.length - 1)].name;

    type = Math.floor((Math.random() * 3) + 1);

    if (type == 1) {
        var fontLoader = new t.FontLoader();

        fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
            font = response;

            gameText(massNumber, 1);

        });
    } else if (type == 2) {
        var fontLoader = new t.FontLoader();

        fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
            font = response;

            gameText(atomicNumber, 2);

        });
    } else {
        var fontLoader = new t.FontLoader();

        fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
            font = response;

            gameText(name, 3);

        });

    }
}


function initInfoScene(elementId) {
    var descriptionBox = document.createElement('id');
    descriptionBox.id = 'descriptionBox';
    descriptionBox.style = 'position: absolute; top: 200px; left: -452px; right: 0; width: 40%; overflow: hidden; margin: 0 auto; min-width: 590px; max-width: 590px; background-color: #eee; color: #444; padding: 10px; border-radius: 2px; z-index: 5;';
    descriptionBox.innerHTML = "<h2>" + elements[elementId.id].symbol + " - " + elements[elementId.id].name + "</h2>" + "<h3>Atomic Number:</h3>" + elements[elementId.id].atomicNum + "<h3>Mass Number:</h3>" + elements[elementId.id].massNum + "<h3>Description:</h3>" + elements[elementId.id].description;
    document.body.appendChild(descriptionBox);

    var element = new t.Mesh(new t.CubeGeometry(20, scale, 0.1), new t.MeshBasicMaterial());

    element.position.set(-(scale * 10) + scale + 2, 50 + 2, 290);
    element.material.color.setHex(0x444444);
    element.name = {
        id: elementId.id,
        b: false
    };

    // Add the "element" to the scene
    scene.add(element);

    // Add the element to the objects array so we can detect when it is clicked
    objects.push(element);

    textGeometry = new t.TextGeometry("Back to table", {
        font,
        size: 2,
        height: 0
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xffffff,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xffffff,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox();

    textMesh.position.x = -74;
    textMesh.position.y = 48;
    textMesh.position.z = 300;
    scene.add(textMesh);

    currentElementCollada = new t.ColladaLoader();
    currentElementCollada.options.convertUpAxis = true;

    //Loads current element and adds it to the scene
    currentElementCollada.load('objects/' + elements[elementId.id].model + '.DAE', function(collada) {
        currentElementDae = collada.scene;

        // Set the position of the model
        currentElementDae.position.set(200, 0, 0);

        // Scales model
        currentElementDae.scale.set(10, 10, 10);
        currentElementDae.updateMatrix();

        // This can also be used for applying the textures to the models by
        // using "map" not "color"
        setColladaColour(currentElementDae, new t.MeshBasicMaterial({
            map: textureLoader.load('objects/images/' + elements[elementId.id].texture)
        }));

        scene.add(currentElementDae);
    });

    // Setup light in the scene
    var ambientLight = new t.AmbientLight(0xffffff);

    // Add the ambient light to the scene
    scene.add(ambientLight);

}

function setColladaColour(dae, material) {
    dae.material = material;

    if (dae.children) {
        for (var i = 0; i < dae.children.length; i++) {
            setColladaColour(dae.children[i], material);
        }
    }
}

function animate() {
    stats.begin();

    update();
    render();

    stats.end();

    requestAnimationFrame(animate);
}
var i = 0;

function update() {
    var dt = clock.getDelta();

    if (currentElementDae && stateInfo) {
        currentElementDae.rotation.set(i, 0, i);

        i += 0.01;
    }

    updateProtons(dt);
}

function updateProtons(dt) {
    for (var i = 0; i < protons.length; i++) {
        var proton = protons[i];
        proton.update(dt);
    }
}

function render() {
    renderer.render(scene, camera);
}

function onMouseDown(event) {
    event.preventDefault();

    // Get a value between 1 and -1 for the mouse position on screen
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
        if (game) {
            if (intersects[0].object.name.b == true) {
                if (type == 1) {
                    var id = intersects[0].object.name.id;
                    if (elements[id].massNum == massNumber) {
                        correct();
                    } else {
                        incorect();
                    }
                } else if (type == 2) {
                    var id = intersects[0].object.name.id;
                    if (elements[id].atomicNum == atomicNumber) {
                        correct();
                    } else {
                        incorect();
                    }

                } else {
                    var id = intersects[0].object.name.id;
                    if (elements[id].name == elementName) {
                        correct();
                    } else {
                        incorect();
                    }

                }
            }
        }

        if (intersects[0].object.name.b == true && game == false) {
            clearScene();
            initInfoScene(intersects[0].object.name);
            stateTable = false;
            stateInfo = true;
        } else if (intersects[0].object.name.a == true) {
            clearScene();
            if (filterCheck == false) {
                initTableScene(intersects[0].object.name.id);
                filterCheck = true;
            } else if (filterCheck == true) {
                initTableScene("nul");
                filterCheck = false;
            }
            stateTable = true;
            stateInfo = false;
        } else if (intersects[0].object.name.game == true) {
            clearScene();
            if (game == false) {

                initTableSceneGame();
                game = true;
            } else {
                initTableScene("null");
                game = false;
            }
            stateTable = false;
            stateInfo = true;
        } else if (game == false) {
            clearScene();
            var elem = document.getElementById("descriptionBox");
            elem.parentNode.removeChild(elem);
            initTableScene("nil");
            stateTable = true;
            stateInfo = false;
        }
    }
}

function random(min, max) {
    // Return a random number between the two numbers given
    return Math.floor(Math.random() * (max - min) + min);
}

function clearScene() {
    hasElements = false;
    objects = [];
    scene = new t.Scene();
}

function onWindowResize() {
    // Set the WIDTH and HEIGHT variables to the new window width/height
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    // Set the camera aspect to the new aspect
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

    // Set the renderer set
    renderer.setSize(WIDTH, HEIGHT);
}

function correct() {
    var timer = 0;

    var fontLoader = new t.FontLoader();

    fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
        font = response;

        answerText("correct");

    });

    do {
        timer++;
    } while (timer < 900000);

    clearScene();
    initTableSceneGame();
    game = true;
    generateQuestion();
}

function incorect() {
    var fontLoader = new t.FontLoader();

    fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
        font = response;

        answerText("incorrect");

    });
}

function answerText(answer) {
    textGeometry = new t.TextGeometry(answer, {
        font,
        size: 2,
        height: 1
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xff00ff,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xffffff,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox();

    var centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);

    textMesh.position.x = -50;
    textMesh.position.y = 40;
    textMesh.position.z = 300;

    scene.add(textMesh);
}
