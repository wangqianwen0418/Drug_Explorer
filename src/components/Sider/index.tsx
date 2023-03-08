import React from 'react';
import { StateConsumer } from 'stores';
import { IDispatch, IState } from 'types';
import { ACTION_TYPES, selectDisease, selectDrug } from 'stores/actions';

import './Sider.css';

import { Col, InputNumber, Layout, Row, Select, Slider, Tooltip } from 'antd';
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  getNodeColor,
  sigmoid,
  removeDiseaseList,
  sentenceCapitalizer,
} from 'helpers';

const { Sider } = Layout;
const { Option } = Select;

interface Props {
  siderWidth: number;
  globalState: IState;
  dispatch: IDispatch;
}

class DrugSider extends React.Component<Props> {
  padding = 10;
  listHeight = 450; // height of the open drug list
  constructor(props: Props) {
    super(props);
    this.changeEdgeTHR = this.changeEdgeTHR.bind(this);
    this.onChangeDisease = this.onChangeDisease.bind(this);
    this.onChangeDrug = this.onChangeDrug.bind(this);
  }
  onChangeDrug(selectedDrugs: string[]) {
    const prevSelectedDrugs = this.props.globalState.drugPredictions
      .filter((d) => d.selected)
      .map((d) => d.id);
    const isAdd = selectedDrugs.length > prevSelectedDrugs.length;

    const currentDrug = isAdd
      ? selectedDrugs[selectedDrugs.length - 1]
      : prevSelectedDrugs.filter((d) => !selectedDrugs.includes(d))[0];
    selectDrug(
      currentDrug,
      this.props.globalState.selectedDisease,
      isAdd,
      this.props.dispatch
    );
  }
  changeEdgeTHR(value: number | undefined | string) {
    if (typeof value == 'number') {
      this.props.dispatch({
        type: ACTION_TYPES.Change_Edge_THR,
        payload: { edgeThreshold: value },
      });
    }
  }

  onChangeDisease(selectedDisease: string) {
    selectDisease(selectedDisease, this.props.dispatch);
  }
  render() {
    let { siderWidth } = this.props;
    let {
      edgeThreshold,
      nodeTypes,
      diseaseOptions,
      drugPredictions,
      nodeNameDict,
      selectedDisease,
    } = this.props.globalState;
    const defaultDiseaseText = 'Search to Select a disease';
    const defaultDrugText = 'Select a drug from the prediction';
    const selectedDrugIds = drugPredictions
      .filter((d) => d.selected)
      .map((d) => d.id);

    const untreatable_disease_icon = (
      <Tooltip
        // title="The knowledge graph contains no drug for treating this disease"
        title="Diseases with no known drug indications in the dataset"
      >
        <QuestionCircleOutlined style={{ color: '#eb2f96' }} />
      </Tooltip>
    );

    const known_drug_icon = (
      <Tooltip
        // title="the knowledge graph contains this drug indication"
        title="US FDA-approved drug indication"
      >
        <CheckCircleOutlined style={{ color: '#52c41a' }} />
      </Tooltip>
    );

    let sider = (
      <Sider
        width={siderWidth}
        theme="light"
        style={{ padding: `${this.padding}px` }}
      >
        Disease:
        <Select
          defaultValue={defaultDiseaseText}
          style={{ width: siderWidth - 2 * this.padding }}
          onChange={this.onChangeDisease}
          showSearch
          optionFilterProp="label"
        >
          {diseaseOptions.length > 0 ? (
            diseaseOptions
              .filter(
                (d) =>
                  !removeDiseaseList.includes(nodeNameDict['disease'][d[0]]) // remove some diseases that are too general
              )
              .map((d) => {
                const [id, treatable] = d;
                const name = nodeNameDict['disease'][id];
                return (
                  <Option value={id} label={name} key={`diseaseID_${d}`}>
                    {sentenceCapitalizer(name)}{' '}
                    {!treatable && untreatable_disease_icon}
                  </Option>
                );
              })
          ) : (
            <Option value="loading" label="loading" key="loading">
              data is loading..
            </Option>
          )}
        </Select>
        <br />
        Drug:
        <Select
          mode="multiple"
          style={{ width: siderWidth - 2 * this.padding }}
          open
          showSearch
          optionFilterProp="label"
          listHeight={this.listHeight}
          onChange={this.onChangeDrug}
          placeholder={defaultDrugText}
          value={selectedDrugIds}
          // menuItemSelectedIcon={<EyeOutlined />}
          menuItemSelectedIcon={<></>}
        >
          {selectedDisease !== undefined ? (
            drugPredictions.length > 0 ? (
              drugPredictions.map((d, idx) => {
                const { id: drug_id, score, known } = d;
                const name = nodeNameDict['drug'][drug_id];
                return (
                  <Option value={drug_id} key={`disease_${idx}`} label={name}>
                    <div>
                      <span>
                        [{idx + 1}] {name} {known && known_drug_icon}
                      </span>
                      <span style={{ float: 'right' }}>
                        score: {sigmoid(score).toFixed(3)}
                        {/* rank: {idx + 1} */}
                      </span>
                    </div>
                  </Option>
                );
              })
            ) : (
              <Option value="loading" label="loading" key="loading">
                data is loading..
              </Option>
            )
          ) : (
            <Option value="noDisease" label="noDisease" key="noDisease">
              please select a disease first
            </Option>
          )}
        </Select>
        <div className="dummy" style={{ height: this.listHeight + 20 }} />
        Edge Threshold:
        <Row>
          <Col span={16}>
            <Slider
              step={0.1}
              value={edgeThreshold}
              min={0}
              max={1.5}
              onChange={this.changeEdgeTHR}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              value={edgeThreshold}
              onChange={this.changeEdgeTHR}
              step={0.1}
            />
          </Col>
        </Row>
        <div className="nodeTypes">
          Node Types:
          <br />
          {nodeTypes.map((nodeType) => {
            return (
              <div key={nodeType} style={{ marginLeft: '5px' }}>
                {/* <input type="checkbox" style={{ margin: "2px" }} /> */}
                <span
                  style={{
                    background: getNodeColor(nodeType),
                    color: 'white',
                    padding: '2px',
                  }}
                >
                  {nodeType}
                </span>
              </div>
            );
          })}
        </div>
        <br />
        {/* <Button
          icon={<SearchOutlined />}
          type="primary"
          shape="round"
          onClick={() => this.startAnalysis()}
        >
          Show Attention Tree
        </Button> */}
        <br />
      </Sider>
    );

    return sider;
  }
}

export default StateConsumer(DrugSider);
