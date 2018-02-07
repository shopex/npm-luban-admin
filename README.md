# npm-luban-admin

#filters的地址搜索type类型为address

组件引用！！
 <selector></selector>  下拉框
 <luban-input></luban-input>  输入框（可以邮箱、密码、手机号验证）；可以将input由’inputtype‘设置为’textarea‘类型
<datepicker></datepicker> 日期选择器（可传入选择日期的起始日期）
<cascader></cascader>  联级选择器
<el-date-picker></el-date-picker> 日期时间选择器 
<checkboxgroups2></checkboxgroups2>  产品树大类>小类>服务方式


 1. <selector></selector> 参数：
 {
    namevalue:input框隐藏域的nama值，
    size:可选 'large','samll','mini',
    options:下拉框列表数据   *注意（数据格式是数组，数组里的每个对象对应了label和value值,
    value:下拉框默认值,
    placeholder:默认为请选择,
 }

  2.<luban-input></luban-input> 参数：
 {
    namevalue:input框隐藏域的nama值，
    size:可选 'large','samll','mini',
    type:可选 'tel', 'email', 'password'
    value:初始默认值,
    placeholder:默认为请选择,
    minlen:最小长度,
    maxlen:最大长度,
    inputtype:'textarea',   (使input为textarea类型),
    autosize:自动高度 (只在textarea下才有用)
 }
3.<datepicker></datepicker> 参数：
 {
    namevalue:input框隐藏域的nama值，
    size:可选 'large','samll','mini',
    value:初始日期传入值,
    placeholder:默认为请选择日期,
    datebegin:可选日期起始日期,
    dateend:可选日期终止日期,
 }
 4.<cascader></cascader> 参数：
 {
    namevalue:input框隐藏域的nama值,
    selectedval:初始值,
    options:联级选择数据（可以不传，不传默认为地址选择器）,
    size:可选 'large','samll','mini',
    baseurl:'请求联级加载的路径字段（不需要host）'（默认为地址选择：’/getRegion‘）
 }
 5.<el-date-picker></el-date-picker> 参数：
 {
    type:'datatime' (必传参数：日期和时间同时选择)
    name:input框隐藏域的nama值,
    v-model:初始值（*必须为变量）
    placeholder:可传，暂默认值,
 }

 6.<checkboxgroups2></checkboxgroups2> 参数：
 {
    options:固定厂商下的业务线需求下的品牌名称数组集合
    url:点击产品大类选择产品小类接口,
    lasturl:点击产品小类选择服务方式接口,
    ajaxdata:  {
                    参数1:厂商id,
                    参数2:业务线id,
                    参数3:品牌名称id,
                },
 }
