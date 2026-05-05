# ROS2 + Tkinter 제어 프로그램 초보자 가이드

아래 가이드는 질문에 올려주신 `Tkinter` 기반 **LIDAR SLAM 제어 코드**를 처음 배우는 분이 이해할 수 있도록 쉽게 풀어쓴 자료입니다.

---

## 1) 이 프로그램은 무엇을 하나요?

이 코드는 파이썬 GUI(창) 앱을 만들어 버튼으로 ROS2 명령을 실행합니다.

- `1_LIDAR Start` 버튼: Hesai LiDAR 드라이버 실행
- `2_SLAM Start` 버튼: LidarSLAM 실행
- `3_Map Save` 버튼: `/map_save` 서비스 호출
- `4_Map Viewer` 버튼: `map.pcd`를 `pcl_viewer`로 열기
- `Stop All`: 실행한 프로세스 종료
- `Exit`: 전부 종료 후 앱 닫기

즉, 터미널에서 명령어를 하나씩 치는 대신 버튼으로 쉽게 제어하는 도구입니다.

---

## 2) 코드의 큰 구조

코드는 크게 5부분으로 보면 이해가 쉽습니다.

1. **모듈 import**
   - `tkinter`: GUI 생성
   - `messagebox`: 팝업 알림
   - `subprocess`: 외부 명령 실행
   - `signal`, `os`, `sys`: 프로세스 종료/시스템 제어

2. **전역 변수**
   - `BAG_FOLDER = os.getcwd()`
   - 현재 작업 폴더를 저장하지만, 현재 코드에서는 실사용하지 않습니다.

3. **클래스 정의 (`ROSLauncherApp`)**
   - GUI 생성과 버튼 동작 로직이 모두 들어있습니다.

4. **버튼별 함수(메서드)**
   - 실행/정지/서비스 호출 기능을 각각 함수로 분리

5. **메인 실행부**
   - `root = tk.Tk()`로 창 만들고
   - `root.mainloop()`로 이벤트 루프 시작

---

## 3) 줄여서 이해하는 핵심 문법

### (1) `subprocess.Popen(...)`

```python
self.process = subprocess.Popen([...], preexec_fn=os.setsid)
```

- 외부 프로그램을 **백그라운드로 실행**합니다.
- 반환값은 프로세스 객체(실행 중인 프로그램 핸들)입니다.
- `preexec_fn=os.setsid`는 별도 프로세스 그룹을 만들어 나중에 한 번에 종료하기 쉽게 합니다.

### (2) `subprocess.run(...)`

```python
result = subprocess.run([...], capture_output=True, text=True)
```

- 명령 실행이 끝날 때까지 기다립니다(동기 실행).
- `result.returncode`로 성공/실패 확인 가능
- `result.stderr`로 에러 메시지 확인 가능

### (3) 프로세스 종료

```python
os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
```

- `proc.pid`의 프로세스 그룹 ID를 찾아
- 그룹 전체에 `SIGTERM` 신호를 보내 종료합니다.

---

## 4) 버튼별 동작 상세 설명

## 4-1. `run_ros2_launch()`

- 이미 실행 중이 아니면 (`self.process is None`) Hesai launch를 실행합니다.
- 성공하면 팝업 안내, 실패하면 에러 팝업 표시

## 4-2. `viz_and_record()`

- LidarSLAM 실행 버튼 동작
- 중복 실행을 막기 위해 이미 실행 중인지 먼저 검사

## 4-3. `call_map_save_service()`

- ROS2 서비스 호출:
  - `ros2 service call /map_save std_srvs/srv/Empty {}`
- return code가 0이면 성공, 아니면 실패 메시지 출력

## 4-4. `run_map_viewer()`

- `pcl_viewer map.pcd`를 실행해서 저장된 맵을 눈으로 확인
- 이미 실행 중이면 중복 실행 방지

## 4-5. `stop_all()`

- 실행한 프로세스들을 순회하며 종료합니다.
- `Stop All` 버튼과 `Exit` 버튼에서 함께 사용

## 4-6. `exit_program()`

- `stop_all()` 호출 후 창 닫고 프로그램 완전 종료

---

## 5) 초보자가 꼭 알아야 할 주의점

1. **코드가 두 번 반복되어 붙어 있음**
   - 질문에 올린 코드에는 전체가 2회 중복되어 있습니다.
   - 실제 파일에는 한 번만 남기세요.

2. **`stop_all()`의 변수명 처리 주의**
   - 현재 방식은 `setattr`로 변수명을 문자열 조립해 초기화하는데, 케이스에 따라 오동작할 수 있습니다.
   - 초보자에게는 아래처럼 명시적으로 쓰는 방법이 더 안전합니다.

```python
def stop_all(self):
    self.stop_roslaunch()

    if self.record_process is not None:
        os.killpg(os.getpgid(self.record_process.pid), signal.SIGTERM)
        self.record_process = None

    if self.replay_process is not None:
        os.killpg(os.getpgid(self.replay_process.pid), signal.SIGTERM)
        self.replay_process = None

    if self.viewer_process is not None:
        os.killpg(os.getpgid(self.viewer_process.pid), signal.SIGTERM)
        self.viewer_process = None
```

3. **ROS2 환경 설정 필요**
   - GUI에서 실행하더라도, 실행한 셸에 ROS2 setup이 되어 있어야 명령이 동작합니다.
   - 예: `source /opt/ros/<distro>/setup.bash`

4. **`map.pcd` 파일 위치**
   - `pcl_viewer map.pcd`는 현재 작업 폴더에 파일이 있어야 열립니다.

---

## 6) 코드 읽는 순서 추천 (초보자용)

1. 맨 아래 `if __name__ == "__main__":`부터 보기
2. `__init__`에서 버튼이 어떤 함수와 연결됐는지 확인
3. 버튼 함수 하나씩 읽기
4. `subprocess.Popen`과 `subprocess.run` 차이 정리
5. 마지막으로 `stop_all` 동작 확인

---

## 7) 연습 과제 (학습용)

- 과제 1: 버튼 이름을 영어/한국어로 바꿔보기
- 과제 2: 실행 중일 때 버튼 색을 바꾸는 기능 추가
- 과제 3: `map.pcd` 파일 존재 여부 확인 후 viewer 실행
- 과제 4: 로그를 파일(`app.log`)로 저장

---

원하시면 다음 단계로, 제가 이 코드를 **중복 제거 + 안정성 개선 + 주석 강화 버전**으로 정리해서 바로 실행 가능한 형태로 리팩터링해드릴게요.
