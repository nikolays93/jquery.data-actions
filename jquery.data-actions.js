/*!
 * Script name: data-actions
 * Script URI: https://github.com/nikolays93/jquery.data-actions/
 * Author: NikolayS93
 * Author URI: //vk.com/nikolays_93
 * Description: Common jQuery actions.
 * Version: 1.3b
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

jQuery(function($){
	//
	// Core функции data-действия
	//
  function doLoadAction($obj, target, action){
    var evalTarget = ( target !== 'this' ) ? "'"+target+"'" : 'this';
    var props = $obj.data('props');
    eval( '$( ' + evalTarget + ' ).' + action + '(' + props + ');' );
  }

  function doAction($obj, target, trigger, action ){
    if(typeof action === 'undefined') action = false;
    
    var evalTarget = ( target !== 'this' ) ? "'"+target+"'" : 'this';
    var loadAction = (trigger == 'load') ? action : $obj.data('load');
    if( loadAction )
      doLoadAction($obj, target, loadAction);

    $obj.on(trigger, function(event) {
      var toggleClass = $(this).data('toggle-class');
      if( toggleClass )
        $(target).toggleClass(toggleClass);
      
      var wrap = $(this).data('wrapper');
      if( wrap && event.target !== this )
        return;

      var allowClick  = $(this).data('allow-click');
      if( ! allowClick && trigger == 'click' )
        event.preventDefault();

      if(!action)
        action = $obj.data('action');

      var props = $obj.data('props');
      if( action )
        eval( '$( ' + evalTarget + ' ).' + action + '(' + props + ');' );
    });
  }

  function setTarget(){

  }

  // [data-target="#selector"] указывает на объект над которым нужно производить действия
  $('[data-target]').each(function(index, el) {
    var trigger = $(this).data('trigger');
    if( ! trigger ) trigger = 'click';
    
    doAction( $(this), $(this).data('target'), trigger );
    $(this).children('[data-action]').each(function(){
      doAction( $(this), $(el).data('target'), trigger );
    });
  });

  //
  // Простые действия (target пишется в аттрибут действия)[data-fade-In="#target"]
  // если data-toggle !== 'false' повторный клик совершит обратное действие
  // 
  var easyActions = ['hide', 'show', 'fade-Out', 'fade-In', 'slide-Up', 'slide-Down'];
  easyActions.forEach(function(item, i, arr) {
    $('[data-' + item + ']').each(function(index, el) {
      if( $(this).data('toggle') === 'false' ){
        var action = item.replace('-', '');
      }
      else {
        var action = item.split('-');
        if(action[0] == 'hide' || action[0] == 'show')
          action = 'toggle';
        else
          action = action[0] + 'Toggle';
      }

      doAction( $(this), $(this).data(item), 'change', action );

      if($(this).attr('type') == 'checkbox'){
      	action = item.replace('-', '');

      	if( !$(this).is(':checked')){
      		if( ['show', 'fadeIn', 'slideDown'].includes(action) ){
      			action = action.replace('show', 'hide').replace('In', 'Out').replace('Down', 'Up');
      		}
      		else{
      			action = action.replace('hide', 'show').replace('Out', 'In').replace('Up', 'Down');
      		}
      	}

      	doLoadAction( $(this), $(this).data(item), action );
      }
      
    });
  });

  //
  // [data-text-replace="Текст"] Полностью изменить текст объекта на указанный в атрибуте
  // [data-text-replace-to="Тест"] Найти и изменить текст [data-text-replace] на новый
  // При повторном действии обращает текст обратно.
  //
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

  function textRepalce( $obj ){
    var textReplace = $obj.data('text-replace');
    var textReplaceTo = $obj.data('text-replace-to');
    var $tObj = $obj.data('target') !== 'this' ? $( $obj.data('target') ) : $(this);

    if( textReplace && textReplaceTo ){
      if( ! $tObj.attr('data-text-replaced') ){
        replaceTextOnly($tObj, textReplace, textReplaceTo);
        $tObj.attr('data-text-replaced', 'true');
      }
      else {
        replaceTextOnly($tObj, textReplaceTo, textReplace);
        $tObj.removeAttr('data-text-replaced');
      }
    }
    else {
      var text = $tObj.text();
      $obj.attr('data-text-replace', text);
      $tObj.text( textReplace );
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