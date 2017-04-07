/*!
 * Author: NikolayS93
 * Author URI: //vk.com/nikolays_93
 * Description: Common jQuery actions.
 * Version: 0.1
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

jQuery(function($){
  // jQuery.data-actions (data-target required), for ex:
  // <p data-target="this" data-class-toggle="fixed"> <span data-target="modal" data-action="fadeToggle"> button </span> </p>
  $('body').on('click', '[data-target]', function(event) {
    var target = $(this).attr('data-target');

    var action = $(this).attr('data-action');
    if( typeof(action) && action != undefined ){
      if( target == 'this' )
        target = "'"+target+"'";
      eval( '$( ' + target + ' ).' + action + '();' );
    }
    else {
      if(target == 'this')
        var $target = $(this);
      else
        var $target = $( target );
    }

    var toggleClass = $(this).attr('data-class-toggle');
    if( typeof(toggleClass) && toggleClass != undefined ){
      $target.toggleClass(toggleClass);
    }

    var textToggle = $(this).attr('data-text-toggle');
    if( typeof(textToggle) && textToggle != undefined ){
      $(this).attr('data-text-toggle', $target.text());
      $target.text( textToggle );
    }
  });
});