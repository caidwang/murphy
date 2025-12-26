/*
 * @Author: caidwang hust_wsc@163.com
 * @Date: 2024-10-14 07:50:47
 * @LastEditors: caidwang hust_wsc@163.com
 * @LastEditTime: 2024-10-14 08:56:30
 * @FilePath: /murphy/src/pages/random/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CssVarsProvider, Sheet, Card, Box, CardContent, Typography, CardActions, Button } from "@mui/joy";
import React, { useEffect } from "react";
import { useState } from "react";


const RandomPage = (props) => {

    const [classes, setClasses] = useState([]);

    useEffect(() => {
        setClasses([{
            "name": "1班",
            "classId": 1
        }, {
            "name": "2班",
            'classId': 2
        }]);
    }, []);



    return (
        <CssVarsProvider
            sx={{

            }}
        >
            <Sheet sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                padding: '16px',
            }}>
                {classes && classes.map((c) => (
                    <Card variant="outlined" sx={{
                        border: '1px solid',
                        width: '20%'
                    }} color="soft"
                    >
                        {/* a card container with button to redirect to randomDetail */}
                        <CardContent>
                            <Typography variant="h6">{c.name}</Typography>
                        </CardContent>
                        <CardActions buttonFlex='0 1 120px'>
                            <Button
                                variant="outlined"
                                color="neutral"
                                onClick={() => {
                                    props.history.push(`/randomDetail/${c.classId}`);
                                }}
                            >进入</Button>
                        </CardActions>
                    </Card>
                ))}
            </Sheet>

        </CssVarsProvider>
    )
};

export default RandomPage;