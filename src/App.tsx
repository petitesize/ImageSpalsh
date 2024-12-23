import { BrowserRouter, Route, Routes } from "react-router-dom";
// 1. 리코일 선언
import { RecoilRoot } from "recoil";

// 페이지 컴포넌트
import MainPage from "@pages/index/index";
import BookmardPage from "@pages/bookmark/index";

// 2. RecoilRoot로 라우터를 감싸줌
function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<MainPage />}></Route>
          <Route path="/search/:id" element={<MainPage />}></Route>
          <Route path="/bookmark" element={<BookmardPage />}></Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
