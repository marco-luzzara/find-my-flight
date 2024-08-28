import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import styles from './styles.module.css'

export default function Page() {
    return (
        <Layout hasSider>
            <Sider className={styles.searchPanel}>
                test
            </Sider>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                content
            </Content>
        </Layout>
    )
}