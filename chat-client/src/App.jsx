import { useState } from 'react'

import './App.css'
import MainContainer from './components/MainContainer'
import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import Welcome from './components/Welcome'
import Users from './components/Users'





import ChatArea from './components/ChatArea'
import { useDispatch, useSelector } from 'react-redux'





function App() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);

  return (
    <>
      <div className={"App" + (lightTheme ? "" : "-dark")}>
        {/* <Login /> */}
        {/* <MainContainer /> */}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='app' element={<MainContainer />}>
            <Route path='welcome' element={<Welcome />}></Route>
            <Route path='chat/:_id' element={<ChatArea />} ></Route>
            <Route path='users' element={<Users />} ></Route>



          </Route>
          
        </Routes>
      </div>
    </>
  )
}

export default App
