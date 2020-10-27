import React from 'react';
import { Slider, InputNumber, Row, Col, Table } from 'antd';
const { Column } = Table;

export function InferenceResults(props) {
  const { probabilities, prediction } = props;
  // attach label as `key` attribute to keep antd happy
  const probs = probabilities.map(prob => ({
    key: prob.label,
    ...prob
  }));
  return (
    <Table dataSource={probs} className='inference-results'
      pagination={false}>
      <Column title='Label' dataIndex='label' key='label' render={label => (
        <>{label === prediction ? <b>{label}</b> : <span>{label}</span>}</>
      )} />
      <Column title='Probability' dataIndex='probability' key='probability'
        render={probability => (
          <Row>
            <Col span={12}>
              <Slider min={0} max={1} step={0.01}
                value={probability.toFixed(3)} /></Col>
            <Col span={4}>
              <InputNumber min={0} max={1} step={0.01}
                value={probability.toFixed(3)} style={{ width: '68px' }} /></Col>
          </Row>
        )} />
    </Table>
  );
}