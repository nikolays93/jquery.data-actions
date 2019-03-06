## jQuery data-actions
```
/*!
 * Script name: data-actions
 * Script URI: https://github.com/nikolays93/jquery.data-actions/
 * Author: NikolayS93
 * Author URI: //vk.com/nikolays_93
 * Description: Common jQuery actions.
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
```

### Actions : ###
- action="toggleClass" ex. toggleClass
- target="#selector" ex. .selector > div
- trigger="event" ex. load
- props - any js props

- text-replace="Текст" Полностью изменить текст объекта на указанный в атрибуте
- text-replace-to="Текст" - Найти и изменить текст [data-text-replace] на новый
При повторном действии обращает текст обратно.

### Easy Actions: ###
- hide
- show
- toggle
- fade-in
- fade-out
- fade-toggle
- slide-in
- slide-out
- slide-toggle

toggle="false" - отключит обратное действие на переключателях

### Allows: ###
- allow-click - отключает e.preventDefault() наложеный на trigger="click"
- wrapper - клик только по элементу, не влиять на дочерние элементы

### Simple targets: ###
* \>  = ```.children()```
* <   = ```.parent()```
* \>> = ```.find()```
* <<  = ```.closest()```
* <>  = ```.parent().children()```
* <>> = ```.parent().find()```
* <<>> = ```.closest('body, section, .container').find()```
* <<#target>> = ```.closest(#target).find()```