
|  Building for production...

 ERROR  Failed to compile with 1 error                                                                                                                          21:52:32

[eslint] 
C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\components\AppointmentCard.vue
  29:15  error  'defineProps' is not defined  no-undef
  30:1   error  'defineEmits' is not defined  no-undef

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\components\CounselorCard.vue
  28:1  error  'defineProps' is not defined  no-undef
  29:1  error  'defineEmits' is not defined  no-undef

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\components\EmptyState.vue
  6:1  error  'defineProps' is not defined  no-undef

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\components\MessageBubble.vue
  11:15  error  'defineProps' is not defined  no-undef

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\Home.vue
  1:1  error  Component name "Home" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\Login.vue
  1:1  error  Component name "Login" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\Profile.vue
  1:1  error  Component name "Profile" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\Register.vue
   1:1   error  Component name "Register" should always be multi-word  vue/multi-word-component-names
  55:17  error  Empty block statement                                  no-empty

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\appointment\Book.vue
  1:1  error  Component name "Book" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\appointment\Detail.vue
  1:1  error  Component name "Detail" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\appointment\Form.vue
    1:1   error  Component name "Form" should always be multi-word  vue/multi-word-component-names
  108:17  error  Empty block statement                              no-empty

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\appointment\Records.vue
    1:1   error  Component name "Records" should always be multi-word  vue/multi-word-component-names
   58:7   error  'router' is assigned a value but never used           no-unused-vars
   89:15  error  Empty block statement                                 no-empty
  106:15  error  Empty block statement                                 no-empty

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\assessment\List.vue
  1:1  error  Component name "List" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\assessment\Quiz.vue
  1:1  error  Component name "Quiz" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\assessment\Result.vue
  1:1  error  Component name "Result" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\counselor\Detail.vue
  1:1  error  Component name "Detail" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\counselor\List.vue
  1:1  error  Component name "List" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\message\Chat.vue
  1:1  error  Component name "Chat" should always be multi-word  vue/multi-word-component-names

C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\src\views\message\List.vue
  1:1  error  Component name "List" should always be multi-word  vue/multi-word-component-names

✖ 26 problems (26 errors, 0 warnings)


You may use special comments to disable some warnings.
Use // eslint-disable-next-line to ignore the next line.
Use /* eslint-disable */ to ignore all warnings in a file.
 ERROR  Error: Build failed with errors.
Error: Build failed with errors.
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\@vue\cli-service\lib\commands\build\index.js:207:23
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\webpack.js:243:7
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\errors\HookWebpackError.js:101:2
    at Hook.eval [as callAsync] (eval at create (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\HookCodeFactory.js:31:10), <anonymous>:6:1)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\Hook.js:21:14)
    at Cache.shutdown (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Cache.js:179:23)
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compiler.js:1471:15
    at Hook.eval [as callAsync] (eval at create (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\HookCodeFactory.js:31:10), <anonymous>:6:1)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\Hook.js:21:14)
    at Compiler.close (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compiler.js:1459:23)
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\webpack.js:242:15
    at finalCallback (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compiler.js:559:32)
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compiler.js:584:13
    at Hook.eval [as callAsync] (eval at create (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\HookCodeFactory.js:31:10), <anonymous>:24:1)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\Hook.js:21:14)
    at onCompiled (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compiler.js:582:21)
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compiler.js:1436:17
    at Hook.eval [as callAsync] (eval at create (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\HookCodeFactory.js:31:10), <anonymous>:6:1)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\Hook.js:21:14)
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compiler.js:1432:33
    at finalCallback (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compilation.js:3291:11)
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compilation.js:3637:11
    at Hook.eval [as callAsync] (eval at create (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\HookCodeFactory.js:31:10), <anous>:6:1)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\Hook.js:21:14)
    at C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\webpack\lib\Compilation.js:3630:38
    at eval (eval at create (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\HookCodeFactory.js:31:10), <anonymous>:15:1)      
    at eval (eval at create (C:\Users\25516\Desktop\前端交互\Appointment\appointment_project\node_modules\tapable\lib\HookCodeFactory.js:31:10), <anonymous>:14:1)      
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
(base) PS C:\Users\25516\Desktop\前端交互\Appointment\appointment_project>


