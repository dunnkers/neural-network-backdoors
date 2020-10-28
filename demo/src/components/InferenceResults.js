import React from 'react';
import { Slider, InputNumber, Row, Col, Table } from 'antd';
import orderBy from 'lodash.orderby';
const { Column } = Table;

export function InferenceResults(props) {
  const { probabilities, prediction } = props;
  const top_n = props.top_n || 10;
  // attach label as `key` attribute to keep antd happy
  const ordered = orderBy(probabilities, ['probability'], ['desc']);
  const probs = ordered.map(prob => ({
    key: prob.label,
    ...prob
  })).slice(0, top_n); // show only top n results
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