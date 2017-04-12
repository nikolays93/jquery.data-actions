/*!
 * Script name: data-actions
 * Script URI: https://github.com/nikolays93/jquery.data-actions/
 * Author: NikolayS93
 * Author URI: //vk.com/nikolays_93
 * Description: Common jQuery actions.
 * Version: 0.5a
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
    $obj.on(trigger, function(event) {

      // var allowChilds = $this.data('childs');
      var allowClick  = $(this).data('allow-click');
      var action  = $(this).data('action');
      console.log( target );

      var evalTarget = ( target !== 'this' ) ? "'"+target+"'" : 'this';
      // console.log(evalTarget);

      // if( ! allowChilds && event.target !== this )
      //   return;
      if( ! allowClick && trigger == 'click' )
        event.preventDefault();

      if( action )
        eval( '$( ' + evalTarget + ' ).' + action + '();' );

      // console.log( event );
    });
  }
  $('[data-target]').each(function(index, el) {
    $this = $(el);
    var action  = $this.data('action');
    var target  = $this.data('target');
    var trigger = $this.data('trigger');
    if( ! trigger ) trigger = 'click';
    
    if( action ){

      doAction( $(this), target, trigger );

    }
    else {

      $(this).children('[data-action]').each(function(){
        doAction( $(this), target, trigger );
      });

    }
   

    // $(this).on(trigger, function(event) {

    //   var toggleClass = $(this).attr('data-toggle-class');
    //   if( toggleClass )
    //     $target.toggleClass(toggleClass);
      
    //   var textReplace = $(this).attr('data-text-replace');
    //   var textReplaceTo = $(this).attr('data-text-replace-to');
      
    //   if( textReplace && textReplaceTo ){
    //     if( ! $(this).attr('data-text-replaced') ){
    //       replaceTextOnly($(this), textReplace, textReplaceTo);
    //       $(this).attr('data-text-replaced', 'true');
    //     }
    //     else {
    //       replaceTextOnly($(this), textReplaceTo, textReplace);
    //       $(this).removeAttr('data-text-replaced');
    //     }
    //   }

    //   else if( textReplace ){
    //     var text = $(this).text();
    //     $(this).attr('data-text-replace', text);
    //     $(this).text( textReplace );
    //   }

    // });
  });
});