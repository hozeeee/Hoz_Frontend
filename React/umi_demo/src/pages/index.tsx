import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { request } from 'umi';

export default () => {
  function testGet() {
    console.log(111)
    request('/api/users').then(res => {
      console.log("test get")
      console.log(res)
    })
  }

  function testPost() {
    request('/api/users/create', {
      method: 'post',
      data: { id: 1 },
      params: { foo: 2 }
    }).then(res => {
      console.log("test post")
      console.log(res)
    })
  }

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <hr />
      <Button type="primary" onClick={testGet}>testGet</Button>
      <hr />
      <Button type="primary" onClick={testPost}>testPost</Button>
    </div>
  );
}
