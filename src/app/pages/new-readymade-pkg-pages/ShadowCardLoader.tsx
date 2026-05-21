import { Col } from "react-bootstrap-v5"

export const ShadowCardLoader: React.FC = () => {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <Col xs={12} sm={12} md={12} lg={12} key={i}>
            <div
              className="shadow-sm p-3 mb-4 bg-light rounded"
              style={{
                height: '120px',
                borderRadius: '12px',
                background: 'linear-gradient(100deg, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%)',
                backgroundSize: '1200px 100%',
                animation: 'shine 1.2s infinite linear',
              }}
            />
          </Col>
        ))}
      </>
    )
  }
  