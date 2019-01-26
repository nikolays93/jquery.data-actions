/*!
 * Script name: data-actions
 * Script URI: https://github.com/nikolays93/jquery.data-actions/
 * Author: NikolayS93
 * Author URI: //vk.com/nikolays_93
 * Description: jQuery actions.
 * Version: 1.8b
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

jQuery(document).ready(function($) {
    //
    // Core функции data-действий
    //
    function doAction($obj, target, action) {
        if( target === 'this' ) {
            var evalTarget = '$(this)';
        } else {
            var evalTarget = "$('"+target+"')";

            var exp = {
                "> " : "$obj.children('",
                "< " : "$obj.parent('",
                ">> " : "$obj.find('",
                "<< " : "$obj.closest('",
                "<> " : "$obj.parent().children('",
                "<<>> " : "$obj.parent().find('"
            };

            $.each(exp, function(index, value) {
                var regExp = new RegExp('^('+index+')');
                if ( target.match(regExp) )
                    evalTarget = value + target.replace(regExp, '') + "')";
            }); 
        }

        var props = ($obj.data('props')) ? $obj.data('props') : '';
        eval( evalTarget + '.' + action + '(' + props + ');' );
    }

    function setAction($obj, target, trigger, action ) {
        $obj.on(trigger, function(event) {
            if( $(this).data('wrapper') && event.target !== this )
                return;

            if( ! $(this).data('allow-click') && trigger == 'click' )
                event.preventDefault();

            if( ! action ) action = $obj.data('action');
            doAction( $obj, target, action);
        });
    }

    // [data-action="toggle"]
    // [data-target="#selector"] указывает на объект над которым нужно производить действия
    // если не указан - ищет target у родителя. Если цель не будет найдена сработает на самом объекте
    $('[data-action]').each(function(index, el) {
        var $self = $(this);
        var target = $self.data('target') ? $self.data('target') : $self.closest('[data-target]').data('target');
        if( ! target ) target = 'this';

        var trigger = $self.data('trigger');
        if( ! trigger ) trigger = 'click';

        if( 'load' == trigger ) {
            doAction( $self, target, $self.data('action') );
            return;
        }

        setAction( $self, target, trigger );
    });

    //
    // Простые действия (target пишется в аттрибут действия)[data-fade-In="#target"]
    // если data-toggle !== 'false' повторный клик совершит обратное действие
    //
    var easyActions = ['hide', 'show', 'fade-out', 'fade-in', 'slide-up', 'slide-down', 'fade-toggle', 'slide-toggle'];
    easyActions.forEach(function(item, i, arr) {
        $('[data-' + item + ']').each(function(index, el) {
            var $self = $(this);
            var trigger = $self.data('trigger');
            var type = $self.attr('type');

            var spAct = item.split('-');
            action = (item.indexOf('-') > -1) ? spAct[0] + spAct[1].charAt(0).toUpperCase() + spAct[1].substr(1).toLowerCase() : item;

            if( !trigger ) trigger = ( 'checkbox' == type || 'radio' == type ) ? 'change' : 'click';

            setAction( $self, $self.data(item), trigger, action );
        });
    });

    //
    // [data-text-replace="Текст"] Полностью изменить текст объекта на указанный в атрибуте
    // [data-text-replace-to="Тест"] Найти и изменить текст [data-text-replace] на новый
    // При повторном действии обращает текст обратно.
    //
    function replaceTextOnly($obj, from, to) {
        var node = $obj.get(0);
        var childs = node.childNodes;

        for(var inc = 0; inc < childs.length; inc++) {
            if(3 == childs[inc].nodeType) {
                if(childs[inc].textContent) {
                    childs[inc].textContent = childs[inc].textContent.replace(from, to);
                }
                else {
                    childs[inc].nodeValue = childs[inc].nodeValue.replace(from, to);
                }
            }
        }
    }

    function textRepalce( $obj ) {
        var $self = $obj,
            textReplace = $obj.data('text-replace'),
            textReplaceTo = $obj.data('text-replace-to'),
            target  = $obj.data('target');

        if( target ) $target = $( target );
        if( !$target.length ) return;

        // text selection
        if( textReplace && textReplaceTo ) {
            if( !$target.data('text-replaced') ) {
                replaceTextOnly($target, textReplace, textReplaceTo);
                $target.data('text-replaced', '1');
            }
            else {
                replaceTextOnly($target, textReplaceTo, textReplace);
                $target.removeAttr('data-text-replaced');
            }
        }
        else {
            var text = $target.text();

            $self.data('text-replace', text);
            $target.text( textReplace );
        }
    }

    $('[data-text-replace]').each(function(index, el) {
        var trigger = $(this).data('trigger');
        if( !trigger ) trigger = 'click';

        if( trigger == 'load' ) {
            textRepalce( $(this) );
        }
        else {
            $(this).on(trigger, function() {
                textRepalce( $(this) );
            });
        }
    });
});
