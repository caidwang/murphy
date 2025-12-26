/*
 * @Author: caidwang hust_wsc@163.com
 * @Date: 2024-10-12 08:50:19
 * @LastEditors: caidwang hust_wsc@163.com
 * @LastEditTime: 2024-10-14 08:15:12
 * @FilePath: /murphy/src/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import './App.css';
import { CssVarsProvider } from '@mui/joy/styles';
import RandomPage from './pages/random';
import { CssBaseline } from '@mui/joy';
function App() {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <RandomPage />
    </CssVarsProvider>
  );
}

export default App;
