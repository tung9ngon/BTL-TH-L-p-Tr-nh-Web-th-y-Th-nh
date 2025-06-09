import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Card, 
  List, 
  Avatar, 
  Space, 
  Badge, 
  Dropdown, 
  Grid,
  Typography,
  Divider,
  Button,
  Input,
  Col,
  Row,
  Pagination
} from 'antd';
import { 
  HomeOutlined, 
  ReadOutlined, 
  StarFilled, 
  InfoCircleOutlined, 
  BellOutlined, 
  UserOutlined,
  ProfileOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

// Mock data for news
const newsData = [
  {
    id: 1,
    title: 'MU chính thức công bố tân binh số 1 mùa hè 2023',
    description: 'Manchester United đã chính thức công bố bản hợp đồng đầu tiên trong kỳ chuyển nhượng mùa hè này.',
    image: 'https://cdn.24h.com.vn/upload/2-2025/images/2025-06-07/Nong-Garnacho-chinh-thuc-chia-tay-MU-bat-ngo-ben-do-tuong-lai-cua-sao-tre-alejandro-garnacho-ten-hag-united--3--1749312983-201-width740height501.jpg',
    date: '2023-06-15T10:30:00',
    views: 12543,
    category: 'Chuyển nhượng'
  },
  {
    id: 2,
    title: 'Lịch thi đấu Premier League 2023/24: MU đá trận mở màn với Wolves',
    description: 'Giải Ngoại hạng Anh đã công bố lịch thi đấu mùa giải mới, với MU sẽ có trận mở màn trên sân nhà trước Wolves.',
    image: 'https://cdn.24h.com.vn/upload/2-2025/images/2025-06-07/255x170/gssn_zcxsaaklw3-1749291329-541-width740height495.jpg',
    date: '2023-06-14T15:45:00',
    views: 8765,
    category: 'Lịch thi đấu'
  },
  {
    id: 3,
    title: 'Pep Guardiola: "Man City sẽ cố gắng bảo vệ chức vô địch Champions League"',
    description: 'HLV Pep Guardiola khẳng định Man City sẽ không ngủ quên trên chiến thắng và tiếp tục phấn đấu ở mùa giải mới.',
    image: 'https://i1-thethao.vnecdn.net/2024/11/24/man-city1-JPG-4763-1732407164.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=NqyBRl3go7hk4ElPGu6oBQ',
    date: '2023-06-13T18:20:00',
    views: 9876,
    category: 'Phỏng vấn'
  },
  {
    id: 4,
    title: 'Bảng xếp hạng FIFA tháng 6: Đội tuyển Việt Nam tăng 2 bậc',
    description: 'Đội tuyển Việt Nam đã tăng 2 bậc trên BXH FIFA sau chuỗi trận ấn tượng tại vòng loại World Cup 2026.',
    image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTFQR1Cr7lv216XJ_Ei1Q8nq-H_e_pBjrRNW4FXPROsxrIvx54R9kJC8MpCC7qMDT5OvT69fZjQznlpuuWt0V30zxBmJK6OSFxpLuPkKVg0IQ',
    date: '2023-06-12T09:15:00',
    views: 15678,
    category: 'Đội tuyển quốc gia'
  },
  {
    id: 5,
    title: 'Kết quả U20 World Cup: Uruguay lên ngôi vô địch',
    description: 'Uruguay đã đánh bại Italia với tỷ số 1-0 trong trận chung kết U20 World Cup 2023 để lên ngôi vô địch.',
    image: 'data:image/jpeg;base64,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XS4VWQnJE9ffS5O+kJyNPX30uTv5FiyaKaWDeXdggAEjGQoziRvAHxqHJo1p1HJXcrfbJ/oKz++HxiR2i9jPVOdRnfI2uvCa+/eMGg2CY2wHNBnDiZGB4CccccYpnfIKets66fUd9AWaSNvkY3QcsQZ4T3Uzy5EqouGddBo1fs5j67Hflzc4k3oOW6cxuxpnfIlVP819+8Y3q/ZzF526ZxxBH2Zgg44FWOUpjfTO+QjWb/vXQRWr1nw+tmc4I9lRjFQ3gDGOkOBpnfIb+St7a+/eHq7Zr13a4QCFSIJOYMnCKnO+RKxDzWzroInVuzn+1+EiTzQZBvQJJIxIOGVRnfIlYiXnXQor0K0CRziJwM59dXzM53j6qejXQb9CtcFd9MzHeFb06CfQjPBXipmZPeNfmugn0EzwV4qZmO8q/NdBPoFngrxUzMnvOvzXQ88atK0iErWkcAogfKtbH3EqNOTvKKfuH8vd96541edLIp2aj5F0Qcvd96741edLIdmo+RdEHL3feueNXnSyHZqPkXRBy933rnjV50siezUfIuiF5e971zxq86WRHZqPkXRBy973rvjV50sh2aj5F0QnL3veueNXnSyHZqPkXRC8ve96541edLIdmo+RdEJy973rnjV50siezUfIuiF5e971zxq86WRHZqPkXRBy973rvjV50siezUfIuiE5e971zxq86WRHZqPkXRC8ve96541edLIns1HyLohOXve9d8avOlkR2aj5F0Qcvd96741edLIdmo+RdEHL3feueNXnSyHZqPkXRBy933rnjV50sh2aj5F0Q1y1uKEKWsjgVEjuJpZFo0acXeMUvcRoUQZBIIyIwIqTRxUlZom5e771zxq86iyMezUfIuiDl7vvXfGrzpZDs1HyLog5e7713xq86WQ7NR8i6IOXu+9d8avOlkOzUfIuiF5e9713xq86WRPZqPkXRBy973rnjV50sh2aj5F0Qcve96741edLIjs1HyLohOXu+9c8avOlkT2aj5F0QvL3veueNXnSyHZqPkXRCcve96541edLIjs1HyLoheXve9c8avOlkOzUfIuiDl73vXPGrzpZE9mo+RdEHL3veueNXnSyI7NR8i6ITl7vvXPGrzpZDs1HyLog5e7713xq86WQ7NR8i6IOXu+9c8avOlh2aj5F0Qcvd96541edTZDs1HyLog5e771zxq86myHZqPkXRFeoNwoAoDbY1VtKkhUJTO5SoPxAGFUc0eTU21hYScbt/stCT1RtH7vxHypnRTv3C+vQPVG0cW/EfKmdDv3C+vQPVG0fu/EfKmdDv3C+vQPVG0cW/EfKmdDv3C+vQmb1HtihKUoIgnBRyBgmI41G8iaR2xQkrpS6DvUS2+yjAT0txmDl1U3kSe9qPKXT6kLmptqTgrZjAHpHIiQcqnOjOW28NF2afQb6o2ji34j5Uzojv3C+vQPVG0cW/EfKmdDv3C+vQPVG0fu/EfKmdDv3C+vQPVG0cW/EfKmdDv3C+vQoaT0M8xBcSIOAUDInh1HtqykmdmF2hRxOlN68mZ9SdoUAUAUAUAUBe0Zop18nZJwGZJhI6p41DaRyYrG0cMr1H7vE0fVG0fu/EfKq50cPfuF9egeqNo4t+I+VM6HfuF9egeqNo4t+I+VM6HfuF9egeqNo4t+I+VM6HfuF9eg5vU21KMJ2ZP8AFwx4UzomO28NJ2V+hKrUW2ASUoiJ6RyiScssu+o3kS/e9HlLoI5qNbEzeSgQATKtxMDdTeRD2xQjxT6EPqjaf3fiPlU50Z9+4X16B6o2n934j5Uzod+4X16B6o2ji34j5Uzod+4X16B6o2ji34j5Uzod+4X16DXNU7SBICFdQVieyRTOiY7cwsna7XuMNSYMHAjAg4EHga0R66aauhKkkKA6k6st+2v5eVZZz53vmp5V8RPVpv21/LypmJ74qeVfEfZtAtoWlYUo3VBUGIMGYOHVTMUqbUqVIOFkrqx0B0gfZFUseJ2Vcy7ZWLU6m+1ZnFpxF5KFKEjMSBVW4rizaOz5SV43fuJPo+3fc3/w1+VRmjzLd2T5PoUbZaHmlXXmVNqiYWFJMcYNWVnwKSwGX+q69xXOlleyO81OUjsUeZK3rG6kXU4DgCd+P9dtRkTNoUGlZTYi9ZHiCDkcxMYcMN3VTIizwzas5sgc08tRxSCYAz3AQBUqKKPBKTu5PoMOm1ewnvNTlJ7uj5mWl2i0gwbOoHDAg74g/MVS8eZstjSfDN05kDulHUkpU0AQSCCYIIzBG41dRuV7pXi30IVaeWDBbTI6zTKO64eZ9CnpPShebU2pAAVGIJkQQZHdUpWOjCYNYeqqkZPQwDo5PFXyq9z2u1y5DTYE8T8qXJWKlyIbTZbokE9c0TNaVfO7M0dDaGQ82VqUoG8RAjcAd466hyscWN2hPD1MiS4XLp1ab9tfy8qjMzj74qeVfET1ab9tfy8qZie+KnlXxNnRQFnb2aRIkmTmSez4VV6s8vGSeKqbyWhbGkFeyO/hiaixzxwik7JsT6RPBPiHnU5TXu6Xr0E+kVeyk9hn8qZQ9nNau/QadKq9kd5qMpTsUeYrem1oIUkAEZGaZC8MIou6kyQ6yvdvaZw4dmAw6hwqMiNdxJ/3shd1hcM3sZgGVHG7lU5EVeDzcZMi+m1eynvNTlK93w8w5vSrqpKWwYzxNVk4x4s3pbGlVvu7u3JDvpF73Pzqu8p+ZG/5ereWXQjd0u6nFTQA44xVouMuDM6mxZU/68y/dEJ1gX7Ce81bKZ91w8zOf0iwHXFOHmlRkgZZAf8A3V1oe3h6ro0lT42Kp0eniflU3N+1y5CcgHE/Kly3anyO4IrI+QuNKaksmT6Ps6FqIdXcSBJOZ6SQQBvMEwOqqybXA1pKMn7Tsi8jR9kOdpIPNB5uEkC8Rh0ZMccD8YzS5G6hR8x6T6L/AP09P8bmH+KuSv8A1ns7O/7K/dnDav646Rc0g2ha1KvvBDjEABCSqFgCJTdEmf7uNcUZyzH3OJ2dhIYRyS4K6lzf15HQ+mRA2VnMY7RYnfBSJHyFejhuLPgdo/0xfqeZ6Pti2HEutRfQSUyAoSQR0TngTXU0mrM8ynNxd48TrfSPb17OzWZ24Xko2z5SkJhawQlHN4Aq+RrGitW0duLm7Ri+PFnKaV0YGW0LD7DpcTN1tV5SOaDDgjA4x2g1rGV3wOecFFJ3TvyPS9PWVHJbSzs0iztWBh1hVwD60l3ELjFRuonHf148kX7Sfjc9OpFbtq2iWh4+sYGu0802H9dUoeP1LkNlSBD6wcVJvLG4HmZARl8Ofu1Sd832z6iG1nGnkyrw8F4X+0claH0qWtaQeepZUkpBupUoEQfazx3V6EYtRSfgkeZOalJyXjc2tGsMuAbVxTadkooMXiSlwhCDA9gRPUN1YVG09Dnllc/Quv6OsYIu2lSgSuchdCUrum9dglSgmOpVZ5pchljzEc0VY5EWsReUDIJIT9ZcUITzphmYyvL4VOaXIslHmVNK2GyobCmHy4u/F0piEQTOWcwOupi5N6os0ktGYFu6B+H5itEa4f8ArRt6pj6g/wDEV+SapLieRth//IX7f7ZsKFQeXc1RYbLOLyomN2V8Cej7POjrj7JNZ5pcjsyUfN99CJqxWYzefI5qCITPOIVtE5YwQmOINTeXIKFPxly/3cRhlKHUFhKbSooclpSC4kquLhJSAL4ukZbwazqzkoNo79l0qU8bShKXstu/poy7t7T/AOy2T/kV1w9pr82fd92bN/U+K+Q9l+03k/8AgtlGIxFhWCMcwd1O0Vn4siWzNnWdqnxRybiYJ7TXqrgfm/iepalWccmsTaW0ratCrTyolAVN0LuBSt2QHwrkqv2n8D1cMv8ApwSWjvc850bopLy3E8oYaCOiXV3QsSQLpjEwPnXTKdraHDCCm2syX7mx6Ok2kvKFmS2AQkvOrbC9kgEk3Z+0oSI3x1SKVsttTowudyaj7zL12eQ5bXlttKaSogpSpBbJhIBXcIEXiCfjxq9LSKRWtK9RtKxoai6HsdpS8La/sQlTZRz0IvEhy90xjEDLjWGJpOpayfuPX2PtCeEz5ba24nT+pmhfvw/5hnyrl7JPyvoe3+Ya/wDj9+8ydbdXNGsWN5yyWraugNgI2ra5BebCjdSJwE1th6EqdRNpnBtLa1TFUHTnbinocsdHWHm/6Ss3sFYAXMYkgpxG/Dq4115p8jw8sOZG7oyx3DctRv3SUhQhJP1kA4c3EN+I/BmnyLZY8xVaKsHOi2KMAlPMgk3uaMRvTHDEHdTNPkXSjzMC1ISla0oN5IUoJV7SQSEnIZiDkK1XAqdbszwNZny2ePMaWjwNLls65jS0eB7qXJzx5jSyrge6puWzx5nQau602qxoLbaUqQTeAWCYJzggjAxlWM6cZO524fHyorKmmjQGv9qCisWazXjgVBCrx7TemqbiHM6u+Z2s7W/cyNZ9ZbRbkoS62hIQoqFwKzIjGSa0hTUHoznr4/fJKVtDn0NrSQpIUCCCDGRBkHvrUwjVine4trLzqy47fWtXSUqSTAAEnsAHworJWRd14yd3IgNmX7Ku6puFWhzRadttrU0GFLeLSYhsk3RGIEcBuFVUY3ua9qTjlctCgbKv2Fd1WuN9T8yIXtGBRKlNLkmSQSJO8xxq6qyRusbDmhEaMuzdadEggwpWIOYOFHVbLLHQXBrqOVY1wAltYCRAwJ3k59pqrld3ZWWJpyd8yIzYnPdr8JpdDtFLzLqMNhd92vwmlyyxNLzLqNNgd92vwmlyyxNLzLqU9J2RxLZKkKAwxIIGYqUzrwlenOqlGSZr6ooJYOH9or/Kmqy4nl7akliF+y/lm0WjwNVueTmXMaWjwPdS5ZTjzGllXA91Lls8eY5guIUFt30qEwUykiQQYIxGBOVHZl6dbJLNF6kpt1r+827/AJhyns8l0O/vWXoA0hawf/M27D/eHKWjyXQd6P06lBTCieie6pOTew5otWa3WppCmmnHkIX0kpJAMiDh1iocYvVmscVlVlLQoGzL9lXdU3K72nzRb0fbbXZ73J1vN3ovXSRMTE95qHGMuJrDFKH9MrFe3rtDy9o8XHFkAXlSTAyE1KSWiJeJhJ3lJFbky4gtqIMHIjETiD8TWlOq6buiVXpr+5DORfuVd58q27XP0Ldoo811FFmUAoJaUJETid4P8qrUxEpqzLLEUea6kJsTnu1+E1jclYil5kMNhd92vwmlyyxFLzLqNNgd92vwmly6xNHzLqN5A77tfhNLlu00fMupoWXXFopG0QsK33QCO0Saq4M4quwKuZ7tq3qS+t9n4OeEedMjMu4cTzj1+hYsesTTphCXI3kgBI7TPyzrKrONNe0aU/w5i6j0y9foI5rKyDHPPYB50jLMr2Evw7iYu149foM9aGODncPOrXK9wYnnHr9DT9f25vBCt+ESMVJIwvbinDtI6qzsrHV3Xi739nq/kOa13bVgG45t0SI6MQJKsMt8DcYmqyaWuv34jurFf49X8iFev7bcIU0tKkXfsQo3bkFWOMhAFaxgprNF3RRbKxSSXs+Hi/D3DE+kZoAcxUhISDd4AYnnYnDPt41O6ZZbMxdv7fj8hD6QmcDs1SIg3eoj2uvLdU7pkd14rTSPV/Id+0Vn3Zyjo44EYzezzx6+oVG6ZPdmL5R+PyGftCZuqTs1c4qPRyvTlzsM/wAqndMr3VisrVo6+r+QrfpDaAAKFmIxI4BA9r+4O80dJhbKxaS/p6v09PQhtGvbC0hJQsRGSQOiCMpgZ49g4UVNopU2Pipxs8vV/Iret9n4OeEedWyMy7hxPNdfoHrfZ+DnhHnTIx3Diea6/QPW+z8HPCPOmRkdw4nmuv0D1vs/BzwjzpkZPcOJ5rr9DP09rEy8wptAXJKYkADBQJ39VTGLTuduz9k1sPXVSbVteBR1c09ye8haSpCjOGYMATjmIA7qtKNzs2nsztTU4u0lzN71vs/BzwjzqmRni9w4nnHr9A9b7Pwc8I86ZGO4cTzj1+get9n4OeEedMjHcOJ5rr9A9b7Pwc8I86ZGO4cTzj1+hfR6Q2QAAheAA6OBASEwedkYFV3TOpbLxS09nq/kO/aMzh9WcCT0d5mY52AxqN0ye7MVyj1fyI0a/sBITs1GMubvvBWV7DL41O6ZVbKxSSVo9X8iRXpHaJB2ZGMkXBBJvEzjxUTUbllu7MXyj9+4Z+0FmQQheAUMRPSic1dXxkmp3TK91Yq6fs9X8hyvSIyc21ZzgmN4MdLIxiOvqFN0yXsvFPwj1fyGOekBggDZHmqBHN4EmDzsRie+m6ZWWycTJWtHq/kSJ9IrIJIbViAMp6KrwzVxmeM1G6ZfuzFLgo9X8hw9JLXuznPRHX/e4kmm5ZPduL5R6v5FO1a8MLiULECMEjz+XbUqm0YVNjYmpa+Xr9CD1vs/Bzwjzq2RmfcOJ5rr9A9b7Pwc8I86ZGO4cTzXX6B632fg54R50yMjuHE811+get9n4OeEedMjJ7hxPNdfoc5ZdWrSsXi0tI6xB7lR8yKs5O9krn1XacP/AHTX8/wW0atup/sZ/icb/wAoV+c1Rxqy+hdYzC87/un8iw/Yn0N/6tRJw5oBCU8AE5T1VzrCVHO7jodPbqOS0ZIw1ggwoEHgRB7jW7i1ozNSUuAqRVGwTNtk5VnKSRNi0mxkZ3U/xKSn5E1g6yfDX3CxPCIurWypI+yolUfwlIlPwNUWe+aMWn6fIqyk9o+zHovXDwgrHwwBHzrqhXrr+qN/gZuTRTXo72XWVdhUP8yRXTGrfimiu9txTIjYl7gk9ikn5A1oncjfw8f4ZXUkjA4GpNU0+AlCQoAoAoAoAoAoAqAFSAoAoAoAoAoAoAoAoAoAoAoAoAoAoAqUAqQFAWC4tw89SlfxEq/OqmLUYLRF+yNpHSSB1xh8Tuqpw1pSfBnQWNuMqrex4tabNMMhYhYChwOP51bfTS49dTkWKq03eMmiladXG1Yt808Psnyqkss1yfp8j0MNt6cHaqrr4nOaRS+0q4obOQYu4BX+L7XxrHs8Iu719fvgfR4fGU8RHNTfzX7ooKVv+Pbkof5SK0t4Gwhw+H8sP+gd9WIE/P8AnJ/nJ+Aq1irY0dXVHwxHmasQ2CRlEnKOOcjDiTUpEFuxaOctLqGWoUu7BJPNABJJJ4CQPhhurnxeKp4am6lTgjTDUpVJZYrj93Oya9GYjnWkzvhvD5qr5if4ps9KfxPV7sdtZfAlHowT95V+GP1Vn+bJfpLqQ9nf5fAen0WJ+9K/DH6qo/xbL9JdSrwH+XwHj0Up+9K/CH6qr+b5fpLqUeC/y+A8eiZH3pX4Q/VUfnCX6S6kdj/y+A8eiNH3pX4Q/VVfzjL9JdSvZfUcPRAj72r8IfqqPznL9JdSvZnzHD0PI+9r/CH66j86S/SXUjs75i/sdR97X+EP11H50l+kupHZ3zEPoeR97V+EP11ZfjOX6S/8iHRfMYr0Qo+9q/CH6q0j+L5P/iXUo4W8SNXomQP9qV+EP1VtH8VSf/GuplJtEK/Ragf7Sr8Mfqroj+I5S/411MJV3HwKz3o1SBhaTPW2P1V109tOXGHxOeWOcfA4zTeh3LK5s3IM4pUOiocR18Rur2aFeNaOaJ10K8a0bxM+tTYKAKAKkBUAKkBQBQBQBVgFAWLPVDnqm3YxVTyqzLrLawTszCREpEEmRPMvYDdhkeqo0OScoNLecXwfz+9DWYeKUhZUFt7zEKTuJO4gbxAIg1VnnVKalJwSyy6p/wDvw5momoPNfEjtVmQ4kocEpP8AUg7j11BrRrzozU6bszhdMaL2C7qiSkyUmMxkQeBAw+PXU6+B9tgMdHFU8y0a4r78CiUg7/6x86srnW2RrRHz/JXnV0RnGkf18f8A8ipArirow6RGfBJ/InPsgbzVrWCjmfp9/wAHU+jC0oTaHEKgKWjmdd0ypI64x/w185+JKc5UIyjwT1PW2bJKo0/FHf6fsTrzNxhzZrvoIXJF0JUCThnhu318lga9KhWz1Y5o2enPl/7PSxNOc4Wg7PQsWuxOqZShLp2gugudC8CChwwnI3VKIGV4J7ayo4ilCtKbh7Lvpx9Vx9Vr6XKVKcnBK+pBZdE2m82XHkqCQoLAKxfC7wVvATCQ0RgcQrETjtUxuGyyUYNN2s7LS3zd7+luNjDdTvqySy6HfShKS5Kg2wNptXCUqQUF2EkEKCiFG8ccYIiqVMdQlJyy6XlplWqd7arhbRW9/EpupLS5dbsFoSEALCiE2hKypak/61wKbWISZKQIjCJwMVzyxOGlKTcbK8WrJeCs1x8SMkkuPMi+hbTIh2UpcQQkuLEouuF0KVdMnaOCBEXW05brraGGs7w1aetlx0t4rwWvqzN05cyxa9FWovrdaeASVhxCFKWAFJZDYCoB5hN4lOUwc6zp43CKjGnOGtrN2XO/Xwvy0KyhK90/uxG1q/aQlKS/eKGX20rvupKi4ptTKlCTBSNsm9JICgRjlee0sM5NqnZOUXa0Xayd7fu8rtovAru2O0noS1OJOydDUhUIDqylJVZXmhDl28YcWhXDmzEgVWhtDCwazwzeuVa+3F8L24Jr4FXTkTN6KtEPi+E7RpKUHarWUrCAklJupuJw3SZJIiYqs8bh24PLe0m3oldX/d3f76eGoytFVehrTKVJdCIWJb2ri0BsvBa0BRAJMJEEjeU4JNdMMdhndOF9ONknfLa9v5Xv4mMkyLSOhn1vOOpeICnLOUJvrAShtTZeEDCVBKhGRnHOt8LjaUKUIShwUr6LVu9uhhMyrFoG1tlkm0A3EBLnOWoqUpKw4vnCCQdmUyPsHKTXpSxuHqKaUOL04K1uC0563/c5ajVtTSszCkIhaioyTxgHdMAnjjx4RVlKMpXirHm12m9EcB6TX0Esowvi8o8Qk3QO8g91fR7Mi8sn4G+zISvKXhocNXpnsBUgKgBUgKAKAKgBUgKlAKkCxUA6CxaPDNm5W4JWtQRZ0RvMy4RvMA3RlgDjIrx6uL3uJ7PF2jFXk/8AXzZzTbk8qFsSjJStKkqGYUCDjxBxr0YzjNXi016annYqm4mw02SQpJhURlII4KFSzyZzSWWSuiV1tYm9cS2vmuxJMHC+JAu4YE44Y7qFITpuySbkv6b26evNdDbFUPHfEWgKGnLDtmVJjnDnI/iG744j41Kep3bOxLw+IjLwej/Y86Bn+v6/od2x9w2SIVUlGh6UgnHLEnsA53yqyWpF7IpuLKiSczjUXN4xypIELIIIJBBkEGCCMiCMjVXFSVnwLXsbbeuNvAgWhWHFKCe8pk15cti4GTu6a+J0LF1krZv4HjXXSH3g+Bv9NV7iwH6a+PzHaq3m/gcNeNIfeD4G/wBNR3Ds/wDTXV/MjtNXzC+vWkfvJ/Da/RUdwbP/AE11fzI7RV8wo180l95P4bX6Kfl/Z36XxfzI39TzC+v2kvvJ/Da/RUfl7Z36XxfzI31TmKPSBpP70r8Nr9FR+Xdm/pLq/mN7PmL+0HSf3pX4bX6Kfl3Zv6S6v5kbyfMX9oWk/vSvw2v0U/Luzf0l1fzG8nzE/aDpP70r8Nr9FSvw7s1f8S6v5kbyfMT1/wBJ/elfhtfoqV+H9nL/AIl1fzIu+Y0696S+8q/Da/RVlsPALhTXV/Mq1cYdd9IfeD4G/wBNaLY+DXCH8lHSi+JGrXG3nO0K8DY/JNax2dho8IfyZvC0nxRivPKWoqWoqUTJJJJJ6ya7IxUVZLQ3jFRVlwGVYkKAKAKAKAKAKAKgCpGNSGXU2QxlVXNGeYQ2RXA49VV3qIzn/9k=',
    date: '2023-06-11T22:00:00',
    views: 23456,
    category: 'Giải trẻ'
  },
  {
    id: 6,
    title: 'Haaland lập kỷ lục ghi bàn tại Premier League trong một mùa giải',
    description: 'Tiền đạo Erling Haaland đã chính thức phá kỷ lục ghi bàn trong một mùa giải Premier League với bàn thắng thứ 36.',
    image: 'https://cdnphoto.dantri.com.vn/0EnF0U2dJmaXaAvRpCClVrJBidA=/thumb_w/1360/2024/11/27/erling-haaland2-1732677603558.jpg',
    date: '2023-06-10T19:30:00',
    views: 34567,
    category: 'Kỷ lục'
  },
];

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  
  // Get current path to set selected menu item
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('news')) return 'news';
    if (path.includes('comments')) return 'reviews';
    if (path.includes('about')) return 'about';
    return 'home';
  };

  const gotoComments = () => {
    navigate('/comments');
  };

  const userMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<ProfileOutlined />}
        onClick={() => navigate('/profile')}
      >
        Xem thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="bill" icon={<BarChartOutlined />} onClick={() => navigate('/payment')}>
        Lịch sử giao dịch
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={() => navigate('/login')}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Format date to relative time (e.g. "2 ngày trước")
  const formatDate = (dateString: string) => {
    return moment(dateString).fromNow();
  };

  // Handle pagination change
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
    window.scrollTo(0, 0);
  };

  // Calculate current news to display
  const getCurrentNews = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return newsData.slice(startIndex, endIndex);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* HEADER */}
      <Header style={{
        background: '#fff',
        padding: screens.xs ? '0 10px' : '0 20px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        zIndex: 10,
        height: 64,
        lineHeight: '64px',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: 20, color: '#1890ff', marginRight: screens.xs ? 12 : 24 }}>
          Football Booking
        </div>
        <Menu 
          mode="horizontal" 
          selectedKeys={[getSelectedKey()]} 
          style={{ 
            flex: 1, 
            borderBottom: 'none',
            minWidth: 0,
            lineHeight: '62px'
          }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/home')}>Trang chủ</Menu.Item>
          <Menu.Item key="news" icon={<ReadOutlined />} onClick={()=> navigate('/news')}>Tin tức</Menu.Item>
          <Menu.Item key="reviews" icon={<StarFilled />} onClick={gotoComments}>Đánh giá</Menu.Item>
        </Menu>
        {!screens.xs && (
          <Space size="middle" style={{ marginLeft: 'auto' }}>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Avatar
                icon={<UserOutlined />}
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
          </Space>
        )}
        {screens.xs && (
          <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
            <Avatar
              icon={<UserOutlined />}
              style={{ cursor: 'pointer', marginLeft: 'auto' }}
            />
          </Dropdown>
        )}
      </Header>

      {/* CONTENT */}
      <Content style={{ padding: screens.xs ? '10px' : '20px 50px' }}>
        {/* Search and Filter Section */}
        <div style={{ 
          marginBottom: 24,
          background: '#fff',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)'
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={16}>
              <Title level={4} style={{ margin: 0 }}>Tin tức bóng đá mới nhất</Title>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Search 
                placeholder="Tìm kiếm tin tức..." 
                enterButton={<SearchOutlined />} 
                size="large"
                allowClear
              />
            </Col>
          </Row>
        </div>

        {/* Main News Content */}
        <div style={{ 
          background: '#fff',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)'
        }}>
          {/* Featured News (only show on desktop) */}
          {screens.md && (
            <>
              <Card
                hoverable
                cover={<img alt="featured-news" src={newsData[0].image} style={{ height: 400, objectFit: 'cover' }} />}
                style={{ marginBottom: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text type="danger" strong>{newsData[0].category}</Text>
                  <Space>
                    <ClockCircleOutlined />
                    <Text type="secondary">{formatDate(newsData[0].date)}</Text>
                  </Space>
                </div>
                <Title level={3} style={{ marginBottom: 12 }}>{newsData[0].title}</Title>
                <Paragraph style={{ fontSize: 16 }}>{newsData[0].description}</Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <Space>
                    <EyeOutlined />
                    <Text type="secondary">{newsData[0].views.toLocaleString()} lượt xem</Text>
                  </Space>
                </div>
              </Card>
              <Divider />
            </>
          )}

          {/* News List */}
          <Row gutter={[16, 16]}>
            {getCurrentNews().map((news, index) => (
              <Col key={news.id} xs={24} sm={12} md={screens.md ? 8 : 12}>
                <Card
                  hoverable
                  cover={<img alt={news.title} src={news.image} style={{ height: 180, objectFit: 'cover' }} />}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text type="danger" strong>{news.category}</Text>
                    <Text type="secondary">{formatDate(news.date)}</Text>
                  </div>
                  <Title level={screens.xs ? 5 : 4} style={{ marginBottom: 8 }}>{news.title}</Title>
                  <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                    {news.description}
                  </Paragraph>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                      <EyeOutlined />
                      <Text type="secondary">{news.views.toLocaleString()}</Text>
                    </Space>
                    <Button type="text" icon={<ShareAltOutlined />} />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Pagination
              current={currentPage}
              total={newsData.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['6', '12', '18', '24']}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default NewsPage;