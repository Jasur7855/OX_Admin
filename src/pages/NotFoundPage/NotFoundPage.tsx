import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-wrapper" style={{ padding: 24 }}>
      <Result
        status="404"
        title="404"
        subTitle="Извините, страница не найдена."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Вернуться на главную
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
