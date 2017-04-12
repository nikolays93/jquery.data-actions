/*!
 * Script name: data-actions
 * Script URI: https://github.com/nikolays93/jquery.data-actions/
 * Author: NikolayS93
 * Author URI: //vk.com/nikolays_93
 * Description: Common jQuery actions.
 * Version: 0.4a
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

  $('[data-target]').each(function(index, el) {
    var trigger    = $(this).attr('data-trigger');
    var target     = $(this).attr('data-target');
    var action     = $(this).attr('data-action');
    var loadAction = $(this).attr('data-load-action');
    var allowClick = $(this).attr('data-allow-click');

    if( ! trigger ) trigger = 'click';
    var actionTarget = ( target !== 'this' ) ? "'"+target+"'" : 'this';

    if( loadAction )
      eval( '$( ' + actionTarget + ' ).' + action + '();' );

    $(this).on(trigger, function(event) {
      var $target = $(target);
      if( ! allowClick && trigger == 'click' )
        event.preventDefault();

      var toggleClass = $(this).attr('data-toggle-class');
      if( toggleClass )
        $target.toggleClass(toggleClass);
      
      if( action )
        eval( '$( ' + actionTarget + ' ).' + action + '();' );

      var textReplace = $(this).attr('data-text-replace');
      var textReplaceTo = $(this).attr('data-text-replace-to');
      
      if( textReplace && textReplaceTo ){
        if( ! $(this).attr('data-text-replaced') ){
          replaceTextOnly($target, textReplace, textReplaceTo);
          $target.attr('data-text-replaced', 'true');
        }
        else {
          replaceTextOnly($target, textReplaceTo, textReplace);
          $(this).removeAttr('data-text-replaced');
        }
      }

      else if( textReplace ){
        $(this).attr('data-text-replace', $target.text());
        $target.text( textReplace );
      }
    });
  });
});