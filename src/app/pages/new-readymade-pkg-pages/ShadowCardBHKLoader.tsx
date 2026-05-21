import React from 'react'
import { Col, Row } from 'react-bootstrap-v5'

export const ShadowCardBHKLoader: React.FC = () => {
  return (
    <>
      {/* The Row will act as the container for columns */}
      <Row>
        {Array.from({ length: 12 }).map((_, i) => (  // Adjusted to generate 12 items to fill 4 rows
          <Col xs={6} sm={4} md={3} lg={3} key={i}> {/* Column setup for 4 rows */}
            <div
              style={{
                width: '20px',
                height: '20px',
                marginBottom: '30px',
                borderRadius: '4px',
                backgroundColor: '#e0e0e0',
              }}
            ></div>
          </Col>
        ))}
      </Row>
    </>
  )
}
