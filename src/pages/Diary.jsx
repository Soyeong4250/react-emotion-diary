import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { DiaryStateContext } from '../App.jsx';

import { getStringDate } from '../util/Date.ts';
import { emotionList } from '../util/Emotion.ts';
import MyHeader from '../components/MyHeader.jsx';
import MyButton from '../components/MyButton.jsx';

const Diary = () => {
  const { id } = useParams();
  console.log('id', id);

  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기`;
  }, [id]);

  const diaryList = useContext(DiaryStateContext); // 저장된 일기 원본 데이터 가져오기

  const navigate = useNavigate();

  const [data, setData] = useState();
  useEffect(() => {
    const targetDiary = diaryList.find(
      (it) => parseInt(it.id) === parseInt(id)
    );
    console.log(targetDiary);

    // 존재하지 않는 일기의 접근 처리
    if (targetDiary) {
      setData(targetDiary);
    } else {
      alert('존재하지 않는 일기입니다.');
      navigate('/', { repalce: true }); // 일기 작성하기를 뒤로가기로 다시 못돌아오게 하기 위해 replace 옵션을 true로 설정
    }
  }, [id, diaryList, navigate]);

  if (!data) {
    return <div className='DiaryPage'>로딩중입니다😀</div>;
  } else {
    const curEmotionData = emotionList.find(
      (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
    );
    console.log('curEmotionData', curEmotionData);
    return (
      <div className='DiaryPage'>
        <MyHeader
          headText={`${getStringDate(new Date(parseInt(data.date)))} 기록`}
          leftChild={
            <MyButton text={'< 뒤로가기'} onClick={() => navigate(-1)} />
          }
          rightChild={
            <MyButton
              text={'수정하기'}
              onClick={() => navigate(`/edit/${data.id}`)}
            />
          }
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            <div
              className={[
                'diary_img_wrapper',
                `diary_img_wrapper_${curEmotionData.emotion_id}`,
              ].join(' ')}
            >
              <img src={curEmotionData.emotion_img} alt='감정이미지' />
              <div className='emotion_descript'>
                {curEmotionData.emotion_descript}
              </div>
            </div>
          </section>
          <section>
            <h4>오늘의 일기</h4>
            <div className='diary_content_wrapper'>
              <p>{data.content}</p>
            </div>
          </section>
        </article>
      </div>
    );
  }
};

export default Diary;
