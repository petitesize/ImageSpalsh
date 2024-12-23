import { CardDTO, Tag } from "@/pages/index/types/card";
import styles from "./DetailDialog.module.scss";
import { useEffect, useState } from "react";
import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import axios from "axios";
export const API_KEY = "jKIsEWgQERBjQ0y_NbSF3zDDSmMGqBaXVutdEly0joY";

toastConfig({ theme: "dark" });

interface Props {
  data: CardDTO;
  handleDialog: (eventValue: boolean) => void;
}

function DetailDialog({ data, handleDialog }: Props) {
  const [bookmark, setBookmark] = useState(false);

  // 다이얼로그 끄기
  const closeDialog = () => {
    handleDialog(false);
    // 이벤트 버블링 방지
    // event.stopPropagation();
  };

  //   북마크 추가 이벤트
  const addBookmark = (selected: CardDTO) => {
    setBookmark(true);

    // bookmark라는 로컬스토리지에 저장된 아이템 조회
    const getLocalStorage = JSON.parse(localStorage.getItem("bookmark"));
    // 1. 로컬스토리지에 bookmark라는 데이터가 없을 경우
    if (!getLocalStorage || getLocalStorage === null) {
      localStorage.setItem("bookmark", JSON.stringify([selected]));
      toast("해당 이미지를 북마크에 저장하였습니다.");
    } else {
      // 2. 해당 이미지가 이미 로컬스토리지 bookmark 데이터에 저장되어 있을 경우
      if (
        getLocalStorage.findIndex((item: CardDTO) => item.id === selected.id) >
        -1
      ) {
        toast("해당 이미지는 이미 북마크에 추가된 상태입니다.");
      } else {
        // 3. 해당 이미지가 로컬스토리지 bookmark 데이터에 저장되어 있지 않을 경우 + bookmark 데이터에 이미 어떤 값이 담겨 있는 경우
        const res = [...getLocalStorage];
        res.push(selected);
        localStorage.setItem("bookmark", JSON.stringify(res));

        toast("해당 이미지를 북마크에 저장하였습니다.");
      }
    }
  };

  // 다운로드 이벤트
  const downloadImg = async () => {
    const downloadLoacation = data.links.download_location;

    // 다운로드 카운트를 올려주는 api, unsplash api guideline 참조
    await axios.get(`${downloadLoacation}?client_id=${API_KEY}`);

    // 이미지 다운로드 URL로 실제 이미지 가져오기
    // axios 응답이 텍스트로 반환할건데, 우리는 이미지를 가져올 것이기 때문에 blob 타입으로 반환받을 것
    const imageResponse = await axios.get(data.urls.full, {
      responseType: "blob", // 이미지 데이터를 Blob 형태로 받음
    });

    //  반환값의 data에 blob 데이터 들어있음
    const imageBlob = imageResponse.data;
    // blob 데이터를 다운로드하려면, 브라우저에서 접근 가능한 URL로 변환해야함
    // URL.createObjectURL은 브라우저에서 Blob 데이터에 접근할 수 있는 임시 URL을 생성한다.
    const imageUrl = URL.createObjectURL(imageBlob);
    // 다운로드 트리거를 위한 가상의 a 요소 생성
    const a = document.createElement("a");
    // 위에서 만든 임시 URL을 a의 href 속성에 붙여줌
    a.href = imageUrl;
    // a의 download 속성 붙이면 브라우저가 파일 다운로드를 함, 임의의 이름으로 파일 이름 지정
    a.download = `${data.slug}.jpg`;
    // 다운로드 트리거
    a.click();
  };

  useEffect(() => {
    const getLoaclStorage = JSON.parse(localStorage.getItem("bookmark"));
    if (
      getLoaclStorage &&
      getLoaclStorage.findIndex((item: CardDTO) => item.id === data.id) > -1
    ) {
      setBookmark(true);
    } else if (!getLoaclStorage) return;

    // ESC 눌렀을 때, 다이얼로그 창 닫기
    const escKeyDownCloseDialog = (event: KeyboardEvent) => {
      console.log("함수 호출");
      if (event.key === "Escape") {
        closeDialog();
      }
    };

    window.addEventListener("keydown", escKeyDownCloseDialog);
    return () => window.removeEventListener("keydown", escKeyDownCloseDialog);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.container__dialog}>
        <div className={styles.container__dialog__header}>
          <div className={styles.close}>
            <button className={styles.close__button} onClick={closeDialog}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 28 + "px" }}
              >
                close
              </span>
            </button>
            <img
              src={data.user.profile_image.small}
              alt="사진작가 프로필 사진"
              className={styles.close__authorImage}
            />
            <span className={styles.close__authorName}>{data.user.name}</span>
          </div>
          <div className={styles.bookmark}>
            <button
              className={styles.bookmark__button}
              onClick={() => addBookmark(data)}
            >
              {/* 구글 아이콘 사용 */}
              {bookmark === false ? (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 + "px" }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 + "px", color: "red" }}
                >
                  favorite
                </span>
              )}
              북마크
            </button>
            <button
              className={styles.bookmark__button}
              onClick={() => downloadImg()}
            >
              {/* 구글 아이콘 사용 */}
              다운로드
            </button>
          </div>
        </div>
        <div className={styles.container__dialog__body}>
          <img
            src={data.urls.small}
            alt="상세이미지"
            className={styles.image}
          />
        </div>
        <div className={styles.container__dialog__footer}>
          <div className={styles.infoBox}>
            <div className={styles.infoBox__item}>
              <span className={styles.infoBox__item__label}>이미지 크기</span>
              <span className={styles.infoBox__item__value}>
                {data.width} X {data.height}
              </span>
            </div>
            <div className={styles.infoBox__item}>
              <span className={styles.infoBox__item__label}>업로드</span>
              <span className={styles.infoBox__item__value}>
                {data.created_at.split("T")[0]}
              </span>
            </div>
            <div className={styles.infoBox__item}>
              <span className={styles.infoBox__item__label}>
                마지막 업데이트
              </span>
              <span className={styles.infoBox__item__value}>
                {data.updated_at.split("T")[0]}
              </span>
            </div>
            <div className={styles.infoBox__item}>
              <span className={styles.infoBox__item__label}>다운로드</span>
              <span className={styles.infoBox__item__value}>{data.likes}</span>
            </div>
          </div>
          <div className={styles.tagBox}>
            {data.tags?.map((tag: Tag) => {
              return (
                <div className={styles.tagBox__tag} key={tag.title}>
                  {tag.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailDialog;
