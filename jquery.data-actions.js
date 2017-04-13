/*!
 * Script name: data-actions
 * Script URI: https://github.com/nikolays93/jquery.data-actions/
 * Author: NikolayS93
 * Author URI: //vk.com/nikolays_93
 * Description: Common jQuery actions.
 * Version: 1.0b
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

jQuery(function($){
  function replaceTextOnly($obj, from, to){
    var node = $obj.get(0);
    var childs = node.childNodes;
    for(var inc = 0; inc < childs.length; inc++) {
      if(childs[inc].nodeType == 3){ 
        if(childs[inc].textContent) {
          childs[inc].textContent = childs[inc].textContent.replace(from, to);
        } 
        else {
         childs[inc].nodeValue = childs[inc].nodeValue.replace(from, to);
        }
      }
    }
  }

  function doAction($obj, target, trigger){
    var evalTarget = ( target !== 'this' ) ? "'"+target+"'" : 'this';
    var loadAction = $obj.data('load-action');
    var props = $obj.data('props');

    if( loadAction )
      eval( '$( ' + evalTarget + ' ).' + loadAction + '(' + props + ');' );

    $obj.on(trigger, function(event) {

      var toggleClass = $(this).attr('data-toggle-class');
      if( toggleClass )
        $(target).toggleClass(toggleClass);
      
      var wrap = $(this).data('wrapper');
      if( wrap && event.target !== this )
        return;

      var allowClick  = $(this).data('allow-click');
      if( ! allowClick && trigger == 'click' )
        event.preventDefault();

      var props = $obj.data('props');
      var action  = $(this).data('action');
      if( action )
        eval( '$( ' + evalTarget + ' ).' + action + '(' + props + ');' );
    });
  }

  $('[data-target]').each(function(index, el) {
    $this = $(el);
    var action  = $this.data('action');
    var target  = $this.data('target');
    var trigger = $this.data('trigger');
    if( ! trigger ) trigger = 'click';
    
    doAction( $(this), target, trigger );
    $(this).children('[data-action]').each(function(){
      doAction( $(this), target, trigger );
    });

  });
  function textRepalce( $obj ){
    $wasObj = $obj;
    var textReplace = $obj.attr('data-text-replace');
    var textReplaceTo = $obj.attr('data-text-replace-to');
    var target  = $obj.data('target');

    if( target )
      $obj = $( target )

    if( textReplace && textReplaceTo ){
      if( ! $obj.attr('data-text-replaced') ){
        replaceTextOnly($obj, textReplace, textReplaceTo);
        $obj.attr('data-text-replaced', 'true');
      }
      else {
        replaceTextOnly($obj, textReplaceTo, textReplace);
        $obj.removeAttr('data-text-replaced');
      }
    }
    else {
      var text = $obj.text();
      $wasObj.attr('data-text-replace', text);
      $obj.text( textReplace );
    }
  }
  
  $('[data-text-replace]').each(function(index, el) {
    var trigger = $(this).data('trigger');
    if( ! trigger ) trigger = 'click';
    
    if( trigger == 'load' ){
      textRepalce( $(this) );
    }
    else {
      $(this).on(trigger, function(){
        textRepalce( $(this) );
      });
    }
  });
  
});