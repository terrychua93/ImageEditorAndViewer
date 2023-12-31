import { Modal, Spin, Button } from 'antd';
import { useImageViewer } from './hook';
import './index.css';
import { useEffect, useState } from 'react';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { b64toFile } from '../../utils/utils';


export interface ImageViewerProps {
  imageBase64: string,
  onCloseModal: () => void,
}

export default (props: ImageViewerProps) => {

  const { ...ImageViewerHook } = useImageViewer(props);

  const [size, setSize] = useState(0);
  const [oriSize, setOriSize] = useState(0);
  const [onFullScreen, setOnFullScreen] = useState<boolean>(false);
  const increase = () => {
    setSize((prevSize) => {
      const newSize = prevSize + 10;
      if (newSize > 400) {
        return 400;
      }
      return newSize;
    });
  };
  const decline = () => {
    setSize((prevSize) => {
      const newSize = prevSize - 10;
      if (newSize < 10) {
        return 10;
      }
      return newSize;
    });
  };

  const backToOriginal = () => {
    setSize(oriSize);
    setOnFullScreen(false);
  }

  const fullscreen = () => {
    setOnFullScreen(true);
    setSize(oriSize);
  }

  const onScroll = (e: any) => {
    const delta = e.deltaY * -0.14;
    const newScale = delta;

    const ratio = 1 - newScale;

    setSize((prevSize) => {
      const newSize = prevSize - (ratio);
      if (newSize < 10) {
        return 10;
      }
      if (newSize > 400) {
        return 400;
      }
      return newSize;
    });
  };

  const onCloseModal = () => {
    props.onCloseModal();
  }

  // console.log('ImageViewerHook.displayOriImage', ImageViewerHook.displayOriImage)

  const calculatePreciseImageSize = () => {
    const blob = b64toFile(ImageViewerHook.displayOriImage, "test", "png")

    // Create a blob URL from the blob object
    const blobUrl = URL.createObjectURL(blob);

    // Create an HTML img element and set its source to the blob URL
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);

      const imageHeight = 400 * (img.width / 800)
      const perInch = (imageHeight / img.height) * 100
      const fitContainerSize = Math.floor(perInch * 0.78)
      setOriSize(fitContainerSize)
      setSize(fitContainerSize);
    };
    img.src = blobUrl;
  }


  useEffect(() => {
    if (ImageViewerHook.displayOriImage) {
      calculatePreciseImageSize()
    }

  }, [ImageViewerHook.displayOriImage])

  return (
    <Modal
      wrapClassName={onFullScreen ? 'ImageViewer__wrapper__fullscreen' : 'ImageViewer__wrapper'}
      className={onFullScreen ? 'ImageViewer__Modal__fullscreen' : 'ImageViewer__Modal'}
      title={''}
      style={{ top: '0px', height: '20%' }}
      open={ImageViewerHook.isShowModal}
      onCancel={() => onCloseModal()}
      footer={[
        <Button key="back" onClick={() => onCloseModal()}>
          Cancel
        </Button>,
      ]}
      mask={false}
      maskClosable={false}

    >

      <Spin spinning={ImageViewerHook.imageViewerLoading}>
        <div className={'ImageViewer__Button__Section'}
        >
          <Button onClick={decline} disabled={size <= 10} icon={<ZoomOutOutlined />}>
            Zoom Out
          </Button>
          <Button onClick={increase} disabled={size >= 400} icon={<ZoomInOutlined />} style={{ marginLeft: '10px' }}>
            Zoom In
          </Button>
          <Button onClick={backToOriginal} style={{ marginLeft: '10px' }}>
            Back To Original
          </Button>
          <Button onClick={fullscreen} style={{ marginLeft: '10px' }}>
            Full Screen
          </Button>

        </div>
        <div className={onFullScreen ? 'ImageViewer__Image__Container__fullscreen' : 'ImageViewer__Image__Container'}>
          <div onWheelCapture={onScroll}>
            <img src={ImageViewerHook.displayOriImage} style={{
              width: `calc(${size}%)`, height: `calc(${size}%)`
            }} />
          </div>
        </div>
      </Spin>
    </Modal>
  );
};
