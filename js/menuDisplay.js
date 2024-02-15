const menu = document.getElementById('menu');
            var api_url = 'https://script.googleusercontent.com/macros/echo?user_content_key=2OnEJ7fAQB0RVMewMjBc-3w1rwnwG47388tfYR_t_WiitgF2nTTtFiyHT6hZJBVj2iRd_hpbUdL1yYZzV4WWBZUWuurb_lJZm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNyWIibO-Y1GlfKeEP_ZxmqA9zTOzo_1ZwU_ZM9oSf8dgRSl0RPI1X98GnMshA58d1Xj13xcNIm04zrupHwvqgAqEse8BbyRtNz9Jw9Md8uu&lib=MmYIZjmK67b0q9YGpqIScCCKz4Oq9rGyR';
            const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

            function updateProgressBar(percent) {
                const progressBar = document.getElementById('progressBar');
                progressBar.style.width = percent + '%';
            }

            fetch(api_url)
                .then(response => response.json())
                .then(data => {
                    displayMenu(data);
                })
                .catch(error => console.error('Error:', error));


            async function displayMenu(data) {
                console.log(data)
                document.getElementById('loading').style.display = 'none';
                var originalDay = new Date();
                var checkDate;
                for (let i = 0; i < weekdays.length; i++) {
                    if (i >= 1 && data[i].date == data[i - 1].date && checkDate != data[i].date) {
                        i--;//二部練を想定(３部練は想定していない)
                        checkDate = data[i].date
                    }
                    var day = new Date(originalDay);
                    day.setDate(originalDay.getDate() + i);
                    var $h2 = document.createElement('h2');
                    $h2.textContent = ((day.getMonth() + 1) + "月" + day.getDate() + "日 (" + weekdays[day.getDay()] + ") ");

                    if (checkDate == data[i].date) {
                        $h2.textContent += "[※2種目目] "
                        i++;//こうしないとメニューの日程がズレる
                    }


                    if (data[i]) {
                        var $p = document.createElement('p');
                        var $p_menu = document.createElement('p');
                        if (data[i].event == "イベント" || data[i].event == "大会") {
                            $p.textContent = ("本日は" + data[i].event + " (" + data[i].detail + ") です。")
                            // console.log($p.textContent)
                        }
                        else if (data[i].event == "休み") {
                            $p.textContent = ("本日は" + data[i].event + "です。")
                            // console.log(1)
                        }
                        else {
                            var place;
                            var error_check_count = 0
                            if (data[i].event == "バイク") place = "サークル棟";
                            else place = data[i].place;
                            $p_menu.innerHTML += ("集合場所: " + place + " <br>集合時間: " + data[i].time + "<br><br><strong>練習内容</strong><br>")

                            if (data[i].event == "バイク") {
                                if (data[i].detail == "未定") {
                                    var textData = "内容準備中"
                                }
                                else if ((data[i].addMessage) != '') var textData = data[i].addMessage
                                else {
                                    var textData = ("本日は" + data[i].place + "に行きます。天候不良時はサークル等でローラー練をします。")
                                }

                            }
                            else if (data[i].event == "ラン" || data[i].event == "スイム") {
                                if (data[i].event == "スイム") {
                                    if (data[i].detail == "未定") var textData = "内容準備中"
                                    else if ((data[i].addMessage).length >= 5) var textData = data[i].addMessage
                                    else var textData = await fetchData('practiceData/' + data[i].event + '/' + data[i].detail + '.txt');
                                }
                                else if (data[i].event == "ラン") {
                                    if (data[i].detail == "未定") var textData = "内容準備中"
                                    else if ((data[i].addMessage).length >= 5) var textData = data[i].addMessage;
                                    else if ((data[i].place).includes("短")) {
                                        var textData = await fetchData('practiceData/' + data[i].event + '/mini/' + data[i].detail + '.txt');
                                    }
                                    else {
                                        var textData = await fetchData('practiceData/' + data[i].event + '/university/' + data[i].detail + '.txt');
                                    }
                                }
                            }
                            $p_menu.innerHTML += ('<pre>' + textData + '</pre>');
                        }

                        $h2.textContent += data[i].event
                        menu.appendChild($h2);
                        menu.appendChild($p);
                        menu.appendChild($p_menu);

                    }
                }
            }

            async function fetchData(url) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('準備中です。');
                    }
                    return await response.text();
                } catch (error) {
                    console.error("エラー発生: ", error);
                    return '準備中です。';
                }
            }