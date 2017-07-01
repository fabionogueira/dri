Ext.define('visiomatic.Visiomatic', {
    extend: 'Ext.panel.Panel',

    requires: [
        'visiomatic.VisiomaticModel',
        'visiomatic.VisiomaticController'

    ],

    mixins: {
        interface: 'visiomatic.Interface'
    },

    xtype: 'visiomatic',

    controller: 'visiomatic',

    viewModel: 'visiomatic',

    // id: 'visiomatic_panel',

    height: '100%',

    width: '100%',

    /**
     * Instancia da biblioteca Leaflet window.L
     */
    libL: null,

    config: {

        map: null,
        mapOptions: {
            fullscreenControl: true,
            zoom: 1
        },

        prefix: '',

        enableSidebar: true,

        // Catalog Overlays
        enableCatalogs: true,
        availableCatalogs: [
            'Y3A1',
            'Y1A1',
            'GALEX_AIS',
            '2MASS',
            'AllWISE',
            'SDSS',
            'PPMXL',
            'Abell',
            'NVSS',
            'FIRST',
            'GAIA_DR1'
        ],

        enableMiniMap: false,
        miniMapOptions: {
            position: 'topright',
            width: 128,
            height: 128,
            zoomLevelOffset: -6,
            nativeCelsys: true
        },
        miniMap: true,

        enableWcs: true,
        wcsUnits: [
            {
                label: 'RA, Dec (Deg)',
                units: 'deg'
            },
            {
                label: 'RA, Dec (HMS)',
                units: 'HMS'
            }
        ],

        enableScale: true,

        image: null,
        imageLayer: null,
        imageOptions: {
            credentials: true,
            center: false,
            fov: false,
            mixingMode: 'color',
            defaultChannel: 2,
            contrast: 0.7,
            gamma: 2.8,
            colorSat: 2.0,
            channelLabelMatch: '[ugrizY]'
        },

        // Draw Radius Path Options http://leafletjs.com/reference-1.0.3.html#path
        radiusOptions: {
            weight: 2, //largura da borda em pixel
            opacity: 0.8, // transparencia da borda
            fillOpacity: 0.01, // Transparencia nos marcadores.
            color: '#2db92d', //Stroke color
            dashArray: '5, 5, 1, 5', //A string that defines the stroke dash pattern.
            interactive: false
        },

        // Draw Catalog Path Options http://leafletjs.com/reference-1.0.3.html#path
        catalogOptions: {
            weight: 2, //largura da borda em pixel
            opacity: 0.8, // transparencia da borda
            fillOpacity: 0.01, // Transparencia nos marcadores.
            color: '#2db92d', //Stroke color
            interactive: true,
            radius: 0.001 // radius do marker circulo em graus
        },

        // Draw Crosshair Path Options http://leafletjs.com/reference-1.0.3.html#path
        crosshairOptions: {
            color: '#90FA3A',
            weight: 1,
            opacity: 0.8,
            smoothFactor: 1,
            centerPadding: 0.005, // Deg
            size: 0.010 // Deg
        },

        release: null,
        tag: null,
        dataset: null,

        // adicionar uma toolbar
        enableTools: true,
        auxTools: [],

        ////// buttons //////

        // Get Link
        enableLink: true,
        // Shift Visiomatic/Aladin
        enableShift: true,

        ready: false,

        // Layer usada para exibir ou ocultar o raio de um cluster
        lradius: null,

        // Layer usada para exibir ou ocultar a crosshair
        lcrosshair: null,

        showCrosshair: true
    },

    bind: {
        release: '{release}',
        tag: '{tag}',
        dataset: '{dataset}'
    },

    initComponent: function () {
        var me = this,
            host = window.location.host,
            tollbar, btns, cmpVisiomatic;

        if (window.L) {
            me.libL  = window.L;

            // Registro do Catalogo
            me.libL.Catalog.Y3A1 = me.libL.extend({}, me.libL.Catalog, {
                name: 'Y3A1',
                attribution: 'Des Y3A1 COADD OBJECT SUMMARY',
                color: 'blue',
                maglim: 23.0,
                service: 'ScienceServer',
                regionType: 'box',
                authenticate: 'csrftoken',
                url: 'http://' + host + '/dri/api/visiomatic/coadd_objects/' +
                '?mime=csv' +
                '&source=Y3A1_COADD_OBJECT_SUMMARY' +
                '&columns=coadd_object_id,ra,dec,mag_auto_g,mag_auto_r,mag_auto_i,mag_auto_z,mag_auto_y,a_image,b_image,theta_j2000' +
                '&coordinate={lng},{lat}' +
                '&bounding={dlng},{dlat}' +
                '&maglim={maglim}' +
                '&limit=2000',
                // properties: ['mag_auto_g', 'mag_auto_r', 'mag_auto_i', 'mag_auto_z', 'mag_auto_y'],
                properties: ['ra', 'dec'],
                units: [],
                objurl: 'http://' + host + '/dri/apps/explorer/#coadd/Y3A1_COADD_OBJECT_SUMMARY/{id}',
                draw: function (feature, latlng) {
                    return me.libL.ellipse(latlng, {
                        majAxis: feature.properties.items[5] / 3600.0,
                        minAxis: feature.properties.items[6] / 3600.0,
                        posAngle: 90 - feature.properties.items[7],
                        // Path Options http://leafletjs.com/reference-1.0.3.html#path
                        weight: 1, //largura da borda em pixel
                        opacity: 0.5, // transparencia da borda
                        fillOpacity: 0.01 // Transparencia nos marcadores.
                    });
                }
            });

            me.libL.Catalog.Y1A1 = me.libL.extend({}, me.libL.Catalog, {
                name: 'Y1A1',
                attribution: 'Des Y1A1 COADD OBJECT',
                color: 'blue',
                maglim: 23.0,
                service: 'ScienceServer',
                regionType: 'box',
                authenticate: 'csrftoken',
                url: 'http://' + host + '/dri/api/visiomatic/coadd_objects/' +
                '?mime=csv' +
                '&source=y1a1_coadd_objects' +
                '&columns=coadd_objects_id,ra,dec,mag_auto_g,mag_auto_r,mag_auto_i,mag_auto_z,mag_auto_y,a_image,b_image,theta_image' +
                '&coordinate={lng},{lat}' +
                '&bounding={dlng},{dlat}' +
                '&maglim={maglim}' +
                '&limit=2000',
                // properties: ['mag_auto_g', 'mag_auto_r', 'mag_auto_i', 'mag_auto_z', 'mag_auto_y'],
                properties: ['ra', 'dec'],
                units: [],
                objurl: 'http://' + host + '/dri/apps/explorer/#coadd/y1a1_coadd_objects/{id}',
                draw: function (feature, latlng) {
                    return me.libL.ellipse(latlng, {
                        majAxis: feature.properties.items[5] / 3600.0,
                        minAxis: feature.properties.items[6] / 3600.0,
                        posAngle: feature.properties.items[7],
                        // Path Options http://leafletjs.com/reference-1.0.3.html#path
                        weight: 1, //largura da borda em pixel
                        opacity: 0.5, // transparencia da borda
                        fillOpacity: 0.01 // Transparencia nos marcadores.
                    });
                }
            });

        } else {
            console.log('window.L ainda nao esta carregada, incluir no app.json a biblioteca Leaflet');
        }

        cmpVisiomatic = Ext.create('Ext.Component', {
            id: me.getMapContainer(),
            width: '100%',
            height: '100%'
        });

        // Toolbar
        if (me.getEnableTools()) {
            tollbar = me.makeToolbar();
            tools = me.makeToolbarButtons();

            tollbar.add(tools);

            me.tbar = tollbar;

        }

        Ext.apply(this, {
            items: [
                cmpVisiomatic
            ]
        });

        me.callParent(arguments);
    },

    afterRender: function () {
        var me = this,
            libL = me.libL,
            mapContainer = me.getMapContainer(),
            mapOptions = me.getMapOptions(),
            map;

        me.callParent(arguments);

        // Criar uma instacia de L.Map
        map = libL.map(mapContainer, mapOptions);

        // set Prefix
        map.attributionControl.setPrefix(me.getPrefix());

        // Add a Reticle to Map
        libL.control.reticle().addTo(map);


        // Add Events Listeners to Map
        map.on('dblclick', me.onDblClick, me);
        map.on('contextmenu', me.onContextMenuClick, me);
        map.on('layeradd', me.onLayerAdd, me);
        map.on('move', me.onMove, me);

        // instancia de L.map
        me.setMap(map);

        ///////// Opcionais /////////

        // Sidebar
        if (me.getEnableSidebar()) {
            me.createSidebar();
        }

        // Wcs Control
        if (me.getEnableWcs()) {
            // OBS: O controle de Copy Clipboard esta escondigo pelo css
            me.addWcsController();
        }

        if (me.getEnableScale()) {
            me.addScaleController();
        }

    },

    onResize: function () {
        this.callParent(arguments);
        var map = this.getMap();
        if (map) {
            map.invalidateSize();
        }
    },

    getMapContainer: function () {

        return this.getId() + '-placeholder';
    },

    createSidebar: function () {
        var me = this,
            libL = me.libL,
            map = me.getMap(),
            availableCatalogs = me.getAvailableCatalogs(),
            sidebar,
            catalogs = [];

        sidebar = libL.control.sidebar().addTo(map);

        // Channel Mixing
        libL.control.iip.channel().addTo(sidebar);

        // Image Preference
        libL.control.iip.image().addTo(sidebar);

        // Catalog Overlays
        Ext.Array.each(availableCatalogs, function (value) {
            catalogs.push(
                libL.Catalog[value]
            );
        });

        libL.control.iip.catalog(catalogs).addTo(sidebar);

        // Region
        libL.control.iip.region(
            [
            ]
        ).addTo(sidebar);

        // Profile Overlays
        libL.control.iip.profile().addTo(sidebar);

        sidebar.addTabList();

    },

    addWcsController: function () {
        var me = this,
            libL = me.libL,
            map = me.getMap(),
            units = me.getWcsUnits();

        libL.control.wcs({
            coordinates: units,
            position: 'topright'
        }).addTo(map);
    },

    addScaleController: function () {
        var me = this,
            libL = me.libL,
            map = me.getMap();

        libL.control.scale.wcs({pixels: false}).addTo(map);
    },

    setImage: function (image, options) {
        var me = this,
            libL = me.libL,
            map = me.getMap(),
            miniMap = me.getMiniMap(),
            imageLayer = me.getImageLayer(),
            imageOptions = me.getImageOptions(),
            args,
            navlayer,
            newImageLayer;

        me.setReady(false);

        options = options || {};

        me.image = image;

        args = Ext.Object.merge(imageOptions, options);

        if (!imageLayer) {
            imageLayer = libL.tileLayer.iip(image, args).addTo(map);

            me.setImageLayer(imageLayer);

        } else {
            me.removeImageLayer();

            newImageLayer = libL.tileLayer.iip(image, args).addTo(map);

            me.setImageLayer(newImageLayer);
        }

        // Mini Map
        if (me.getEnableMiniMap()) {
            if (!miniMap) {
                // se nao existir minimap cria
                me.createMiniMap();

            } else {
                navlayer = libL.tileLayer.iip(image, {});
                miniMap.changeLayer(navlayer);
            }
        }
    },

    createMiniMap: function () {
        var me = this,
            libL = me.libL,
            map = me.getMap(),
            navoptions = me.getMiniMapOptions(),
            image = me.getImage(),
            miniMap,
            navlayer;

        if (image) {
            navlayer = libL.tileLayer.iip(image, {});

            miniMap = libL.control.extraMap(navlayer, navoptions).addTo(map);

            me.setMiniMap(miniMap);
        }
    },

    setView: function (ra, dec, fov, dontMoveCrosshair) {
        var me = this,
            libL = me.libL,
            map = me.getMap(),
            latlng;

        ra = parseFloat(parseFloat(ra).toFixed(3));
        dec = parseFloat(parseFloat(dec).toFixed(3));

        latlng = libL.latLng(dec, ra);
        map.setView(latlng, map.options.crs.fovToZoom(map, fov, latlng));

        if (me.getShowCrosshair()) {

            if (!dontMoveCrosshair) {
                me.drawCrosshair(ra, dec);
            }

        }
    },

    onLayerAdd: function (e) {
        var me = this;
        if (e.layer.type === 'tilelayer') {
            me.setReady(true);

            me.fireEvent('changeimage', me);
        }

    },

    onDblClick: function (event) {
        var me = this;

        me.fireEvent('dblclick', event, me);
    },

    onContextMenuClick: function (event) {
        var me = this,
            map = me.getMap();

        //evita chamar showContextMenu novamente, já foi chamada no evento contextmenu do objeto
        if (!me.isObjectContextMenu){
            me.showContextMenu(event);
        }
        me.isObjectContextMenu = false;

        //console.log('onContextMenuClick(%o)', event);
    },

    removeImageLayer: function () {
        var me = this,
            map = me.getMap();
        // imageLayer = me.getImageLayer();

        if (map !== null) {
            // map.removeLayer(imageLayer);

            // remover todas as layer
            map.eachLayer(function (layer) {
                    map.removeLayer(layer);
                }
            );
        }

    },

    getRaDec: function () {
        var me = this,
            libL = me.libL,
            map = me.getMap(),
            wcs = map.options.crs,
            latlng = map.getCenter();

        return {
            'ra': parseFloat(latlng.lng),
            'dec': parseFloat(latlng.lat)
        };

    },

    getFov: function () {
        var me = this,
            map = me.getMap(),
            wcs = map.options.crs,
            latlng = map.getCenter(),
            fov;

        fov = wcs.zoomToFov(map, map.getZoom(), latlng);

        return fov;
    },

    onMove: function () {
        var me = this,
            radec = me.getRaDec(),
            fov = me.getFov();

        me.fireEvent('changeposition', radec, fov, me);
    },

    getLinkToPosition: function () {
        var me = this,
            map = me.getMap(),
            coordinate = me.getRaDec(),
            fov = me.getFov(),
            coord;

        if (coordinate.dec > 0) {
            coord = coordinate.ra.toFixed(3).replace('.', ',') + '+' + coordinate.dec.toFixed(3).replace('.', ',');
        } else {
            coord = coordinate.ra.toFixed(3).replace('.', ',') + coordinate.dec.toFixed(3).replace('.', ',');
        }

        if (fov) {
            fov = fov.toFixed(2).replace('.', ',');
        }

        me.fireEvent('link', encodeURIComponent(coord), fov, coordinate, me);
    },

    onShift: function () {
        this.fireEvent('shift', this.getRaDec(), this);
    },

    isReady: function () {
        return this.getReady();
    },


    /**
     * Essa funcao e usada para densenhar o raio de um cluster
     * ela esta separa para que o raio possa ser manipulado
     * independente dos demais overlays
     *
     */
    drawRadius: function (ra, dec, radius, unit, options) {
        var me = this,
            l = me.libL,
            map = me.getMap(),
            wcs = map.options.crs,
            radiusOptions = me.getRadiusOptions(),
            id = ra + '_' + dec,
            path_options,
            lradius, args;

        if (me.getLradius()) {
            map.removeLayer(me.getLradius());
            me.setLradius(null);
        }

        args = Ext.Object.merge(radiusOptions, options);

        // Conversao de unidades
        if (unit === 'arcmin') {
            // Se estiver em minutos de arco dividir por 60
            radius = radius / 60;
        }
        // TODO adicionar outras unidades

        var features = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    id: id,
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: [ra, dec]
                    }
                }
            ]
        };

        lradius = l.geoJson(features, {
            coordsToLatLng: function (coords) {
                if (wcs.forceNativeCelsys) {
                    var latLng = wcs.eqToCelsys(l.latLng(coords[1], coords[0]));
                    return new l.LatLng(latLng.lat, latLng.lng, coords[2]);
                } else {
                    return new l.LatLng(coords[1], coords[0], coords[2]);
                }
            },
            pointToLayer: function (feature, latlng) {
                
                path_options = Ext.Object.merge(radiusOptions, {
                    majAxis: radius,
                    minAxis: radius,
                    posAngle: 90
                });

                // Usei ellipse por ja estar em degrees a funcao circulo
                // estava em pixels
                // usei o mesmo valor de raio para os lados da ellipse para
                // gerar um circulo por ser um circulo o angulo tanto faz.
                return l.ellipse(
                    l.latLng(dec, ra),
                    path_options);

            }
        });

        me.setLradius(lradius);

        map.addLayer(lradius);

        return lradius;
    },

    showHideRadius: function (state) {
        var me = this,
            map = me.getMap(),
            lradius = me.getLradius();

        if (lradius !== null) {
            if (state) {
                map.addLayer(lradius);

            } else {
                map.removeLayer(lradius);
            }
        }
    },

    overlayCatalog: function (id, store, options) {
        var me = this,
            l = me.libL,
            map = me.getMap(),
            wcs = map.options.crs,
            catalogOptions = me.getCatalogOptions(),
            pathOptions, collection, feature, lCatalog;

        pathOptions = Ext.Object.merge(catalogOptions, options);

        collection = {
            type: 'FeatureCollection',
            features: []
        };

        store.each(function (record) {

            feature = {
                type: 'Feature',
                id: record.get('_meta_id'),
                properties: record.data,
                geometry: {
                    type: 'Point',
                    coordinates: [record.get('_meta_ra'), record.get('_meta_dec')]
                }
            };

            collection.features.push(feature);

        }, me);

        lCatalog = l.geoJson(collection, {
            coordsToLatLng: function (coords) {
                if (wcs.forceNativeCelsys) {
                    var latLng = wcs.eqToCelsys(l.latLng(coords[1], coords[0]));
                    return new l.LatLng(latLng.lat, latLng.lng, coords[2]);
                } else {
                    return new l.LatLng(coords[1], coords[0], coords[2]);
                }
            },

            //Desenha os objetos (círculos pequenos)
            //TODO: FABIO, v como adicionar algo que informe que neste círculo contém comentário
            pointToLayer: function (feature, latlng) {
                path_options = Ext.Object.merge(pathOptions, {
                    majAxis: pathOptions.radius,
                    minAxis: pathOptions.radius,
                    posAngle: 90,
                    color: feature.properties._meta_comments ? '#FF9800' : '#4AAB46'
                });

                // Usei ellipse por ja estar em degrees a funcao circulo
                // estava em pixels
                // usei o mesmo valor de raio para os lados da ellipse para
                // gerar um circulo por ser um circulo o angulo tanto faz.
                return l.ellipse(
                    latlng,
                    path_options);

            }
        }).bindPopup(function (layer) {
            var feature = layer.feature,
                popup = '<TABLE style="margin:auto;">' +
                   '<TBODY style="vertical-align:top;text-align:left;">' +
                        '<TR><TD><spam style="font-weight: bold;">ID </spam>: </TD><TD>' + feature.properties._meta_id + '</td></tr>' +
                        // '<TR><TD><spam style="font-weight: bold;">RA </spam>: </TD><TD>' + feature.properties._meta_ra.toFixed(3)  + '</td></tr>' +
                        // '<TR><TD><spam style="font-weight: bold;">DEC</spam>: </TD><TD>' + feature.properties._meta_dec.toFixed(3) + '</td></tr>' +
                        '<TR><TD><spam style="font-weight: bold;">J2000</spam>: </TD><TD>' +
                            feature.properties._meta_ra.toFixed(3) + ', ' + feature.properties._meta_dec.toFixed(3) +
                        '</td></tr>' +
                    '</TBODY></TABLE>';

            return popup;

        }).on('dblclick', function () {
            alert('TODO: OPEN IN EXPLORER!');
        })
        /**
         * @description Chama a função de exibição do menu de contexto
         */
        .on('contextmenu', function(event){
            me.isObjectContextMenu = true; //diz para cancelar o evento em onContextMenuClick
            me.showContextMenu(event);
        });

        map.addLayer(lCatalog);

        return lCatalog;
    },

    showHideLayer: function (layer, state) {
        var me = this,
            map = me.getMap();

        if (layer !== null) {
            if (state) {
                map.addLayer(layer);

            } else {
                map.removeLayer(layer);
            }
        }
    },

    showHideComments: function (layer, state) {
        var me = this, l, q,
            map = me.getMap();

        if (layer !== null) {
            for (i in layer._layers){
                l = layer._layers[i];
                q = l.feature.properties._meta_comments;
                if (q>0){
                    l._path.setAttribute('stroke', state ? '#FF9800' : '#4AAB46');
                }
            }
        }
    },

    updateComment: function (layer, comment, total) {
        var me = this, l, id,
            layers = layer._layers;

        for (i in layers){
            l  = layers[i];
            id = l.feature.id;

            if (id==comment.data.object_id){
                l.feature.properties._meta_comments = total;
                l._path.setAttribute('stroke', total ? '#FF9800' : '#4AAB46');
            }
            
        }
    
    },

    markPosition: function (ra, dec, iconCls) {
        var me = this,
            l = me.libL,
            map = me.getMap(),
            latlng, lmarkPosition, myIcon;

        latlng = l.latLng(dec, ra);

        if (iconCls) {
            myIcon = l.divIcon({
                className: 'visiomatic-marker-position',
                iconAnchor: [8, 44],
                html:'<i class="' + iconCls + '"></i>'
            });

            lmarkPosition = l.marker(latlng, {icon: myIcon});

        } else {

            lmarkPosition = l.marker(latlng);
        }

        lmarkPosition.addTo(map);

        return lmarkPosition;

    },

    setShowCrosshair: function (state) {
        var me = this,
            map = me.getMap(),
            lcrosshair = me.lcrosshair;

        me.showCrosshair = state;

        if (lcrosshair !== null) {
            if (state) {
                map.addLayer(lcrosshair);

            } else {
                map.removeLayer(lcrosshair);

            }
        }

    },

    /**
     * Desenha uma crosshair marcando a coordenada passada por parametro
     * @param {Model/Array[ra,dec]} object - uma instancia de model com
     * atributos ra e dec ou um array com [ra, dec]
     * @return {I.GroupLayer} Return crosshair a groupLayer
     */
    drawCrosshair: function (ra, dec, options) {
        // console.log("Zoomify - drawCrosshair()");
        var me = this,
            l = me.libL,
            map = me.getMap(),
            crosshairOptions = me.getCrosshairOptions(),
            layer = null,
            labelOptions, centerPadding, size, latlng,
            lineTop, lineBotton, lineLeft, lineRight;

        labelOptions = Ext.Object.merge({}, crosshairOptions);
        if (options) {
            labelOptions = Ext.Object.merge(labelOptions, options);
        }

        // Verificar se ja tem crosshair
        if (me.lcrosshair) {
            if (map.hasLayer(me.lcrosshair)) {
                // se ja houver remove do map
                map.removeLayer(me.lcrosshair);
                me.lcrosshair = null;
            }
        }

        // coordenadas
        latlng = l.latLng(dec, ra);

        // centerPadding e a distancia que as linhas vao ter a partir do centro.
        centerPadding = ((labelOptions.centerPadding) ?
                labelOptions.centerPadding : 0.005);

        size = ((labelOptions.size) ?
                labelOptions.size : 0.05);

        lineTop       = [l.latLng((dec + centerPadding), ra), l.latLng((dec + size), ra)];
        lineBotton    = [l.latLng((dec - centerPadding), ra), l.latLng((dec - size), ra)];
        lineLeft      = [l.latLng(dec, (ra + centerPadding)), l.latLng(dec, (ra + size))];
        lineRight     = [l.latLng(dec, (ra - centerPadding)), l.latLng(dec, (ra - size))];

        lineTop     = l.polyline(lineTop, options);
        lineBotton  = l.polyline(lineBotton, options);
        lineLeft    = l.polyline(lineLeft, options);
        lineRight   = l.polyline(lineRight, options);

        layer = new l.LayerGroup(
                [lineTop, lineBotton, lineLeft, lineRight]);

        me.lcrosshair = layer;

        if (me.getShowCrosshair()) {
            map.addLayer(me.lcrosshair);

        }

        return me.lcrosshair;
    },

    /**
     * @description Exibe um menu de contexto
     */
    showContextMenu: function(event){
        var feature, objectMenuItem,
            me = this,
            xy = {x:event.originalEvent.clientX, y:event.originalEvent.clientY};

        if (!this.contextMenu){
            this.contextMenu = new Ext.menu.Menu({
                items: [
                    {
                        id: 'comment-position',
                        text: 'Comment Position',
                        handler: function(item) {
                            me.fireEvent('contextItemClick', event);
                        }
                    },
                    {
                        id: 'comment-object',
                        text: 'Comment Object',
                        handler: function(item) {
                            me.fireEvent('contextItemClick', event, this.feature);
                        }
                    }]
            });
        }

        //feature existirá quando o click for sobre um objeto
        //o item Comment Object será desabilitado quando o click não for sobre um objeto
        //feature = event.layer ? event.layer.feature :  null;
        objectMenuItem = me.contextMenu.items.get("comment-object");
        objectMenuItem.setDisabled(!me.isObjectContextMenu);
        objectMenuItem.feature = event.layer ? event.layer.feature :  null;
        
        this.contextMenu.showAt(xy);
    }

});
