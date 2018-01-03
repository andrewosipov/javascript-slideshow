/*
    version 2.0
    author Andrew Osipov
    http://simplephotoweb.ru
*/


(function($){
  $.fn.slideshow = function($){
    var jqContainer=this;
    var obj={};
    var items=[];
    var options={};
    jQuery.extend( options,{
      height:422,
      width:800,
      diffPlayer:10,        //уменьшение плеера
      autosize:true,
      hideName:!true,
      loader:'/images/ajax-loader.gif',
      interval:7000,
      //---------------
      thumbHeight:56,
      thumbWidth:0,
      thumbOpacity:0.4,  
      thumbsShift:4,                          
      thumbsPosition:'relative', // absolute relative 
      thumbsType:'vertical',     // horizontal
      scrollType:'arrows',      // jscroll rows 
      scrollButtonsVisible:false,
      videoButtonsVisible:true,
      //---------------
      easing: 'easeOutCubic',
      thumbSpeed: 700,      
      //---------------
      itemClassName:'.slide-item',
      itemName:'.slide-name',
      itemDescr:'.slide-descr',
      itemThumb:'.thumb',
      itemImage:'img',
      //---------------
      slideContainer:'slide-container',
      slideContent:'slide-content',
      slideName:'slide-name',
	  slideLeft:'slide-left',
	  slideRight:'slide-right',
      thumbsItemClassName:'thumb',
      thumbsItemImg:'img',
      thumbsContainer:'slide-thumbs-container',
      thumbsScroll:'slide-thumbs-scroll',
      thumbsArrows:'slide-thumbs-arrows',      
      thumbsDownArrow:'slide-thumbs-down',
      thumbsUpArrow:'slide-thumbs-up',
      thumbsLeftArrow:'slide-thumbs-left',
      thumbsRightArrow:'slide-thumbs-right',
      thumbsActiveClassName:'thumb-active',
      slideCounter:'slide-counter'
    }, $);
    
    if(-[1,]){
      var back=new Image()
      back.src=options.loader
      back.onload =function(){ start() }
      back.onerror=function(){ start() }
    }else{ start(); } 
    
    function start(){
      if( setOptions() ){
        jqContainer.find( options.itemClassName ).each(function(i,e){ addToArray(i,e); });
        construct();
       // for( var i=0; i<items.length; i++ ){ addThumb(i); }
        prepareFull();  
        prepareNavigation()    
        showImage();
        startCarusel();
        //if( options.thumbsPosition=='absolute' ){ closing(); }
      }
    }
    
    function closing(){
      setTimeout(function(){
        obj.thumbsContainer.animate({ right:-120 },{ duration:900, complete:function(){
          obj.thumbsContainerBlock.hover(
            function(){ obj.thumbsContainer.stop().animate({ right:0 },{ duration:900 }) },
            function(){ obj.thumbsContainer.stop().animate({ right:-120 },{ duration:900 }) }
          )
        } });
      },3500);                     
    }
    
    function startCarusel(){
      obj.timer=setInterval(function(){ showNext('next') },options.interval)
    }
    
    function showNext(direct){
      var id=0;
      if( direct=='next' || direct==null ){ id=getCurrent('next'); }
      if( direct=='prev' || direct==null ){ id=getCurrent('prev'); } 
      showImage(id);   
    }
    
    function addToArray(id,element){
      items[id]={};
      items[id].name=jQuery(element).find( options.itemName ).text();
      items[id].descr=jQuery(element).find( options.itemDescr ).html();
      items[id].thumb=new Image();
      items[id].thumb.src=jQuery(element).find( options.itemThumb).attr('src');      
      items[id].image=new Image();
      items[id].image.src=jQuery(element).find( options.itemImage ).attr('src');
	  items[id].imageWidth=jQuery(element).find( options.itemImage ).attr('width');
	  items[id].imageHeight=jQuery(element).find( options.itemImage ).attr('height');
      items[id].thumbLoaded=false;
      jQuery(element).remove();
    }

    function addThumb(id){        
      var div=document.createElement('a');
      jQuery(div)
        .attr({ 'href':'#'+id, rel:id })
        .css({ background:'url('+options.loader+') 50% 50% no-repeat'})
        .addClass( options.thumbsItemClassName )
        .click(function(){ showImage(id); return false; })
		    .hover(
          function(){ if( !jQuery(this).hasClass( options.thumbsActiveClassName ) ){ jQuery(this).stop().animate({ opacity:1 }); } },
          function(){ if( !jQuery(this).hasClass( options.thumbsActiveClassName ) ){ jQuery(this).stop().animate({ opacity:options.thumbOpacity }); } }
        ) 
        .append( items[id].thumb ); 
      prepareThumbEmpty(id);
      jQuery(items[id].thumb)
        .load(function(){ jQuery(div).stop().css({ opacity:options.thumbOpacity }); items[id].thumbLoaded=true; prepareThumb(id); })
        .error(function(){ items[id].thumbLoaded=false; prepareThumbEmpty(id); })            
      if( items[id].thumb.src=='' ){ items[id].thumbLoaded=false; }      
      obj.thumbsScroll.append( div );      
    }
    
    function getCurrent(index){
      var current=obj.current;
      if( typeof index=='undefined' || index==null ){ current=0; } 
      if( index=='prev' ){ index=current-1; }
      if( index=='next' ){ index=current+1; } 
      if( typeof index =='number' ){ 
		current=index;
		if( index>=0&&index<=items.length-1 ){ current=index; }
		if( index>items.length-1 ){ current=0; }
		if( index<0 ){ current=items.length-1; }
	  }
     // if( hash<0 ){ index=0; } 
      //location.hash=index;
      return current;
    }
    
    function showImage(id){ 
      index=getCurrent(id); 
	  if( obj.current==index && id!=null ){ return false; }
	  //obj.slideName.empty(); 
    //animateThumbs(index);
	  prepareImage(index);
      obj.slideContent.append( items[index].image );
	  items[index].ref=obj.slideContent.find('img:first');
	  jQuery( items[index].image ).animate({ opacity:1 }, options.speed  );
	  if( id!=null ){
		jQuery( items[obj.current].image ).animate({ opacity:0 }, options.speed,function(){ jQuery(this).remove(); } );
	  }
	  obj.thumbsScroll.find( '.'+options.thumbsActiveClassName )
        .animate({ opacity:options.thumbOpacity })
        .removeClass( options.thumbsActiveClassName );
      obj.thumbsScroll.find( '.'+options.thumbsItemClassName+'[rel='+index+']')
        .addClass( options.thumbsActiveClassName )
        .stop()
        .animate({ opacity:1 }) 
      obj.current=index;
      obj.displayCount=obj.current+1;
      obj.slideCounter.text( obj.displayCount+'/'+items.length );
    }
    
    function prepareFrame(iframe){
      var width=parseInt( jQuery(iframe).attr('width') ), height=parseInt( jQuery(iframe).attr('height') );
      var new_width, new_height;
      new_width=obj.player.width();
      new_height=height*new_width/width;
      obj.player.css({ background:'url('+options.loader+') 50% 50% no-repeat'});
      jQuery(iframe)
        .attr({ width:new_width, height:new_height-40, wmode:'opaque' })
        .css({ opacity:0 })
        .load(function(){ obj.showComplete=true; obj.player.css({ background:'none'}); jQuery(this).css({ opacity:1 }); });
    }
	
	function prepareImage(index){       
      var img=items[index].image;
	  var height=items[index].imageHeight, width=items[index].imageWidth
      var new_width=width, new_height=height, diff_width=width-jQuery(img).width(), diff_height=height-jQuery(img).height();
      var cWidth=obj.slideContent.width(), cHeight=obj.slideContent.height();
	  if( width>cWidth ){
        new_width=cWidth;
        new_height=height*new_width/width;
        if( new_height>cHeight){              
          new_width=new_width*cHeight/new_height;
          new_height=cHeight;
        }                 
      }else if( height>cHeight ){
        new_height=cHeight;
        new_width=width*new_height/height;
        if( new_width>cWidth){              
          new_height=new_height*cWidth/new_width;
          new_width=cWidth;
        }                 
      } 
	  jQuery(img).css({ opacity:0, position:'absolute', height:new_height, width:new_width, left:(cWidth-new_width)/2, top:(cHeight-new_height)/2 });
    }
    
    function animateThumbs(id){
     if( obj.thumbsAnimateOn ){       
      if( id <= options.thumbsShift ){
          obj.thumbsMargin=0;
      }else{
        if( obj.containerHeight-items[id-options.thumbsShift].containerHeight >= obj.thumbsScroll.height() ){ 
          obj.thumbsMargin=-1*items[id-options.thumbsShift].containerHeight; 
        }else{ 
          obj.thumbsMargin=-1*( obj.containerHeight-obj.thumbsScroll.height() ); 
        }
      }
     }     //alert( obj.thumbsMargin )
      obj.thumbsScroll.stop().animate({ scrollTop: -1*obj.thumbsMargin }, { duration:options.thumbSpeed, easing:options.easing });
    }
    
    function scrollThumbs(direct,shift){
      //if( !obj.showComplete ) return false;
      //obj.showComplete=false; 
      if( shift==null ){ shift=20*3; }
      if( direct=='up' ){
        if( obj.thumbsMargin < -1*options.thumbHeight*3 ){ obj.thumbsMargin+=/*options.thumbHeight*/shift; }
        if( obj.thumbsMargin >= -1*options.thumbHeight*3 && obj.thumbsMargin<0 ){ obj.thumbsMargin=0; }       
      }
      if( direct=='down' ){
        var height=obj.thumbsScroll.height();
        if( obj.thumbsMargin > -1*(height-options.thumbHeight*3) ){ obj.thumbsMargin-=/*options.thumbHeight*/shift; }
        if( obj.thumbsMargin <= -1*(height-options.thumbHeight*3) && obj.thumbsMargin>=-1*height ){ obj.thumbsMargin=-1*height; }       
      }
      obj.thumbsScroll.stop().animate({ scrollTop: -1*obj.thumbsMargin }, { duration:options.thumbSpeed, easing:options.easing, complete:function(){ /*obj.showComplete=true;*/ } });
    }
    
    
    function prepareFull(){
      obj.slideContainer.css({ width:options.width, height:options.height });
      obj.thumbsContainer.css({ position: 'absolute' });
      if( options.thumbsType=='vertical' ){ 
        obj.thumbsContainerHeight=0; obj.thumbsContainerWidth=0;  
        obj.thumbsContainer.css({ width:options.thumbWidth});    
        obj.thumbsScroll.css({ height: options.height-obj.thumbsArrows.height()-obj.thumbsDown.height()-obj.thumbsUp.height() });
      }
      obj.thumbsScroll.css({ overflow:'hidden' });
      if( options.scrollType=='jscroll' ){
        obj.jscroll=obj.thumbsContainer.jScrollPane({autoReinitialise:true});
        obj.jscrollAPI=obj.jscroll.data('jsp');
        obj.thumbsScrollUp.hide();
        obj.thumbsScrollDown.hide();                                          
        obj.thumbsScrollArrows.hide();
      }      
      if( options.scrollType=='arrows' ){     
            
      } 
      
	    obj.slideLeft.click(function(){ arrowLeft(); })
	    obj.slideRight.click(function(){ arrowRight(); })
    }
    
    function prepareNavigation(){
      //obj.thumbsUp.css({ height:20 });
      //obj.thumbsScrollDown.hide();                                          
      //obj.thumbsScrollArrows.hide();
    }
    
    function prepareThumbsContainer(){
      var height=0;
      if( items.length>0 ){ items[0].containerWidth=0; items[0].containerHeight=0; }
      obj.containerWidth=0; obj.containerHeight=0;
      for(var i=0;i<items.length;i++){ 
        height+=items[i].thumbHeight;
        if( i>0){
          items[i].containerWidth=items[i-1].containerWidth+items[i-1].thumbWidth;
          items[i].containerHeight=items[i-1].containerHeight+items[i-1].thumbHeight-1;          
        }
      }                      
      if( height>=obj.thumbsScroll.height() ){
        obj.thumbsUp.css({ visibility:'visible' });
        obj.thumbsDown.css({ visibility:'visible' });
      }else{         
        obj.thumbsUp.css({ visibility:'hidden' });
        obj.thumbsDown.css({ visibility:'hidden' });
        obj.thumbsAnimateOn=false;
      }
      //obj.containerWidth=width
      obj.containerHeight=height;
      obj.thumbsScroll.css({ height:height });
    }
    
    function prepareThumbEmpty(id){
      jQuery( items[id].thumb )
        .hide()
        .parent()
        .css({ width:options.thumbWidth, height:options.thumbHeight });
      items[id].thumbWidth=options.thumbWidth;
      items[id].thumbHeight=options.thumbHeight;
    }
    
    function prepareThumb(id){
      jQuery(items[id].thumb).show();
      var offWidth=items[id].thumb.offsetWidth, offHeight=items[id].thumb.offsetHeight;
      var width=jQuery(items[id].thumb).width(), height=jQuery(items[id].thumb).height();
      var difH=offHeight-height, difW=offWidth-width;
      var new_width=offWidth, new_height=offHeight;      
      if( new_width > options.thumbWidth && options.thumbsType=='vertical' ){        
        if( options.scrollType=='jscroll' ){ new_height=new_height*(options.thumbWidth-difW-13)/new_width; new_width=options.thumbWidth-difW-13; }
        else{ new_height=new_height*(options.thumbWidth-difW)/new_width; new_width=options.thumbWidth-difW; }
        items[id].thumbWidth=Math.round(new_width)+difW; items[id].thumbHeight=Math.round(new_height)+difH;
      }else{ items[id].thumbWidth=new_width+difW; items[id].thumbHeight=new_height; }
      
      jQuery( items[id].thumb )
        .css({ width:new_width, height:new_height })        
        .parent()
        .css({ width:new_width, height:new_height+difH, background:'none' });  
       if(id==0){ items[id].containerHeight=new_height; }
       else{ items[id].containerHeight=items[id-1].containerHeight+new_height; }  
       obj.containerHeight+=new_height+2;  
    }
    
    function arrowUp(shift){
      scrollThumbs('up',shift);
    }
    
    function arrowDown(shift){
      scrollThumbs('down',shift);
    }
    
    function arrowLeft(){
      showImage('prev');
    }
    
    function arrowRight(){
      showImage('next');
    }
    
    function construct(){
      jqContainer.empty();
      obj.thumbsMargin=0;
      obj.thumbsAnimateComplete=true;
      obj.thumbsAnimateOn=true;
      obj.showComplete=true;
      obj.current=0;
      obj.currentScroll=0;
      obj.displayCount=obj.current+1;
      obj.videoCount=0;  
      obj.containerWidth=0; 
      obj.containerHeight=0;    
      
      // slide container
      var div=document.createElement('div');
        jQuery(div).attr('class', options.slideContainer );
        jqContainer.append( div ); 
        obj.slideContainer=jqContainer.find( '.'+options.slideContainer );        
        div=null;   
      // slide content
      var div=document.createElement('div');
        jQuery(div).attr('class', options.slideContent );
        obj.slideContainer.append( div ); 
        obj.slideContent=jqContainer.find( '.'+options.slideContent );        
        div=null;
	  // slide left
	  div=document.createElement('div');
        jQuery(div).attr('class', options.slideLeft );
        obj.slideContainer.append( div ); 
        obj.slideLeft=jqContainer.find( '.'+options.slideLeft );        
        div=null;	
	   // slide right
	  div=document.createElement('div');
        jQuery(div).attr('class', options.slideRight );
        obj.slideContainer.append( div ); 
        obj.slideRight=jqContainer.find( '.'+options.slideRight );        
        div=null;
      // slide name
      div=document.createElement('div');
        jQuery(div).attr('class', options.slideName );
        obj.slideContainer.append( div ); 
        obj.slideName=jqContainer.find( '.'+options.slideName ); 
        if( options.hideName ){ obj.slideName.hide(); }         
        div=null;   
      // slide thumbs block
      div=document.createElement('div');
        jQuery(div).attr('class', options.thumbsContainer );
        obj.slideContainer.after( div ); obj.thumbsContainer=jqContainer.find( '.'+options.thumbsContainer );
        div=null;
      // thumbs scroll
      div=document.createElement('div');
        jQuery(div).attr('class', options.thumbsScroll );
        obj.thumbsContainer.append( div ); obj.thumbsScroll=jqContainer.find( '.'+options.thumbsScroll );
        div=null;   
      // thumbs scroll down
      div=document.createElement('a');
        jQuery(div).addClass(options.thumbsDownArrow).attr({ href:'#' }); 
        obj.thumbsScroll.after( div ); obj.thumbsDown=jqContainer.find( '.'+options.thumbsDownArrow );
        obj.thumbsDown.text('▼').click(function(){ arrowDown(); return false; });
        div=null;
      // thumbs scroll up
      div=document.createElement('a');
        jQuery(div).attr({ 'class':options.thumbsUpArrow, href:'#' }); 
        obj.thumbsScroll.before( div ); obj.thumbsUp=jqContainer.find( '.'+options.thumbsUpArrow );
        obj.thumbsUp.text('▲').click(function(){ arrowUp(); return false; });
        div=null;
      // thumbs scroll arrows
      div=document.createElement('div');
        jQuery(div).attr({ 'class':options.thumbsArrows }); 
        obj.thumbsDown.after( div ); obj.thumbsArrows=jqContainer.find( '.'+options.thumbsArrows );
        div=null;
      // thumbs scroll left
      div=document.createElement('a');
        jQuery(div).addClass(options.thumbsLeftArrow).attr({ href:'#' }); 
        obj.thumbsArrows.append( div ); obj.thumbsLeft=obj.thumbsContainer.find( '.'+options.thumbsLeftArrow );
        obj.thumbsLeft.text('◄').click(function(){ arrowLeft(); return false; });
        div=null;
      // thumbs scroll counter
      div=document.createElement('div');
        jQuery(div).addClass( options.slideCounter ); 
        obj.thumbsArrows.append( div ); obj.slideCounter=obj.thumbsContainer.find( '.'+options.slideCounter );
        div=null;
      // thumbs scroll right
      div=document.createElement('a');
        jQuery(div).addClass(options.thumbsRightArrow).attr({ href:'#' }); 
        obj.thumbsArrows.append( div ); obj.thumbsRight=obj.thumbsContainer.find( '.'+options.thumbsRightArrow );
        obj.thumbsRight.text('►').click(function(){ arrowRight(); return false; });
        div=null;      
    }
       
    function setOptions(){
      if(options.autosize){
        options.height=jqContainer.height();
        options.width=jqContainer.width();
      }        
      return true;
    }  

  }
})(jQuery);