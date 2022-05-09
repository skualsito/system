<style>
    .vue-window-modal {
        position: fixed;
        box-shadow: 7px 7px 50px 5px rgba(0,0,0,0.13);
        display: block;
        max-height: calc(100% - 46px);
        max-width: 100%;
        min-width: 700px;
        min-height: 500px;
        user-select: none;
    }
    .vue-window-modal .vue-window-modal-header {
        background-color: #0a5d88;;
        padding: 5px;
        padding-left: 8px;
        padding-right: 8px;
        color: white;
        height: 40px;
        font-size: 16px;
        cursor: -webkit-grab;
        user-select: none;
        font-weight: bold;
    }

    .vue-window-modal .vue-window-modal-header h2 {
        display: inline-block;
        position: relative;
        top: 3px;
        font-size: 16px;
        font-weight: 100;
        text-transform: uppercase;
    }
    .vue-window-modal .vue-window-modal-header h2 i {
        color: #fff;
        padding: 0 5px;
        font-size: 16px;
    }
    .vue-window-modal .vue-window-modal-header img {
        float: right;
        cursor: pointer;
        position: relative;
        top: 6px;
    }

    .resizable{
        resize:both;
        overflow:hidden;
        background: rgb(66, 66, 66)!important;
    }
    .fullScreen{
        position: absolute!important;
        left: 0!important;
        top: 0!important;
        resize:none;
    }
    .window-icon {
        color: #fff!important;
    }
    .vue-window-modal .vue-window-modal-header.ventana-move::after {
        content: " ";
        position: absolute;
        top: 40px;
        left: 0;
        width: 100%;
        height: calc(100% - 40px);
    }

</style>

<template>
        <div
            :id="windowId"
            class="vue-window-modal resizable"
            :class="[ventana.fullScreen ? 'fullScreen' : '']"
            :style="[ventana.fullScreen ? {'width':'100%', 'height':'calc(100% - 46px)', backgroundColor} : {'width':width, 'height':height, backgroundColor}]">
            <div :id="windowId + '-' + 'header'" class="vue-window-modal-header">
                <h2><v-icon>{{ventana.icono}}</v-icon> {{ventana.nombre}}</h2>

                <div style="float:right;">

                    <v-icon class="window-icon" @click="$emit(`minimizarVentana`,ventana)">mdi-minus</v-icon>

                    <v-icon class="window-icon" @click="ventana.fullScreen=!ventana.fullScreen; dragElement()">{{ventana.fullScreen? 'mdi-dock-window':'mdi-window-maximize'}}</v-icon>

                    <v-icon class="window-icon" v-on:click="$emit(`cerrarVentana`, ventana.windowId)">mdi-close</v-icon>

                </div>
               
            </div>
            
            <slot name="default"></slot>
            
            
        </div>
 

</template>

<script>


    export default {
        data() {
            return {
                
                isOpen: true
            }
        },
        props: {
            windowId: String,
            active: Boolean,
            title: String,
            backgroundColor: {
                type: String,
                default: '#f2f2f2'
            },
            width:{
                type: String,
                default: "600px"
            },
            height:{
                type: String,
                default: "600px"
            },
            ventana:{
                type:Object,
                default:()=>{
                    return {}
                }
            },
            ventanas:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            handler:{
                type:Function,
                default:()=>{

                }
            }  
        },
        methods: {
            getThisWindowAndHeaderElements() {
                return {
                    window: window.document.getElementById(this.windowId),
                    windowHeader: window.document.getElementById(this.windowId + '-' + 'header')
                }
            },
            dragElement(elmnt) {

                if(this.ventana.fullScreen) return;

                var context = elmnt
                 context = this

                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                const _window = this.getThisWindowAndHeaderElements().window
                const _windowHeader = this.getThisWindowAndHeaderElements().windowHeader
                _windowHeader.onmousedown = dragMouseDown

                function dragMouseDown(e) {
                    if(context.$props.ventana.fullScreen) return;


                    context.$emit('focusChange', context.windowId)

                    e = e || window.event;
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
                    document.onmousemove = elementDrag;
                    _windowHeader.style.cursor = '-webkit-grabbing'
                    _windowHeader.classList.add('ventana-move');
                }

                function elementDrag(e) {
                    if(context.$props.ventana.fullScreen) return;
                    context.sendWindowToHighest()
                    

                    e = e || window.event;
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:
                    if (_window.offsetTop < (window.innerHeight - 35)) {
                        _window.style.top = (_window.offsetTop - pos2) + "px";
                    } else context.centerWindow()
                    if (_window.offsetLeft < (window.innerWidth - 35)) {
                        _window.style.left = (_window.offsetLeft - pos1) + "px";
                    } else context.centerWindow()

                }
                function closeDragElement() {
                    if(context.$props.ventana.fullScreen) return;

                    /* stop moving when mouse button is released:*/
                    document.onmouseup = null;
                    document.onmousemove = null;
                    _windowHeader.style.cursor = '-webkit-grab'
                    _windowHeader.classList.remove('ventana-move');
                }
            },
            getHighestWindow() {
                const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
                const zIndexs = windows.map(el => Number(el.style.zIndex))
                const highest = Math.max.apply(Math, zIndexs)
                return highest
            },
            sendWindowToHighest() {
                if(this.getThisWindowAndHeaderElements().window!=null) {
                    this.getThisWindowAndHeaderElements().window.style.zIndex = this.getHighestWindow() + 1
                }
                   
            },
            centerWindow() {
                var myElement = this.getThisWindowAndHeaderElements().window,
                    pageWidth = window.innerWidth,
                    pageHeight = window.innerHeight,
                    myElementWidth = myElement.offsetWidth,
                    myElementHeight = myElement.offsetHeight;
                const diff = this.activeWindows() * 20
                myElement.style.top = (pageHeight / 2) - (myElementHeight / 2) + diff + "px";
                myElement.style.left = (pageWidth / 2) - (myElementWidth / 2) + diff + "px";
            },
            checkTheresIsAnyAnotherCenteredWindow() { // not being used anymore but working well...
                const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
                const centeredWindows = windows.filter(el => {
                    var myElement = el,
                        pageWidth = window.innerWidth,
                        pageHeight = window.innerHeight,
                        myElementWidth = myElement.offsetWidth,
                        myElementHeight = myElement.offsetHeight;
                    return el.style.top === (pageHeight / 2) - (myElementHeight / 2) + "px" &&
                           el.style.left === (pageWidth / 2) - (myElementWidth / 2) + "px"
                })
                return centeredWindows
            },
            activeWindows() {
                const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
                const openedWindows = windows.filter(el => {
                    return el.style.display === 'block'
                })
                return openedWindows.length
            },
            hide() {
                this.getThisWindowAndHeaderElements().window.style.display = 'none'
            },
            show() {
                this.getThisWindowAndHeaderElements().window.style.display = 'block'
            }
        },
        watch: {
            active (newValue) {
                if (newValue) {
                    this.show()
                    this.sendWindowToHighest()
                    this.centerWindow()
                } else {
                    this.hide()
                }
            },
            ventana: { 
                inmmediate: true,
                deep:true, 
                handler(newValue){
                    //alert(newValue.activa)
                    if (newValue.activa) {
                        this.show()
                        this.sendWindowToHighest()
                    }
                }
            }
           
        },
        mounted() {
            this.dragElement()

            this.getThisWindowAndHeaderElements().window.addEventListener('click', () => {
             
                    this.sendWindowToHighest()
            })

            this.$emit("focusChange",this.windowId);

            this.getThisWindowAndHeaderElements().window.style.zIndex = 9999
        }
    }
</script>