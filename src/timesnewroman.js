import timesnewroman1 from './assets/fonts/timesnewroman1.png';
import timesnewroman2 from './assets/fonts/timesnewroman2.png';
import { BMFont } from './bmfont';

export const timesnewroman = new BMFont(
  `
info face="Times New Roman" size=72 bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=5,5,5,5 spacing=-2,-2
common lineHeight=92 base=65 scaleW=1024 scaleH=1024 pages=2 packed=0
page id=0 file="timesnewroman1.png"
page id=1 file="timesnewroman2.png"
chars count=536
char id=13      x=0    y=0    width=0    height=0    xoffset=-5   yoffset=0    xadvance=8    page=0    chnl=0 
char id=33      x=998  y=443  width=18   height=60   xoffset=3    yoffset=11   xadvance=32   page=0    chnl=0 
char id=34      x=91   y=990  width=30   height=30   xoffset=0    yoffset=11   xadvance=38   page=0    chnl=0 
char id=35      x=235  y=513  width=42   height=60   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=36      x=371  y=443  width=39   height=67   xoffset=-1   yoffset=8    xadvance=44   page=0    chnl=0 
char id=37      x=277  y=513  width=68   height=60   xoffset=-3   yoffset=11   xadvance=68   page=0    chnl=0 
char id=38      x=345  y=513  width=61   height=60   xoffset=-3   yoffset=11   xadvance=64   page=0    chnl=0 
char id=39      x=1006 y=694  width=17   height=30   xoffset=-2   yoffset=11   xadvance=21   page=0    chnl=0 
char id=40      x=176  y=0    width=30   height=75   xoffset=-2   yoffset=10   xadvance=32   page=0    chnl=0 
char id=41      x=206  y=0    width=30   height=75   xoffset=-4   yoffset=10   xadvance=32   page=0    chnl=0 
char id=44      x=152  y=990  width=21   height=29   xoffset=-2   yoffset=53   xadvance=26   page=0    chnl=0 
char id=45      x=843  y=990  width=28   height=17   xoffset=-2   yoffset=39   xadvance=32   page=0    chnl=0 
char id=46      x=692  y=990  width=18   height=18   xoffset=0    yoffset=53   xadvance=26   page=0    chnl=0 
char id=47      x=712  y=443  width=31   height=61   xoffset=-5   yoffset=10   xadvance=28   page=0    chnl=0 
char id=48      x=406  y=513  width=40   height=60   xoffset=-2   yoffset=11   xadvance=44   page=0    chnl=0 
char id=49      x=88   y=754  width=30   height=59   xoffset=3    yoffset=11   xadvance=44   page=0    chnl=0 
char id=50      x=118  y=754  width=41   height=59   xoffset=-3   yoffset=11   xadvance=44   page=0    chnl=0 
char id=51      x=446  y=513  width=37   height=60   xoffset=-2   yoffset=11   xadvance=44   page=0    chnl=0 
char id=52      x=159  y=754  width=41   height=59   xoffset=-3   yoffset=11   xadvance=44   page=0    chnl=0 
char id=53      x=200  y=754  width=37   height=59   xoffset=-1   yoffset=12   xadvance=44   page=0    chnl=0 
char id=54      x=483  y=513  width=40   height=60   xoffset=-2   yoffset=11   xadvance=44   page=0    chnl=0 
char id=55      x=237  y=754  width=40   height=59   xoffset=-2   yoffset=12   xadvance=44   page=0    chnl=0 
char id=56      x=523  y=513  width=38   height=60   xoffset=-1   yoffset=11   xadvance=44   page=0    chnl=0 
char id=57      x=561  y=513  width=40   height=60   xoffset=-2   yoffset=11   xadvance=44   page=0    chnl=0 
char id=58      x=1004 y=574  width=18   height=44   xoffset=1    yoffset=27   xadvance=28   page=0    chnl=0 
char id=61      x=399  y=990  width=49   height=25   xoffset=-4   yoffset=28   xadvance=49   page=0    chnl=0 
char id=63      x=601  y=513  width=37   height=60   xoffset=-2   yoffset=11   xadvance=41   page=0    chnl=0 
char id=64      x=0    y=0    width=71   height=77   xoffset=-1   yoffset=10   xadvance=74   page=0    chnl=0 
char id=65      x=277  y=754  width=62   height=59   xoffset=-5   yoffset=11   xadvance=59   page=0    chnl=0 
char id=66      x=487  y=873  width=53   height=58   xoffset=-4   yoffset=12   xadvance=56   page=0    chnl=0 
char id=67      x=638  y=513  width=52   height=60   xoffset=-2   yoffset=11   xadvance=56   page=0    chnl=0 
char id=68      x=540  y=873  width=58   height=58   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=69      x=598  y=873  width=51   height=58   xoffset=-4   yoffset=12   xadvance=52   page=0    chnl=0 
char id=70      x=649  y=873  width=47   height=58   xoffset=-4   yoffset=12   xadvance=48   page=0    chnl=0 
char id=71      x=690  y=513  width=58   height=60   xoffset=-2   yoffset=11   xadvance=59   page=0    chnl=0 
char id=72      x=696  y=873  width=61   height=58   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=73      x=757  y=873  width=31   height=58   xoffset=-4   yoffset=12   xadvance=31   page=0    chnl=0 
char id=74      x=339  y=754  width=36   height=59   xoffset=-4   yoffset=12   xadvance=36   page=0    chnl=0 
char id=75      x=788  y=873  width=61   height=58   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=76      x=849  y=873  width=51   height=58   xoffset=-4   yoffset=12   xadvance=52   page=0    chnl=0 
char id=77      x=900  y=873  width=72   height=58   xoffset=-4   yoffset=12   xadvance=72   page=0    chnl=0 
char id=78      x=375  y=754  width=63   height=59   xoffset=-7   yoffset=12   xadvance=60   page=0    chnl=0 
char id=79      x=748  y=513  width=56   height=60   xoffset=-2   yoffset=11   xadvance=60   page=0    chnl=0 
char id=80      x=972  y=873  width=46   height=58   xoffset=-4   yoffset=12   xadvance=48   page=0    chnl=0 
char id=81      x=374  y=226  width=56   height=73   xoffset=-2   yoffset=11   xadvance=60   page=0    chnl=0 
char id=82      x=0    y=932  width=59   height=58   xoffset=-4   yoffset=12   xadvance=56   page=0    chnl=0 
char id=83      x=804  y=513  width=42   height=60   xoffset=-1   yoffset=11   xadvance=48   page=0    chnl=0 
char id=84      x=59   y=932  width=50   height=58   xoffset=-2   yoffset=12   xadvance=53   page=0    chnl=0 
char id=85      x=438  y=754  width=61   height=59   xoffset=-5   yoffset=12   xadvance=60   page=0    chnl=0 
char id=86      x=499  y=754  width=62   height=59   xoffset=-5   yoffset=12   xadvance=61   page=0    chnl=0 
char id=87      x=561  y=754  width=76   height=59   xoffset=-3   yoffset=12   xadvance=76   page=0    chnl=0 
char id=88      x=109  y=932  width=61   height=58   xoffset=-4   yoffset=12   xadvance=61   page=0    chnl=0 
char id=89      x=170  y=932  width=62   height=58   xoffset=-5   yoffset=12   xadvance=60   page=0    chnl=0 
char id=90      x=232  y=932  width=51   height=58   xoffset=-5   yoffset=12   xadvance=51   page=0    chnl=0 
char id=91      x=430  y=226  width=27   height=73   xoffset=1    yoffset=11   xadvance=34   page=0    chnl=0 
char id=92      x=743  y=443  width=31   height=61   xoffset=-5   yoffset=10   xadvance=27   page=0    chnl=0 
char id=93      x=457  y=226  width=27   height=73   xoffset=-3   yoffset=11   xadvance=33   page=0    chnl=0 
char id=96      x=519  y=990  width=22   height=22   xoffset=-1   yoffset=11   xadvance=32   page=0    chnl=0 
char id=98      x=774  y=443  width=43   height=61   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=100     x=817  y=443  width=43   height=61   xoffset=-2   yoffset=10   xadvance=44   page=0    chnl=0 
char id=102     x=846  y=513  width=46   height=60   xoffset=-2   yoffset=10   xadvance=32   page=0    chnl=0 
char id=103     x=283  y=932  width=42   height=58   xoffset=-3   yoffset=27   xadvance=43   page=0    chnl=0 
char id=104     x=892  y=513  width=45   height=60   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=105     x=937  y=513  width=26   height=60   xoffset=-2   yoffset=10   xadvance=28   page=0    chnl=0 
char id=106     x=236  y=0    width=35   height=75   xoffset=-11  yoffset=10   xadvance=29   page=0    chnl=0 
char id=107     x=963  y=513  width=45   height=60   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=108     x=0    y=574  width=26   height=60   xoffset=-2   yoffset=10   xadvance=28   page=0    chnl=0 
char id=112     x=325  y=932  width=43   height=58   xoffset=-4   yoffset=27   xadvance=44   page=0    chnl=0 
char id=113     x=368  y=932  width=43   height=58   xoffset=-2   yoffset=27   xadvance=44   page=0    chnl=0 
char id=123     x=271  y=0    width=31   height=75   xoffset=3    yoffset=10   xadvance=43   page=0    chnl=0 
char id=124     x=71   y=0    width=13   height=76   xoffset=0    yoffset=10   xadvance=21   page=0    chnl=0 
char id=125     x=302  y=0    width=31   height=75   xoffset=1    yoffset=10   xadvance=43   page=0    chnl=0 
char id=126     x=597  y=990  width=47   height=19   xoffset=-4   yoffset=36   xadvance=47   page=0    chnl=0 
char id=160     x=0    y=0    width=0    height=0    xoffset=-5   yoffset=0    xadvance=26   page=0    chnl=0 
char id=161     x=26   y=574  width=18   height=60   xoffset=3    yoffset=26   xadvance=32   page=0    chnl=0 
char id=162     x=587  y=372  width=37   height=70   xoffset=-1   yoffset=13   xadvance=44   page=0    chnl=0 
char id=163     x=44   y=574  width=42   height=60   xoffset=-3   yoffset=11   xadvance=44   page=0    chnl=0 
char id=165     x=411  y=932  width=48   height=58   xoffset=-7   yoffset=12   xadvance=44   page=0    chnl=0 
char id=166     x=84   y=0    width=13   height=76   xoffset=0    yoffset=10   xadvance=21   page=0    chnl=0 
char id=167     x=484  y=226  width=35   height=73   xoffset=1    yoffset=11   xadvance=44   page=0    chnl=0 
char id=168     x=710  y=990  width=31   height=18   xoffset=-3   yoffset=13   xadvance=33   page=0    chnl=0 
char id=169     x=86   y=574  width=60   height=60   xoffset=-2   yoffset=11   xadvance=63   page=0    chnl=0 
char id=170     x=0    y=990  width=29   height=32   xoffset=-5   yoffset=11   xadvance=27   page=0    chnl=0 
char id=172     x=448  y=990  width=48   height=24   xoffset=-4   yoffset=29   xadvance=49   page=0    chnl=0 
char id=174     x=146  y=574  width=60   height=60   xoffset=-2   yoffset=11   xadvance=63   page=0    chnl=0 
char id=176     x=29   y=990  width=32   height=32   xoffset=-2   yoffset=11   xadvance=36   page=0    chnl=0 
char id=180     x=541  y=990  width=22   height=22   xoffset=3    yoffset=11   xadvance=32   page=0    chnl=0 
char id=182     x=814  y=77   width=42   height=74   xoffset=-5   yoffset=12   xadvance=40   page=0    chnl=0 
char id=183     x=741  y=990  width=18   height=18   xoffset=0    yoffset=32   xadvance=26   page=0    chnl=0 
char id=184     x=496  y=990  width=23   height=24   xoffset=2    yoffset=60   xadvance=31   page=0    chnl=0 
char id=186     x=61   y=990  width=30   height=32   xoffset=-4   yoffset=11   xadvance=30   page=0    chnl=0 
char id=188     x=206  y=574  width=59   height=60   xoffset=0    yoffset=11   xadvance=63   page=0    chnl=0 
char id=189     x=265  y=574  width=57   height=60   xoffset=0    yoffset=11   xadvance=62   page=0    chnl=0 
char id=190     x=322  y=574  width=61   height=60   xoffset=-4   yoffset=11   xadvance=62   page=0    chnl=0 
char id=191     x=383  y=574  width=37   height=60   xoffset=-3   yoffset=26   xadvance=40   page=0    chnl=0 
char id=192     x=856  y=77   width=62   height=74   xoffset=-5   yoffset=-4   xadvance=59   page=0    chnl=0 
char id=193     x=918  y=77   width=62   height=74   xoffset=-5   yoffset=-4   xadvance=59   page=0    chnl=0 
char id=194     x=0    y=152  width=62   height=74   xoffset=-5   yoffset=-4   xadvance=59   page=0    chnl=0 
char id=195     x=0    y=372  width=62   height=71   xoffset=-5   yoffset=-1   xadvance=59   page=0    chnl=0 
char id=196     x=624  y=372  width=62   height=70   xoffset=-5   yoffset=0    xadvance=59   page=0    chnl=0 
char id=197     x=145  y=443  width=62   height=69   xoffset=-5   yoffset=1    xadvance=59   page=0    chnl=0 
char id=198     x=459  y=932  width=73   height=58   xoffset=-6   yoffset=12   xadvance=72   page=0    chnl=0 
char id=199     x=519  y=226  width=52   height=73   xoffset=-2   yoffset=11   xadvance=56   page=0    chnl=0 
char id=200     x=62   y=152  width=51   height=74   xoffset=-4   yoffset=-4   xadvance=52   page=0    chnl=0 
char id=201     x=113  y=152  width=51   height=74   xoffset=-4   yoffset=-4   xadvance=52   page=0    chnl=0 
char id=202     x=164  y=152  width=51   height=74   xoffset=-4   yoffset=-4   xadvance=52   page=0    chnl=0 
char id=203     x=686  y=372  width=51   height=70   xoffset=-4   yoffset=0    xadvance=52   page=0    chnl=0 
char id=204     x=980  y=77   width=31   height=74   xoffset=-4   yoffset=-4   xadvance=31   page=0    chnl=0 
char id=205     x=215  y=152  width=31   height=74   xoffset=-4   yoffset=-4   xadvance=31   page=0    chnl=0 
char id=206     x=246  y=152  width=31   height=74   xoffset=-4   yoffset=-4   xadvance=31   page=0    chnl=0 
char id=207     x=737  y=372  width=32   height=70   xoffset=-4   yoffset=0    xadvance=31   page=0    chnl=0 
char id=208     x=532  y=932  width=58   height=58   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=209     x=945  y=226  width=63   height=72   xoffset=-7   yoffset=-1   xadvance=60   page=0    chnl=0 
char id=210     x=333  y=0    width=56   height=75   xoffset=-2   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=211     x=389  y=0    width=56   height=75   xoffset=-2   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=212     x=445  y=0    width=56   height=75   xoffset=-2   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=213     x=0    y=300  width=56   height=72   xoffset=-2   yoffset=-1   xadvance=60   page=0    chnl=0 
char id=214     x=62   y=372  width=56   height=71   xoffset=-2   yoffset=0    xadvance=60   page=0    chnl=0 
char id=216     x=420  y=574  width=57   height=60   xoffset=-3   yoffset=11   xadvance=60   page=0    chnl=0 
char id=217     x=501  y=0    width=61   height=75   xoffset=-5   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=218     x=562  y=0    width=61   height=75   xoffset=-5   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=219     x=623  y=0    width=61   height=75   xoffset=-5   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=220     x=118  y=372  width=61   height=71   xoffset=-5   yoffset=0    xadvance=60   page=0    chnl=0 
char id=221     x=277  y=152  width=62   height=74   xoffset=-5   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=222     x=590  y=932  width=46   height=58   xoffset=-4   yoffset=12   xadvance=48   page=0    chnl=0 
char id=223     x=477  y=574  width=43   height=60   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=224     x=520  y=574  width=40   height=60   xoffset=-2   yoffset=11   xadvance=40   page=0    chnl=0 
char id=225     x=560  y=574  width=40   height=60   xoffset=-2   yoffset=11   xadvance=40   page=0    chnl=0 
char id=226     x=600  y=574  width=40   height=60   xoffset=-2   yoffset=11   xadvance=40   page=0    chnl=0 
char id=229     x=640  y=574  width=40   height=60   xoffset=-2   yoffset=11   xadvance=40   page=0    chnl=0 
char id=232     x=680  y=574  width=37   height=60   xoffset=-3   yoffset=11   xadvance=39   page=0    chnl=0 
char id=233     x=717  y=574  width=37   height=60   xoffset=-3   yoffset=11   xadvance=39   page=0    chnl=0 
char id=234     x=754  y=574  width=37   height=60   xoffset=-3   yoffset=11   xadvance=39   page=0    chnl=0 
char id=236     x=637  y=754  width=26   height=59   xoffset=-2   yoffset=11   xadvance=28   page=0    chnl=0 
char id=237     x=663  y=754  width=26   height=59   xoffset=-2   yoffset=11   xadvance=28   page=0    chnl=0 
char id=238     x=689  y=754  width=30   height=59   xoffset=-4   yoffset=11   xadvance=28   page=0    chnl=0 
char id=240     x=860  y=443  width=41   height=61   xoffset=-2   yoffset=10   xadvance=44   page=0    chnl=0 
char id=242     x=791  y=574  width=41   height=60   xoffset=-3   yoffset=11   xadvance=43   page=0    chnl=0 
char id=243     x=832  y=574  width=41   height=60   xoffset=-3   yoffset=11   xadvance=43   page=0    chnl=0 
char id=244     x=873  y=574  width=41   height=60   xoffset=-3   yoffset=11   xadvance=43   page=0    chnl=0 
char id=249     x=914  y=574  width=45   height=60   xoffset=-4   yoffset=11   xadvance=44   page=0    chnl=0 
char id=250     x=959  y=574  width=45   height=60   xoffset=-4   yoffset=11   xadvance=44   page=0    chnl=0 
char id=251     x=0    y=634  width=45   height=60   xoffset=-4   yoffset=11   xadvance=44   page=0    chnl=0 
char id=253     x=339  y=152  width=45   height=74   xoffset=-5   yoffset=11   xadvance=42   page=0    chnl=0 
char id=254     x=684  y=0    width=43   height=75   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=255     x=769  y=372  width=45   height=70   xoffset=-5   yoffset=15   xadvance=42   page=0    chnl=0 
char id=256     x=567  y=443  width=62   height=66   xoffset=-5   yoffset=4    xadvance=59   page=0    chnl=0 
char id=258     x=179  y=372  width=62   height=71   xoffset=-5   yoffset=-1   xadvance=59   page=0    chnl=0 
char id=260     x=56   y=300  width=65   height=72   xoffset=-5   yoffset=11   xadvance=59   page=0    chnl=0 
char id=262     x=727  y=0    width=52   height=75   xoffset=-2   yoffset=-4   xadvance=56   page=0    chnl=0 
char id=263     x=45   y=634  width=37   height=60   xoffset=-2   yoffset=11   xadvance=40   page=0    chnl=0 
char id=264     x=779  y=0    width=52   height=75   xoffset=-2   yoffset=-4   xadvance=56   page=0    chnl=0 
char id=265     x=82   y=634  width=37   height=60   xoffset=-2   yoffset=11   xadvance=40   page=0    chnl=0 
char id=266     x=814  y=372  width=52   height=70   xoffset=-2   yoffset=1    xadvance=56   page=0    chnl=0 
char id=268     x=831  y=0    width=52   height=75   xoffset=-2   yoffset=-4   xadvance=56   page=0    chnl=0 
char id=269     x=119  y=634  width=37   height=60   xoffset=-2   yoffset=11   xadvance=40   page=0    chnl=0 
char id=270     x=384  y=152  width=58   height=74   xoffset=-4   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=271     x=901  y=443  width=53   height=61   xoffset=-2   yoffset=10   xadvance=55   page=0    chnl=0 
char id=272     x=532  y=932  width=58   height=58   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=273     x=954  y=443  width=44   height=61   xoffset=-2   yoffset=10   xadvance=44   page=0    chnl=0 
char id=274     x=629  y=443  width=51   height=66   xoffset=-4   yoffset=4    xadvance=52   page=0    chnl=0 
char id=276     x=241  y=372  width=51   height=71   xoffset=-4   yoffset=-1   xadvance=52   page=0    chnl=0 
char id=278     x=207  y=443  width=51   height=69   xoffset=-4   yoffset=1    xadvance=52   page=0    chnl=0 
char id=280     x=292  y=372  width=52   height=71   xoffset=-4   yoffset=12   xadvance=52   page=0    chnl=0 
char id=282     x=442  y=152  width=51   height=74   xoffset=-4   yoffset=-4   xadvance=52   page=0    chnl=0 
char id=283     x=156  y=634  width=37   height=60   xoffset=-3   yoffset=11   xadvance=39   page=0    chnl=0 
char id=284     x=883  y=0    width=58   height=75   xoffset=-2   yoffset=-4   xadvance=59   page=0    chnl=0 
char id=285     x=493  y=152  width=42   height=74   xoffset=-3   yoffset=11   xadvance=43   page=0    chnl=0 
char id=286     x=121  y=300  width=58   height=72   xoffset=-2   yoffset=-1   xadvance=59   page=0    chnl=0 
char id=287     x=344  y=372  width=42   height=71   xoffset=-3   yoffset=14   xadvance=43   page=0    chnl=0 
char id=288     x=866  y=372  width=58   height=70   xoffset=-2   yoffset=1    xadvance=59   page=0    chnl=0 
char id=289     x=386  y=372  width=42   height=71   xoffset=-3   yoffset=14   xadvance=43   page=0    chnl=0 
char id=290     x=571  y=226  width=58   height=73   xoffset=-2   yoffset=11   xadvance=59   page=0    chnl=0 
char id=291     x=97   y=0    width=42   height=76   xoffset=-3   yoffset=9    xadvance=43   page=0    chnl=0 
char id=292     x=535  y=152  width=61   height=74   xoffset=-4   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=293     x=596  y=152  width=45   height=74   xoffset=-4   yoffset=-4   xadvance=44   page=0    chnl=0 
char id=294     x=636  y=932  width=61   height=58   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=295     x=193  y=634  width=45   height=60   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=296     x=428  y=372  width=33   height=71   xoffset=-4   yoffset=-1   xadvance=31   page=0    chnl=0 
char id=298     x=680  y=443  width=32   height=66   xoffset=-4   yoffset=4    xadvance=31   page=0    chnl=0 
char id=300     x=461  y=372  width=31   height=71   xoffset=-4   yoffset=-1   xadvance=31   page=0    chnl=0 
char id=302     x=492  y=372  width=34   height=71   xoffset=-4   yoffset=12   xadvance=31   page=0    chnl=0 
char id=303     x=629  y=226  width=32   height=73   xoffset=-2   yoffset=10   xadvance=28   page=0    chnl=0 
char id=304     x=258  y=443  width=31   height=69   xoffset=-4   yoffset=1    xadvance=31   page=0    chnl=0 
char id=306     x=719  y=754  width=59   height=59   xoffset=-4   yoffset=12   xadvance=59   page=0    chnl=0 
char id=307     x=941  y=0    width=41   height=75   xoffset=-2   yoffset=10   xadvance=48   page=0    chnl=0 
char id=308     x=982  y=0    width=36   height=75   xoffset=-4   yoffset=-4   xadvance=36   page=0    chnl=0 
char id=309     x=641  y=152  width=41   height=74   xoffset=-11  yoffset=11   xadvance=29   page=0    chnl=0 
char id=310     x=179  y=300  width=61   height=72   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=311     x=682  y=152  width=45   height=74   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=313     x=727  y=152  width=51   height=74   xoffset=-4   yoffset=-4   xadvance=52   page=0    chnl=0 
char id=314     x=0    y=77   width=26   height=75   xoffset=-2   yoffset=-5   xadvance=28   page=0    chnl=0 
char id=315     x=240  y=300  width=51   height=72   xoffset=-4   yoffset=12   xadvance=52   page=0    chnl=0 
char id=316     x=778  y=152  width=26   height=74   xoffset=-2   yoffset=10   xadvance=28   page=0    chnl=0 
char id=317     x=778  y=754  width=51   height=59   xoffset=-4   yoffset=11   xadvance=52   page=0    chnl=0 
char id=318     x=238  y=634  width=36   height=60   xoffset=-2   yoffset=10   xadvance=37   page=0    chnl=0 
char id=319     x=697  y=932  width=51   height=58   xoffset=-4   yoffset=12   xadvance=52   page=0    chnl=0 
char id=320     x=274  y=634  width=32   height=60   xoffset=-2   yoffset=10   xadvance=33   page=0    chnl=0 
char id=321     x=748  y=932  width=52   height=58   xoffset=-5   yoffset=12   xadvance=52   page=0    chnl=0 
char id=322     x=306  y=634  width=29   height=60   xoffset=-4   yoffset=10   xadvance=28   page=0    chnl=0 
char id=323     x=26   y=77   width=63   height=75   xoffset=-7   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=324     x=829  y=754  width=45   height=59   xoffset=-4   yoffset=11   xadvance=44   page=0    chnl=0 
char id=325     x=291  y=300  width=63   height=72   xoffset=-7   yoffset=12   xadvance=60   page=0    chnl=0 
char id=327     x=89   y=77   width=63   height=75   xoffset=-7   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=328     x=874  y=754  width=45   height=59   xoffset=-4   yoffset=11   xadvance=44   page=0    chnl=0 
char id=329     x=919  y=754  width=53   height=59   xoffset=-5   yoffset=11   xadvance=51   page=0    chnl=0 
char id=330     x=335  y=634  width=57   height=60   xoffset=-4   yoffset=11   xadvance=59   page=0    chnl=0 
char id=331     x=800  y=932  width=40   height=58   xoffset=-4   yoffset=27   xadvance=44   page=0    chnl=0 
char id=332     x=410  y=443  width=56   height=67   xoffset=-2   yoffset=4    xadvance=60   page=0    chnl=0 
char id=334     x=354  y=300  width=56   height=72   xoffset=-2   yoffset=-1   xadvance=60   page=0    chnl=0 
char id=336     x=152  y=77   width=56   height=75   xoffset=-2   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=337     x=392  y=634  width=41   height=60   xoffset=-3   yoffset=11   xadvance=43   page=0    chnl=0 
char id=338     x=433  y=634  width=69   height=60   xoffset=-2   yoffset=11   xadvance=72   page=0    chnl=0 
char id=340     x=804  y=152  width=59   height=74   xoffset=-4   yoffset=-4   xadvance=56   page=0    chnl=0 
char id=341     x=972  y=754  width=33   height=59   xoffset=-4   yoffset=11   xadvance=32   page=0    chnl=0 
char id=342     x=410  y=300  width=59   height=72   xoffset=-4   yoffset=12   xadvance=56   page=0    chnl=0 
char id=344     x=863  y=152  width=59   height=74   xoffset=-4   yoffset=-4   xadvance=56   page=0    chnl=0 
char id=345     x=0    y=814  width=33   height=59   xoffset=-4   yoffset=11   xadvance=32   page=0    chnl=0 
char id=346     x=208  y=77   width=42   height=75   xoffset=-1   yoffset=-4   xadvance=48   page=0    chnl=0 
char id=347     x=502  y=634  width=32   height=60   xoffset=-1   yoffset=11   xadvance=36   page=0    chnl=0 
char id=348     x=250  y=77   width=42   height=75   xoffset=-1   yoffset=-4   xadvance=48   page=0    chnl=0 
char id=349     x=534  y=634  width=32   height=60   xoffset=-1   yoffset=11   xadvance=36   page=0    chnl=0 
char id=350     x=661  y=226  width=42   height=73   xoffset=-1   yoffset=11   xadvance=48   page=0    chnl=0 
char id=352     x=292  y=77   width=42   height=75   xoffset=-1   yoffset=-4   xadvance=48   page=0    chnl=0 
char id=353     x=566  y=634  width=32   height=60   xoffset=-1   yoffset=11   xadvance=36   page=0    chnl=0 
char id=354     x=703  y=226  width=51   height=73   xoffset=-3   yoffset=12   xadvance=52   page=0    chnl=0 
char id=355     x=340  y=443  width=31   height=68   xoffset=-5   yoffset=17   xadvance=28   page=0    chnl=0 
char id=356     x=922  y=152  width=50   height=74   xoffset=-2   yoffset=-4   xadvance=53   page=0    chnl=0 
char id=357     x=0    y=513  width=41   height=61   xoffset=-5   yoffset=10   xadvance=39   page=0    chnl=0 
char id=358     x=840  y=932  width=50   height=58   xoffset=-2   yoffset=12   xadvance=53   page=0    chnl=0 
char id=360     x=469  y=300  width=61   height=72   xoffset=-5   yoffset=-1   xadvance=60   page=0    chnl=0 
char id=361     x=890  y=932  width=45   height=58   xoffset=-4   yoffset=13   xadvance=44   page=0    chnl=0 
char id=362     x=466  y=443  width=61   height=67   xoffset=-5   yoffset=4    xadvance=60   page=0    chnl=0 
char id=364     x=530  y=300  width=61   height=72   xoffset=-5   yoffset=-1   xadvance=60   page=0    chnl=0 
char id=366     x=334  y=77   width=61   height=75   xoffset=-5   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=367     x=598  y=634  width=45   height=60   xoffset=-4   yoffset=11   xadvance=44   page=0    chnl=0 
char id=368     x=395  y=77   width=61   height=75   xoffset=-5   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=369     x=643  y=634  width=45   height=60   xoffset=-4   yoffset=11   xadvance=44   page=0    chnl=0 
char id=370     x=526  y=372  width=61   height=71   xoffset=-5   yoffset=12   xadvance=60   page=0    chnl=0 
char id=372     x=456  y=77   width=76   height=75   xoffset=-3   yoffset=-4   xadvance=76   page=0    chnl=0 
char id=373     x=688  y=634  width=63   height=60   xoffset=-5   yoffset=11   xadvance=60   page=0    chnl=0 
char id=374     x=0    y=226  width=62   height=74   xoffset=-5   yoffset=-4   xadvance=60   page=0    chnl=0 
char id=375     x=972  y=152  width=45   height=74   xoffset=-5   yoffset=11   xadvance=42   page=0    chnl=0 
char id=376     x=924  y=372  width=62   height=70   xoffset=-5   yoffset=0    xadvance=60   page=0    chnl=0 
char id=377     x=62   y=226  width=51   height=74   xoffset=-5   yoffset=-4   xadvance=51   page=0    chnl=0 
char id=378     x=33   y=814  width=39   height=59   xoffset=-4   yoffset=11   xadvance=40   page=0    chnl=0 
char id=379     x=289  y=443  width=51   height=69   xoffset=-5   yoffset=1    xadvance=51   page=0    chnl=0 
char id=381     x=113  y=226  width=51   height=74   xoffset=-5   yoffset=-4   xadvance=51   page=0    chnl=0 
char id=382     x=72   y=814  width=39   height=59   xoffset=-4   yoffset=11   xadvance=40   page=0    chnl=0 
char id=383     x=751  y=634  width=46   height=60   xoffset=-3   yoffset=10   xadvance=28   page=0    chnl=0 
char id=900     x=541  y=990  width=22   height=22   xoffset=3    yoffset=11   xadvance=32   page=0    chnl=0 
char id=901     x=563  y=990  width=34   height=22   xoffset=-5   yoffset=11   xadvance=32   page=0    chnl=0 
char id=902     x=111  y=814  width=62   height=59   xoffset=-5   yoffset=11   xadvance=59   page=0    chnl=0 
char id=903     x=759  y=990  width=18   height=18   xoffset=1    yoffset=27   xadvance=28   page=0    chnl=0 
char id=904     x=173  y=814  width=69   height=59   xoffset=-11  yoffset=11   xadvance=58   page=0    chnl=0 
char id=905     x=242  y=814  width=79   height=59   xoffset=-12  yoffset=11   xadvance=66   page=0    chnl=0 
char id=906     x=321  y=814  width=50   height=59   xoffset=-12  yoffset=11   xadvance=38   page=0    chnl=0 
char id=908     x=797  y=634  width=65   height=60   xoffset=-9   yoffset=11   xadvance=60   page=0    chnl=0 
char id=910     x=371  y=814  width=80   height=59   xoffset=-12  yoffset=11   xadvance=67   page=0    chnl=0 
char id=911     x=451  y=814  width=68   height=59   xoffset=-9   yoffset=11   xadvance=62   page=0    chnl=0 
char id=912     x=862  y=634  width=39   height=60   xoffset=-7   yoffset=11   xadvance=27   page=0    chnl=0 
char id=913     x=519  y=814  width=62   height=59   xoffset=-5   yoffset=11   xadvance=59   page=0    chnl=0 
char id=914     x=935  y=932  width=53   height=58   xoffset=-4   yoffset=12   xadvance=56   page=0    chnl=0 
char id=916     x=581  y=814  width=54   height=59   xoffset=-4   yoffset=11   xadvance=54   page=0    chnl=0 
char id=920     x=901  y=634  width=56   height=60   xoffset=-2   yoffset=11   xadvance=60   page=0    chnl=0 
char id=921     x=988  y=932  width=31   height=58   xoffset=-4   yoffset=12   xadvance=31   page=0    chnl=0 
char id=923     x=635  y=814  width=61   height=59   xoffset=-4   yoffset=11   xadvance=60   page=0    chnl=0 
char id=925     x=696  y=814  width=63   height=59   xoffset=-7   yoffset=12   xadvance=60   page=0    chnl=0 
char id=927     x=957  y=634  width=56   height=60   xoffset=-2   yoffset=11   xadvance=60   page=0    chnl=0 
char id=937     x=759  y=814  width=60   height=59   xoffset=-3   yoffset=11   xadvance=62   page=0    chnl=0 
char id=938     x=986  y=372  width=32   height=70   xoffset=-4   yoffset=0    xadvance=31   page=0    chnl=0 
char id=939     x=0    y=443  width=62   height=70   xoffset=-5   yoffset=0    xadvance=60   page=0    chnl=0 
char id=940     x=0    y=694  width=44   height=60   xoffset=-2   yoffset=11   xadvance=46   page=0    chnl=0 
char id=941     x=44   y=694  width=37   height=60   xoffset=-2   yoffset=11   xadvance=38   page=0    chnl=0 
char id=942     x=164  y=226  width=44   height=74   xoffset=-4   yoffset=11   xadvance=46   page=0    chnl=0 
char id=943     x=81   y=694  width=28   height=60   xoffset=-3   yoffset=11   xadvance=27   page=0    chnl=0 
char id=944     x=109  y=694  width=43   height=60   xoffset=-5   yoffset=11   xadvance=44   page=0    chnl=0 
char id=946     x=532  y=77   width=41   height=75   xoffset=-2   yoffset=10   xadvance=45   page=0    chnl=0 
char id=948     x=41   y=513  width=39   height=61   xoffset=-2   yoffset=10   xadvance=42   page=0    chnl=0 
char id=950     x=573  y=77   width=37   height=75   xoffset=-3   yoffset=10   xadvance=38   page=0    chnl=0 
char id=952     x=152  y=694  width=39   height=60   xoffset=-2   yoffset=11   xadvance=42   page=0    chnl=0 
char id=955     x=80   y=513  width=44   height=61   xoffset=-3   yoffset=10   xadvance=43   page=0    chnl=0 
char id=958     x=610  y=77   width=39   height=75   xoffset=-3   yoffset=10   xadvance=40   page=0    chnl=0 
char id=972     x=191  y=694  width=41   height=60   xoffset=-3   yoffset=11   xadvance=43   page=0    chnl=0 
char id=973     x=232  y=694  width=43   height=60   xoffset=-5   yoffset=11   xadvance=44   page=0    chnl=0 
char id=974     x=275  y=694  width=52   height=60   xoffset=-2   yoffset=11   xadvance=55   page=0    chnl=0 
char id=1025    x=62   y=443  width=51   height=70   xoffset=-4   yoffset=0    xadvance=52   page=0    chnl=0 
char id=1026    x=819  y=814  width=60   height=59   xoffset=-3   yoffset=12   xadvance=62   page=0    chnl=0 
char id=1027    x=208  y=226  width=49   height=74   xoffset=-4   yoffset=-4   xadvance=50   page=0    chnl=0 
char id=1028    x=327  y=694  width=53   height=60   xoffset=-2   yoffset=11   xadvance=56   page=0    chnl=0 
char id=1029    x=380  y=694  width=42   height=60   xoffset=-1   yoffset=11   xadvance=48   page=0    chnl=0 
char id=1031    x=113  y=443  width=32   height=70   xoffset=-4   yoffset=0    xadvance=31   page=0    chnl=0 
char id=1032    x=879  y=814  width=36   height=59   xoffset=-4   yoffset=12   xadvance=36   page=0    chnl=0 
char id=1033    x=915  y=814  width=69   height=59   xoffset=-4   yoffset=12   xadvance=71   page=0    chnl=0 
char id=1036    x=257  y=226  width=58   height=74   xoffset=-4   yoffset=-4   xadvance=56   page=0    chnl=0 
char id=1038    x=315  y=226  width=59   height=74   xoffset=-4   yoffset=-3   xadvance=59   page=0    chnl=0 
char id=1039    x=591  y=300  width=61   height=72   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=1040    x=0    y=873  width=62   height=59   xoffset=-5   yoffset=11   xadvance=59   page=0    chnl=0 
char id=1044    x=652  y=300  width=57   height=72   xoffset=-3   yoffset=12   xadvance=57   page=0    chnl=0 
char id=1046    x=62   y=873  width=73   height=59   xoffset=-4   yoffset=11   xadvance=73   page=0    chnl=0 
char id=1047    x=422  y=694  width=42   height=60   xoffset=-4   yoffset=11   xadvance=44   page=0    chnl=0 
char id=1049    x=754  y=226  width=61   height=73   xoffset=-4   yoffset=-3   xadvance=60   page=0    chnl=0 
char id=1050    x=135  y=873  width=58   height=59   xoffset=-4   yoffset=11   xadvance=56   page=0    chnl=0 
char id=1051    x=193  y=873  width=57   height=59   xoffset=-3   yoffset=12   xadvance=57   page=0    chnl=0 
char id=1054    x=464  y=694  width=56   height=60   xoffset=-2   yoffset=11   xadvance=60   page=0    chnl=0 
char id=1057    x=520  y=694  width=52   height=60   xoffset=-2   yoffset=11   xadvance=56   page=0    chnl=0 
char id=1059    x=250  y=873  width=59   height=59   xoffset=-4   yoffset=12   xadvance=59   page=0    chnl=0 
char id=1062    x=709  y=300  width=61   height=72   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=1065    x=770  y=300  width=81   height=72   xoffset=-4   yoffset=12   xadvance=81   page=0    chnl=0 
char id=1069    x=572  y=694  width=53   height=60   xoffset=-3   yoffset=11   xadvance=56   page=0    chnl=0 
char id=1070    x=625  y=694  width=80   height=60   xoffset=-4   yoffset=11   xadvance=82   page=0    chnl=0 
char id=1073    x=124  y=513  width=42   height=61   xoffset=-2   yoffset=10   xadvance=45   page=0    chnl=0 
char id=1092    x=649  y=77   width=51   height=75   xoffset=-2   yoffset=10   xadvance=55   page=0    chnl=0 
char id=1106    x=700  y=77   width=40   height=75   xoffset=-4   yoffset=10   xadvance=43   page=0    chnl=0 
char id=1107    x=984  y=814  width=38   height=59   xoffset=-3   yoffset=11   xadvance=38   page=0    chnl=0 
char id=1110    x=705  y=694  width=26   height=60   xoffset=-2   yoffset=10   xadvance=28   page=0    chnl=0 
char id=1112    x=740  y=77   width=35   height=75   xoffset=-11  yoffset=10   xadvance=29   page=0    chnl=0 
char id=1115    x=731  y=694  width=45   height=60   xoffset=-4   yoffset=10   xadvance=44   page=0    chnl=0 
char id=1116    x=309  y=873  width=43   height=59   xoffset=-3   yoffset=11   xadvance=43   page=0    chnl=0 
char id=1118    x=851  y=300  width=46   height=72   xoffset=-5   yoffset=13   xadvance=44   page=0    chnl=0 
char id=1168    x=527  y=443  width=40   height=67   xoffset=-4   yoffset=3    xadvance=40   page=0    chnl=0 
char id=1174    x=815  y=226  width=73   height=73   xoffset=-4   yoffset=11   xadvance=73   page=0    chnl=0 
char id=1178    x=888  y=226  width=57   height=73   xoffset=-4   yoffset=11   xadvance=56   page=0    chnl=0 
char id=1180    x=352  y=873  width=57   height=59   xoffset=-4   yoffset=11   xadvance=56   page=0    chnl=0 
char id=1186    x=897  y=300  width=61   height=72   xoffset=-4   yoffset=12   xadvance=60   page=0    chnl=0 
char id=1202    x=958  y=300  width=60   height=72   xoffset=-4   yoffset=12   xadvance=61   page=0    chnl=0 
char id=1240    x=776  y=694  width=57   height=60   xoffset=-3   yoffset=11   xadvance=60   page=0    chnl=0 
char id=1256    x=833  y=694  width=56   height=60   xoffset=-2   yoffset=11   xadvance=60   page=0    chnl=0 
char id=8204    x=0    y=0    width=0    height=0    xoffset=-5   yoffset=0    xadvance=8    page=0    chnl=0 
char id=8213    x=871  y=990  width=78   height=15   xoffset=-3   yoffset=39   xadvance=80   page=0    chnl=0 
char id=8215    x=644  y=990  width=48   height=19   xoffset=-6   yoffset=67   xadvance=44   page=0    chnl=0 
char id=8216    x=173  y=990  width=21   height=29   xoffset=1    yoffset=11   xadvance=32   page=0    chnl=0 
char id=8217    x=194  y=990  width=21   height=29   xoffset=1    yoffset=11   xadvance=32   page=0    chnl=0 
char id=8218    x=215  y=990  width=21   height=29   xoffset=2    yoffset=53   xadvance=32   page=0    chnl=0 
char id=8219    x=350  y=990  width=21   height=28   xoffset=1    yoffset=11   xadvance=32   page=0    chnl=0 
char id=8220    x=236  y=990  width=38   height=29   xoffset=-3   yoffset=11   xadvance=41   page=0    chnl=0 
char id=8221    x=274  y=990  width=38   height=29   xoffset=-3   yoffset=11   xadvance=40   page=0    chnl=0 
char id=8222    x=312  y=990  width=38   height=29   xoffset=-3   yoffset=53   xadvance=41   page=0    chnl=0 
char id=8224    x=775  y=77   width=39   height=75   xoffset=-2   yoffset=10   xadvance=44   page=0    chnl=0 
char id=8225    x=139  y=0    width=37   height=76   xoffset=-1   yoffset=10   xadvance=44   page=0    chnl=0 
char id=8226    x=371  y=990  width=28   height=28   xoffset=-2   yoffset=28   xadvance=33   page=0    chnl=0 
char id=8230    x=777  y=990  width=66   height=18   xoffset=3    yoffset=53   xadvance=80   page=0    chnl=0 
char id=8240    x=889  y=694  width=82   height=60   xoffset=-3   yoffset=11   xadvance=80   page=0    chnl=0 
char id=8242    x=1005 y=754  width=18   height=30   xoffset=0    yoffset=11   xadvance=22   page=0    chnl=0 
char id=8243    x=121  y=990  width=31   height=30   xoffset=1    yoffset=11   xadvance=38   page=0    chnl=0 
char id=8252    x=971  y=694  width=35   height=60   xoffset=3    yoffset=11   xadvance=49   page=0    chnl=0 
char id=8254    x=949  y=990  width=38   height=15   xoffset=-6   yoffset=16   xadvance=32   page=0    chnl=0 
char id=8260    x=166  y=513  width=69   height=61   xoffset=-17  yoffset=10   xadvance=20   page=0    chnl=0 
char id=8356    x=0    y=754  width=42   height=60   xoffset=-3   yoffset=11   xadvance=44   page=0    chnl=0 
char id=8359    x=409  y=873  width=78   height=59   xoffset=-3   yoffset=12   xadvance=78   page=0    chnl=0 
char id=8364    x=42   y=754  width=46   height=60   xoffset=-6   yoffset=11   xadvance=44   page=0    chnl=0 
char id=0       x=861  y=174  width=46   height=55   xoffset=5    yoffset=15   xadvance=64   page=1    chnl=0 
char id=42      x=832  y=373  width=35   height=39   xoffset=0    yoffset=10   xadvance=43   page=1    chnl=0 
char id=43      x=754  y=231  width=47   height=47   xoffset=-4   yoffset=17   xadvance=49   page=1    chnl=0 
char id=59      x=907  y=174  width=21   height=55   xoffset=0    yoffset=27   xadvance=28   page=1    chnl=0 
char id=60      x=893  y=231  width=48   height=45   xoffset=-4   yoffset=18   xadvance=49   page=1    chnl=0 
char id=62      x=941  y=231  width=48   height=45   xoffset=-3   yoffset=18   xadvance=49   page=1    chnl=0 
char id=94      x=952  y=373  width=42   height=35   xoffset=-4   yoffset=11   xadvance=42   page=1    chnl=0 
char id=95      x=52   y=415  width=48   height=13   xoffset=-6   yoffset=72   xadvance=44   page=1    chnl=0 
char id=97      x=0    y=285  width=40   height=44   xoffset=-2   yoffset=27   xadvance=40   page=1    chnl=0 
char id=99      x=40   y=285  width=37   height=44   xoffset=-2   yoffset=27   xadvance=40   page=1    chnl=0 
char id=101     x=77   y=285  width=37   height=44   xoffset=-3   yoffset=27   xadvance=39   page=1    chnl=0 
char id=109     x=41   y=329  width=64   height=43   xoffset=-4   yoffset=27   xadvance=63   page=1    chnl=0 
char id=110     x=105  y=329  width=45   height=43   xoffset=-4   yoffset=27   xadvance=44   page=1    chnl=0 
char id=111     x=114  y=285  width=41   height=44   xoffset=-3   yoffset=27   xadvance=43   page=1    chnl=0 
char id=114     x=150  y=329  width=33   height=43   xoffset=-4   yoffset=27   xadvance=32   page=1    chnl=0 
char id=115     x=989  y=231  width=32   height=44   xoffset=-1   yoffset=27   xadvance=36   page=1    chnl=0 
char id=116     x=0    y=231  width=30   height=54   xoffset=-5   yoffset=17   xadvance=28   page=1    chnl=0 
char id=117     x=183  y=329  width=45   height=43   xoffset=-4   yoffset=28   xadvance=44   page=1    chnl=0 
char id=118     x=228  y=329  width=45   height=43   xoffset=-5   yoffset=28   xadvance=43   page=1    chnl=0 
char id=119     x=273  y=329  width=63   height=43   xoffset=-5   yoffset=28   xadvance=60   page=1    chnl=0 
char id=120     x=738  y=329  width=44   height=42   xoffset=-4   yoffset=28   xadvance=43   page=1    chnl=0 
char id=121     x=500  y=116  width=45   height=57   xoffset=-5   yoffset=28   xadvance=42   page=1    chnl=0 
char id=122     x=782  y=329  width=39   height=42   xoffset=-4   yoffset=28   xadvance=40   page=1    chnl=0 
char id=164     x=155  y=285  width=44   height=44   xoffset=-4   yoffset=20   xadvance=44   page=1    chnl=0 
char id=171     x=336  y=329  width=39   height=43   xoffset=-3   yoffset=27   xadvance=42   page=1    chnl=0 
char id=175     x=100  y=415  width=47   height=13   xoffset=-5   yoffset=6    xadvance=44   page=1    chnl=0 
char id=177     x=801  y=231  width=47   height=47   xoffset=-5   yoffset=17   xadvance=47   page=1    chnl=0 
char id=178     x=0    y=415  width=30   height=35   xoffset=-4   yoffset=11   xadvance=30   page=1    chnl=0 
char id=179     x=994  y=373  width=27   height=35   xoffset=-4   yoffset=11   xadvance=29   page=1    chnl=0 
char id=181     x=545  y=116  width=42   height=57   xoffset=0    yoffset=28   xadvance=49   page=1    chnl=0 
char id=185     x=30   y=415  width=22   height=35   xoffset=0    yoffset=11   xadvance=30   page=1    chnl=0 
char id=187     x=375  y=329  width=39   height=43   xoffset=-3   yoffset=27   xadvance=42   page=1    chnl=0 
char id=215     x=867  y=373  width=37   height=37   xoffset=2    yoffset=23   xadvance=49   page=1    chnl=0 
char id=227     x=587  y=116  width=40   height=57   xoffset=-2   yoffset=14   xadvance=40   page=1    chnl=0 
char id=228     x=453  y=174  width=40   height=56   xoffset=-2   yoffset=15   xadvance=40   page=1    chnl=0 
char id=230     x=199  y=285  width=53   height=44   xoffset=-2   yoffset=27   xadvance=56   page=1    chnl=0 
char id=231     x=627  y=116  width=37   height=57   xoffset=-2   yoffset=27   xadvance=40   page=1    chnl=0 
char id=235     x=493  y=174  width=37   height=56   xoffset=-3   yoffset=15   xadvance=39   page=1    chnl=0 
char id=239     x=928  y=174  width=31   height=55   xoffset=-4   yoffset=15   xadvance=28   page=1    chnl=0 
char id=241     x=530  y=174  width=45   height=56   xoffset=-4   yoffset=14   xadvance=44   page=1    chnl=0 
char id=245     x=664  y=116  width=41   height=57   xoffset=-3   yoffset=14   xadvance=43   page=1    chnl=0 
char id=246     x=575  y=174  width=41   height=56   xoffset=-3   yoffset=15   xadvance=43   page=1    chnl=0 
char id=247     x=904  y=373  width=48   height=37   xoffset=-4   yoffset=23   xadvance=48   page=1    chnl=0 
char id=248     x=848  y=231  width=45   height=47   xoffset=-4   yoffset=26   xadvance=44   page=1    chnl=0 
char id=252     x=616  y=174  width=45   height=56   xoffset=-4   yoffset=15   xadvance=44   page=1    chnl=0 
char id=257     x=30   y=231  width=40   height=54   xoffset=-2   yoffset=17   xadvance=40   page=1    chnl=0 
char id=259     x=705  y=116  width=40   height=57   xoffset=-2   yoffset=14   xadvance=40   page=1    chnl=0 
char id=261     x=661  y=174  width=49   height=56   xoffset=-2   yoffset=27   xadvance=40   page=1    chnl=0 
char id=267     x=745  y=116  width=37   height=57   xoffset=-2   yoffset=14   xadvance=40   page=1    chnl=0 
char id=275     x=70   y=231  width=37   height=54   xoffset=-3   yoffset=17   xadvance=39   page=1    chnl=0 
char id=277     x=782  y=116  width=37   height=57   xoffset=-3   yoffset=14   xadvance=39   page=1    chnl=0 
char id=279     x=819  y=116  width=37   height=57   xoffset=-3   yoffset=14   xadvance=39   page=1    chnl=0 
char id=281     x=710  y=174  width=39   height=56   xoffset=-3   yoffset=27   xadvance=39   page=1    chnl=0 
char id=297     x=856  y=116  width=35   height=57   xoffset=-5   yoffset=13   xadvance=28   page=1    chnl=0 
char id=299     x=262  y=231  width=34   height=53   xoffset=-5   yoffset=17   xadvance=28   page=1    chnl=0 
char id=301     x=891  y=116  width=29   height=57   xoffset=-4   yoffset=13   xadvance=28   page=1    chnl=0 
char id=305     x=993  y=285  width=26   height=43   xoffset=-2   yoffset=27   xadvance=28   page=1    chnl=0 
char id=312     x=821  y=329  width=45   height=42   xoffset=-4   yoffset=28   xadvance=44   page=1    chnl=0 
char id=326     x=920  y=116  width=45   height=57   xoffset=-4   yoffset=27   xadvance=44   page=1    chnl=0 
char id=333     x=107  y=231  width=41   height=54   xoffset=-3   yoffset=17   xadvance=43   page=1    chnl=0 
char id=335     x=965  y=116  width=41   height=57   xoffset=-3   yoffset=14   xadvance=43   page=1    chnl=0 
char id=339     x=252  y=285  width=58   height=44   xoffset=-2   yoffset=27   xadvance=60   page=1    chnl=0 
char id=343     x=0    y=174  width=33   height=57   xoffset=-4   yoffset=27   xadvance=32   page=1    chnl=0 
char id=351     x=33   y=174  width=32   height=57   xoffset=-1   yoffset=27   xadvance=36   page=1    chnl=0 
char id=359     x=148  y=231  width=30   height=54   xoffset=-5   yoffset=17   xadvance=28   page=1    chnl=0 
char id=363     x=178  y=231  width=45   height=54   xoffset=-4   yoffset=17   xadvance=44   page=1    chnl=0 
char id=365     x=65   y=174  width=45   height=57   xoffset=-4   yoffset=14   xadvance=44   page=1    chnl=0 
char id=371     x=959  y=174  width=50   height=55   xoffset=-4   yoffset=28   xadvance=44   page=1    chnl=0 
char id=380     x=223  y=231  width=39   height=54   xoffset=-4   yoffset=16   xadvance=40   page=1    chnl=0 
char id=915     x=0    y=0    width=49   height=58   xoffset=-4   yoffset=12   xadvance=50   page=1    chnl=0 
char id=917     x=49   y=0    width=51   height=58   xoffset=-4   yoffset=12   xadvance=52   page=1    chnl=0 
char id=918     x=100  y=0    width=51   height=58   xoffset=-5   yoffset=12   xadvance=51   page=1    chnl=0 
char id=919     x=151  y=0    width=61   height=58   xoffset=-4   yoffset=12   xadvance=60   page=1    chnl=0 
char id=922     x=212  y=0    width=61   height=58   xoffset=-4   yoffset=12   xadvance=60   page=1    chnl=0 
char id=924     x=273  y=0    width=72   height=58   xoffset=-4   yoffset=12   xadvance=72   page=1    chnl=0 
char id=926     x=345  y=0    width=51   height=58   xoffset=-2   yoffset=12   xadvance=54   page=1    chnl=0 
char id=928     x=396  y=0    width=61   height=58   xoffset=-4   yoffset=12   xadvance=60   page=1    chnl=0 
char id=929     x=457  y=0    width=46   height=58   xoffset=-4   yoffset=12   xadvance=48   page=1    chnl=0 
char id=931     x=503  y=0    width=49   height=58   xoffset=-4   yoffset=12   xadvance=50   page=1    chnl=0 
char id=932     x=552  y=0    width=50   height=58   xoffset=-2   yoffset=12   xadvance=53   page=1    chnl=0 
char id=933     x=602  y=0    width=62   height=58   xoffset=-5   yoffset=12   xadvance=60   page=1    chnl=0 
char id=934     x=664  y=0    width=57   height=58   xoffset=-2   yoffset=12   xadvance=61   page=1    chnl=0 
char id=935     x=721  y=0    width=61   height=58   xoffset=-4   yoffset=12   xadvance=61   page=1    chnl=0 
char id=936     x=782  y=0    width=61   height=58   xoffset=-4   yoffset=12   xadvance=61   page=1    chnl=0 
char id=945     x=310  y=285  width=44   height=44   xoffset=-2   yoffset=27   xadvance=46   page=1    chnl=0 
char id=947     x=110  y=174  width=41   height=57   xoffset=-5   yoffset=28   xadvance=40   page=1    chnl=0 
char id=949     x=354  y=285  width=37   height=44   xoffset=-2   yoffset=27   xadvance=38   page=1    chnl=0 
char id=951     x=843  y=0    width=44   height=58   xoffset=-4   yoffset=27   xadvance=46   page=1    chnl=0 
char id=953     x=391  y=285  width=28   height=44   xoffset=-3   yoffset=27   xadvance=27   page=1    chnl=0 
char id=954     x=414  y=329  width=46   height=43   xoffset=-4   yoffset=27   xadvance=44   page=1    chnl=0 
char id=956     x=151  y=174  width=44   height=57   xoffset=-1   yoffset=28   xadvance=47   page=1    chnl=0 
char id=957     x=419  y=285  width=44   height=44   xoffset=-6   yoffset=27   xadvance=41   page=1    chnl=0 
char id=959     x=463  y=285  width=41   height=44   xoffset=-3   yoffset=27   xadvance=43   page=1    chnl=0 
char id=960     x=460  y=329  width=45   height=43   xoffset=-5   yoffset=28   xadvance=44   page=1    chnl=0 
char id=961     x=887  y=0    width=41   height=58   xoffset=-3   yoffset=27   xadvance=44   page=1    chnl=0 
char id=962     x=928  y=0    width=35   height=58   xoffset=-3   yoffset=27   xadvance=37   page=1    chnl=0 
char id=963     x=505  y=329  width=45   height=43   xoffset=-2   yoffset=28   xadvance=47   page=1    chnl=0 
char id=964     x=550  y=329  width=37   height=43   xoffset=-4   yoffset=28   xadvance=37   page=1    chnl=0 
char id=965     x=504  y=285  width=43   height=44   xoffset=-5   yoffset=27   xadvance=44   page=1    chnl=0 
char id=966     x=963  y=0    width=47   height=58   xoffset=-2   yoffset=27   xadvance=50   page=1    chnl=0 
char id=967     x=195  y=174  width=44   height=57   xoffset=-4   yoffset=28   xadvance=40   page=1    chnl=0 
char id=968     x=0    y=58   width=54   height=58   xoffset=-4   yoffset=27   xadvance=53   page=1    chnl=0 
char id=969     x=547  y=285  width=52   height=44   xoffset=-2   yoffset=27   xadvance=55   page=1    chnl=0 
char id=970     x=749  y=174  width=32   height=56   xoffset=-5   yoffset=15   xadvance=27   page=1    chnl=0 
char id=971     x=781  y=174  width=43   height=56   xoffset=-5   yoffset=15   xadvance=44   page=1    chnl=0 
char id=1030    x=54   y=58   width=31   height=58   xoffset=-4   yoffset=12   xadvance=31   page=1    chnl=0 
char id=1034    x=85   y=58   width=69   height=58   xoffset=-4   yoffset=12   xadvance=71   page=1    chnl=0 
char id=1035    x=154  y=58   width=60   height=58   xoffset=-3   yoffset=12   xadvance=61   page=1    chnl=0 
char id=1041    x=214  y=58   width=48   height=58   xoffset=-4   yoffset=12   xadvance=49   page=1    chnl=0 
char id=1042    x=262  y=58   width=53   height=58   xoffset=-4   yoffset=12   xadvance=56   page=1    chnl=0 
char id=1043    x=315  y=58   width=49   height=58   xoffset=-4   yoffset=12   xadvance=50   page=1    chnl=0 
char id=1052    x=364  y=58   width=72   height=58   xoffset=-4   yoffset=12   xadvance=72   page=1    chnl=0 
char id=1053    x=436  y=58   width=61   height=58   xoffset=-4   yoffset=12   xadvance=60   page=1    chnl=0 
char id=1055    x=497  y=58   width=61   height=58   xoffset=-4   yoffset=12   xadvance=60   page=1    chnl=0 
char id=1056    x=558  y=58   width=46   height=58   xoffset=-4   yoffset=12   xadvance=48   page=1    chnl=0 
char id=1058    x=604  y=58   width=50   height=58   xoffset=-2   yoffset=12   xadvance=53   page=1    chnl=0 
char id=1060    x=654  y=58   width=61   height=58   xoffset=-2   yoffset=12   xadvance=65   page=1    chnl=0 
char id=1061    x=715  y=58   width=61   height=58   xoffset=-4   yoffset=12   xadvance=61   page=1    chnl=0 
char id=1063    x=776  y=58   width=56   height=58   xoffset=-4   yoffset=12   xadvance=55   page=1    chnl=0 
char id=1064    x=832  y=58   width=82   height=58   xoffset=-4   yoffset=12   xadvance=81   page=1    chnl=0 
char id=1066    x=914  y=58   width=57   height=58   xoffset=-3   yoffset=12   xadvance=59   page=1    chnl=0 
char id=1067    x=0    y=116  width=71   height=58   xoffset=-4   yoffset=12   xadvance=71   page=1    chnl=0 
char id=1068    x=971  y=58   width=48   height=58   xoffset=-4   yoffset=12   xadvance=49   page=1    chnl=0 
char id=1071    x=71   y=116  width=59   height=58   xoffset=-6   yoffset=12   xadvance=56   page=1    chnl=0 
char id=1072    x=599  y=285  width=40   height=44   xoffset=-2   yoffset=27   xadvance=40   page=1    chnl=0 
char id=1074    x=866  y=329  width=40   height=42   xoffset=-4   yoffset=28   xadvance=42   page=1    chnl=0 
char id=1075    x=906  y=329  width=38   height=42   xoffset=-3   yoffset=28   xadvance=38   page=1    chnl=0 
char id=1076    x=296  y=231  width=44   height=51   xoffset=-4   yoffset=28   xadvance=45   page=1    chnl=0 
char id=1077    x=639  y=285  width=37   height=44   xoffset=-3   yoffset=27   xadvance=39   page=1    chnl=0 
char id=1078    x=944  y=329  width=58   height=42   xoffset=-4   yoffset=28   xadvance=58   page=1    chnl=0 
char id=1079    x=676  y=285  width=35   height=44   xoffset=-4   yoffset=27   xadvance=36   page=1    chnl=0 
char id=1080    x=0    y=373  width=46   height=42   xoffset=-3   yoffset=28   xadvance=47   page=1    chnl=0 
char id=1081    x=239  y=174  width=46   height=57   xoffset=-3   yoffset=13   xadvance=47   page=1    chnl=0 
char id=1082    x=46   y=373  width=43   height=42   xoffset=-3   yoffset=28   xadvance=43   page=1    chnl=0 
char id=1083    x=587  y=329  width=44   height=43   xoffset=-4   yoffset=28   xadvance=44   page=1    chnl=0 
char id=1084    x=89   y=373  width=52   height=42   xoffset=-3   yoffset=28   xadvance=54   page=1    chnl=0 
char id=1085    x=141  y=373  width=46   height=42   xoffset=-3   yoffset=28   xadvance=47   page=1    chnl=0 
char id=1086    x=711  y=285  width=41   height=44   xoffset=-3   yoffset=27   xadvance=43   page=1    chnl=0 
char id=1087    x=187  y=373  width=46   height=42   xoffset=-3   yoffset=28   xadvance=47   page=1    chnl=0 
char id=1088    x=130  y=116  width=43   height=58   xoffset=-4   yoffset=27   xadvance=44   page=1    chnl=0 
char id=1089    x=752  y=285  width=37   height=44   xoffset=-2   yoffset=27   xadvance=40   page=1    chnl=0 
char id=1090    x=233  y=373  width=40   height=42   xoffset=-4   yoffset=28   xadvance=39   page=1    chnl=0 
char id=1091    x=285  y=174  width=45   height=57   xoffset=-5   yoffset=28   xadvance=42   page=1    chnl=0 
char id=1093    x=273  y=373  width=44   height=42   xoffset=-4   yoffset=28   xadvance=43   page=1    chnl=0 
char id=1094    x=340  y=231  width=46   height=51   xoffset=-3   yoffset=28   xadvance=47   page=1    chnl=0 
char id=1095    x=317  y=373  width=44   height=42   xoffset=-4   yoffset=28   xadvance=44   page=1    chnl=0 
char id=1096    x=361  y=373  width=63   height=42   xoffset=-3   yoffset=28   xadvance=63   page=1    chnl=0 
char id=1097    x=386  y=231  width=63   height=51   xoffset=-3   yoffset=28   xadvance=63   page=1    chnl=0 
char id=1098    x=424  y=373  width=45   height=42   xoffset=-5   yoffset=28   xadvance=45   page=1    chnl=0 
char id=1099    x=469  y=373  width=55   height=42   xoffset=-4   yoffset=28   xadvance=56   page=1    chnl=0 
char id=1100    x=524  y=373  width=39   height=42   xoffset=-3   yoffset=28   xadvance=41   page=1    chnl=0 
char id=1101    x=789  y=285  width=37   height=44   xoffset=-3   yoffset=27   xadvance=39   page=1    chnl=0 
char id=1102    x=826  y=285  width=61   height=44   xoffset=-4   yoffset=27   xadvance=62   page=1    chnl=0 
char id=1103    x=563  y=373  width=42   height=42   xoffset=-6   yoffset=28   xadvance=41   page=1    chnl=0 
char id=1105    x=824  y=174  width=37   height=56   xoffset=-3   yoffset=15   xadvance=39   page=1    chnl=0 
char id=1108    x=887  y=285  width=37   height=44   xoffset=-2   yoffset=27   xadvance=39   page=1    chnl=0 
char id=1109    x=924  y=285  width=32   height=44   xoffset=-1   yoffset=27   xadvance=36   page=1    chnl=0 
char id=1111    x=330  y=174  width=31   height=57   xoffset=-4   yoffset=13   xadvance=28   page=1    chnl=0 
char id=1113    x=631  y=329  width=59   height=43   xoffset=-4   yoffset=28   xadvance=60   page=1    chnl=0 
char id=1114    x=605  y=373  width=58   height=42   xoffset=-4   yoffset=28   xadvance=60   page=1    chnl=0 
char id=1119    x=449  y=231  width=46   height=51   xoffset=-3   yoffset=28   xadvance=47   page=1    chnl=0 
char id=1169    x=721  y=231  width=33   height=48   xoffset=-3   yoffset=22   xadvance=33   page=1    chnl=0 
char id=1170    x=173  y=116  width=49   height=58   xoffset=-4   yoffset=12   xadvance=50   page=1    chnl=0 
char id=1171    x=663  y=373  width=38   height=42   xoffset=-3   yoffset=28   xadvance=38   page=1    chnl=0 
char id=1175    x=495  y=231  width=58   height=51   xoffset=-4   yoffset=28   xadvance=58   page=1    chnl=0 
char id=1179    x=553  y=231  width=43   height=51   xoffset=-3   yoffset=28   xadvance=43   page=1    chnl=0 
char id=1181    x=701  y=373  width=43   height=42   xoffset=-3   yoffset=28   xadvance=43   page=1    chnl=0 
char id=1187    x=596  y=231  width=46   height=51   xoffset=-3   yoffset=28   xadvance=47   page=1    chnl=0 
char id=1198    x=222  y=116  width=62   height=58   xoffset=-5   yoffset=12   xadvance=60   page=1    chnl=0 
char id=1199    x=361  y=174  width=46   height=57   xoffset=-5   yoffset=28   xadvance=44   page=1    chnl=0 
char id=1200    x=284  y=116  width=62   height=58   xoffset=-5   yoffset=12   xadvance=60   page=1    chnl=0 
char id=1201    x=407  y=174  width=46   height=57   xoffset=-5   yoffset=28   xadvance=44   page=1    chnl=0 
char id=1203    x=642  y=231  width=44   height=51   xoffset=-4   yoffset=28   xadvance=43   page=1    chnl=0 
char id=1208    x=346  y=116  width=56   height=58   xoffset=-4   yoffset=12   xadvance=55   page=1    chnl=0 
char id=1209    x=744  y=373  width=44   height=42   xoffset=-4   yoffset=28   xadvance=44   page=1    chnl=0 
char id=1210    x=402  y=116  width=56   height=58   xoffset=-3   yoffset=12   xadvance=55   page=1    chnl=0 
char id=1211    x=788  y=373  width=44   height=42   xoffset=-3   yoffset=28   xadvance=44   page=1    chnl=0 
char id=1241    x=956  y=285  width=37   height=44   xoffset=-3   yoffset=27   xadvance=40   page=1    chnl=0 
char id=1257    x=0    y=329  width=41   height=44   xoffset=-2   yoffset=27   xadvance=44   page=1    chnl=0 
char id=8211    x=147  y=415  width=48   height=13   xoffset=-6   yoffset=41   xadvance=44   page=1    chnl=0 
char id=8212    x=195  y=415  width=84   height=13   xoffset=-6   yoffset=41   xadvance=80   page=1    chnl=0 
char id=8249    x=690  y=329  width=24   height=43   xoffset=-1   yoffset=27   xadvance=32   page=1    chnl=0 
char id=8250    x=714  y=329  width=24   height=43   xoffset=1    yoffset=27   xadvance=32   page=1    chnl=0 
char id=8355    x=458  y=116  width=42   height=58   xoffset=-4   yoffset=12   xadvance=44   page=1    chnl=0 
char id=8363    x=686  y=231  width=35   height=50   xoffset=1    yoffset=10   xadvance=45   page=1    chnl=0 
kernings count=852
kerning first=1056 second=58 amount=3
kerning first=1058 second=1083 amount=-4
kerning first=65 second=160 amount=-4
kerning first=958 second=959 amount=-3
kerning first=922 second=948 amount=-3
kerning first=1068 second=1071 amount=-4
kerning first=1060 second=1044 amount=-6
kerning first=84 second=45 amount=-7
kerning first=89 second=44 amount=-9
kerning first=114 second=45 amount=-1
kerning first=1118 second=46 amount=-7
kerning first=114 second=44 amount=-3
kerning first=49 second=49 amount=-3
kerning first=1059 second=1084 amount=-6
kerning first=1056 second=46 amount=-9
kerning first=932 second=58 amount=-4
kerning first=932 second=937 amount=-1
kerning first=86 second=65 amount=-9
kerning first=1088 second=1084 amount=-1
kerning first=933 second=44 amount=-9
kerning first=1073 second=1076 amount=-2
kerning first=939 second=943 amount=-4
kerning first=1041 second=1091 amount=-2
kerning first=84 second=79 amount=-1
kerning first=65 second=84 amount=-8
kerning first=76 second=86 amount=-7
kerning first=65 second=87 amount=-6
kerning first=910 second=954 amount=-6
kerning first=82 second=89 amount=-4
kerning first=955 second=971 amount=-1
kerning first=1090 second=1101 amount=2
kerning first=1052 second=1077 amount=-1
kerning first=87 second=97 amount=-6
kerning first=84 second=99 amount=-5
kerning first=89 second=101 amount=-7
kerning first=102 second=102 amount=-1
kerning first=114 second=103 amount=-1
kerning first=87 second=105 amount=-3
kerning first=86 second=58 amount=-5
kerning first=1043 second=1071 amount=-5
kerning first=89 second=111 amount=-7
kerning first=89 second=112 amount=-7
kerning first=89 second=113 amount=-8
kerning first=86 second=114 amount=-4
kerning first=84 second=115 amount=-5
kerning first=8217 second=116 amount=-1
kerning first=89 second=117 amount=-8
kerning first=89 second=118 amount=-7
kerning first=65 second=119 amount=-7
kerning first=65 second=121 amount=-7
kerning first=1069 second=1061 amount=-4
kerning first=1040 second=1057 amount=-4
kerning first=932 second=951 amount=-3
kerning first=1041 second=1076 amount=-2
kerning first=913 second=957 amount=-5
kerning first=1060 second=1063 amount=-5
kerning first=82 second=84 amount=-4
kerning first=932 second=947 amount=-4
kerning first=933 second=916 amount=-9
kerning first=1050 second=1086 amount=-4
kerning first=1070 second=1058 amount=-2
kerning first=1056 second=1103 amount=-3
kerning first=1043 second=1085 amount=-3
kerning first=1168 second=59 amount=-2
kerning first=1054 second=1060 amount=1
kerning first=1062 second=1054 amount=-1
kerning first=1042 second=1040 amount=-5
kerning first=1056 second=1059 amount=-2
kerning first=913 second=947 amount=-5
kerning first=1043 second=1052 amount=-1
kerning first=1093 second=1101 amount=-1
kerning first=1057 second=1101 amount=1
kerning first=89 second=58 amount=-7
kerning first=160 second=933 amount=-3
kerning first=958 second=945 amount=-3
kerning first=908 second=939 amount=-4
kerning first=1058 second=1091 amount=-4
kerning first=923 second=927 amount=-3
kerning first=1057 second=1090 amount=-1
kerning first=910 second=927 amount=-6
kerning first=1058 second=171 amount=-4
kerning first=1027 second=187 amount=-2
kerning first=1068 second=1052 amount=-3
kerning first=954 second=958 amount=-2
kerning first=1059 second=1051 amount=-8
kerning first=1043 second=8212 amount=-2
kerning first=1044 second=1069 amount=2
kerning first=8216 second=8216 amount=-5
kerning first=1068 second=8217 amount=-5
kerning first=1054 second=1071 amount=-5
kerning first=913 second=927 amount=-3
kerning first=1059 second=1076 amount=-10
kerning first=1059 second=1081 amount=-4
kerning first=1076 second=1079 amount=1
kerning first=87 second=59 amount=-3
kerning first=1047 second=1083 amount=-1
kerning first=1056 second=1101 amount=2
kerning first=1070 second=1040 amount=-3
kerning first=82 second=87 amount=-4
kerning first=1057 second=1044 amount=-4
kerning first=1041 second=1040 amount=-1
kerning first=1056 second=1077 amount=-1
kerning first=950 second=940 amount=-3
kerning first=1070 second=1051 amount=-4
kerning first=118 second=46 amount=-5
kerning first=932 second=46 amount=-5
kerning first=65 second=89 amount=-7
kerning first=1050 second=1089 amount=-2
kerning first=1070 second=1076 amount=-2
kerning first=1040 second=1054 amount=-4
kerning first=1068 second=1057 amount=-2
kerning first=76 second=8217 amount=-7
kerning first=902 second=957 amount=-5
kerning first=1072 second=1091 amount=-4
kerning first=915 second=916 amount=-9
kerning first=1051 second=1073 amount=-1
kerning first=1073 second=1083 amount=-2
kerning first=1044 second=1047 amount=2
kerning first=1040 second=1063 amount=-11
kerning first=1082 second=1090 amount=-1
kerning first=1086 second=1083 amount=-1
kerning first=1046 second=1059 amount=-1
kerning first=1168 second=8212 amount=-2
kerning first=1046 second=1077 amount=-4
kerning first=932 second=920 amount=-1
kerning first=939 second=934 amount=-6
kerning first=933 second=945 amount=-7
kerning first=958 second=948 amount=-3
kerning first=947 second=949 amount=-1
kerning first=954 second=963 amount=-2
kerning first=950 second=964 amount=-5
kerning first=932 second=966 amount=-5
kerning first=1068 second=1046 amount=-5
kerning first=933 second=58 amount=-7
kerning first=1058 second=1099 amount=-4
kerning first=1058 second=1097 amount=-3
kerning first=908 second=913 amount=-3
kerning first=955 second=951 amount=-1
kerning first=1054 second=1046 amount=-2
kerning first=1058 second=1086 amount=-5
kerning first=1073 second=1103 amount=-2
kerning first=1058 second=44 amount=-7
kerning first=923 second=160 amount=-2
kerning first=932 second=940 amount=-5
kerning first=922 second=920 amount=-5
kerning first=927 second=939 amount=-4
kerning first=934 second=939 amount=-5
kerning first=932 second=59 amount=-4
kerning first=1059 second=1040 amount=-14
kerning first=1082 second=1101 amount=-1
kerning first=1093 second=1091 amount=-3
kerning first=1093 second=1073 amount=-3
kerning first=65 second=86 amount=-9
kerning first=1043 second=1044 amount=-6
kerning first=1050 second=1059 amount=-1
kerning first=1041 second=1061 amount=-2
kerning first=939 second=970 amount=-4
kerning first=8222 second=1058 amount=-7
kerning first=1041 second=1063 amount=-4
kerning first=910 second=972 amount=-7
kerning first=1069 second=1083 amount=-1
kerning first=932 second=927 amount=-1
kerning first=1042 second=1051 amount=-3
kerning first=1086 second=1078 amount=-2
kerning first=958 second=963 amount=-3
kerning first=1033 second=8217 amount=-4
kerning first=1042 second=1059 amount=-6
kerning first=929 second=44 amount=-8
kerning first=1043 second=1054 amount=-2
kerning first=80 second=44 amount=-8
kerning first=1073 second=1084 amount=-1
kerning first=1058 second=1089 amount=-3
kerning first=1062 second=1086 amount=-1
kerning first=910 second=923 amount=-12
kerning first=1058 second=1102 amount=-4
kerning first=84 second=105 amount=-3
kerning first=932 second=160 amount=-1
kerning first=902 second=947 amount=-5
kerning first=1059 second=1079 amount=-6
kerning first=1091 second=1077 amount=-1
kerning first=1027 second=44 amount=-10
kerning first=939 second=972 amount=-7
kerning first=1059 second=1103 amount=-8
kerning first=114 second=8217 amount=3
kerning first=954 second=962 amount=-2
kerning first=933 second=956 amount=-6
kerning first=1168 second=46 amount=-7
kerning first=1089 second=1072 amount=1
kerning first=923 second=933 amount=-11
kerning first=1040 second=1073 amount=-4
kerning first=933 second=966 amount=-7
kerning first=922 second=932 amount=-3
kerning first=1043 second=1057 amount=-1
kerning first=915 second=913 amount=-11
kerning first=910 second=940 amount=-7
kerning first=84 second=97 amount=-5
kerning first=936 second=966 amount=-5
kerning first=1068 second=1054 amount=-2
kerning first=1069 second=1047 amount=1
kerning first=1056 second=1040 amount=-9
kerning first=950 second=942 amount=-3
kerning first=1075 second=1083 amount=-4
kerning first=1093 second=1077 amount=-2
kerning first=1040 second=1060 amount=-5
kerning first=1041 second=1066 amount=-3
kerning first=84 second=114 amount=-3
kerning first=932 second=934 amount=-1
kerning first=1041 second=1058 amount=-1
kerning first=86 second=101 amount=-8
kerning first=80 second=65 amount=-7
kerning first=8217 second=8217 amount=-5
kerning first=1089 second=1091 amount=-1
kerning first=1168 second=187 amount=-3
kerning first=1054 second=1057 amount=1
kerning first=1043 second=1088 amount=-5
kerning first=915 second=912 amount=3
kerning first=933 second=913 amount=-12
kerning first=1086 second=1091 amount=-3
kerning first=1050 second=1091 amount=-5
kerning first=958 second=940 amount=-3
kerning first=929 second=923 amount=-7
kerning first=84 second=58 amount=-4
kerning first=902 second=927 amount=-3
kerning first=1075 second=46 amount=-8
kerning first=932 second=948 amount=-5
kerning first=160 second=932 amount=-1
kerning first=916 second=933 amount=-7
kerning first=1093 second=1095 amount=-4
kerning first=933 second=937 amount=-6
kerning first=937 second=939 amount=-4
kerning first=967 second=940 amount=-2
kerning first=932 second=941 amount=-5
kerning first=939 second=942 amount=-4
kerning first=933 second=943 amount=-4
kerning first=955 second=944 amount=-1
kerning first=933 second=947 amount=-7
kerning first=922 second=950 amount=-3
kerning first=950 second=951 amount=-3
kerning first=936 second=952 amount=-1
kerning first=910 second=953 amount=-4
kerning first=955 second=954 amount=-1
kerning first=954 second=972 amount=-2
kerning first=932 second=956 amount=-3
kerning first=950 second=957 amount=-3
kerning first=922 second=958 amount=-3
kerning first=936 second=959 amount=-5
kerning first=958 second=962 amount=-3
kerning first=915 second=923 amount=-11
kerning first=932 second=967 amount=-3
kerning first=932 second=968 amount=-3
kerning first=936 second=969 amount=-5
kerning first=910 second=970 amount=-4
kerning first=932 second=971 amount=-3
kerning first=958 second=972 amount=-3
kerning first=932 second=973 amount=-3
kerning first=910 second=916 amount=-9
kerning first=922 second=969 amount=-3
kerning first=8218 second=1026 amount=-7
kerning first=8218 second=1035 amount=-7
kerning first=1102 second=1093 amount=-3
kerning first=1057 second=1040 amount=-4
kerning first=1060 second=1083 amount=-4
kerning first=1054 second=1044 amount=-4
kerning first=1042 second=1046 amount=-2
kerning first=1068 second=1047 amount=-3
kerning first=1102 second=1078 amount=-2
kerning first=1058 second=1052 amount=-1
kerning first=86 second=97 amount=-8
kerning first=1046 second=1054 amount=-2
kerning first=1050 second=1057 amount=-2
kerning first=1040 second=1058 amount=-6
kerning first=933 second=920 amount=-6
kerning first=1051 second=1060 amount=-1
kerning first=1057 second=1061 amount=-2
kerning first=8218 second=1063 amount=-14
kerning first=1058 second=1051 amount=-4
kerning first=1082 second=171 amount=-2
kerning first=955 second=965 amount=-1
kerning first=1040 second=1059 amount=-6
kerning first=1041 second=1071 amount=-2
kerning first=1040 second=1072 amount=-1
kerning first=1059 second=1073 amount=-5
kerning first=1068 second=1044 amount=-5
kerning first=1059 second=1075 amount=-6
kerning first=1090 second=1076 amount=-1
kerning first=1058 second=1077 amount=-3
kerning first=1059 second=1078 amount=-6
kerning first=1088 second=1079 amount=1
kerning first=1058 second=1080 amount=-2
kerning first=958 second=950 amount=-3
kerning first=1058 second=1082 amount=-2
kerning first=1090 second=1083 amount=-2
kerning first=1058 second=1084 amount=-2
kerning first=958 second=966 amount=-3
kerning first=1093 second=1086 amount=-3
kerning first=1059 second=1087 amount=-6
kerning first=1059 second=1088 amount=-6
kerning first=1057 second=1089 amount=1
kerning first=1050 second=1090 amount=-3
kerning first=1061 second=1091 amount=-6
kerning first=1040 second=1092 amount=-3
kerning first=1059 second=1093 amount=-7
kerning first=1059 second=1094 amount=-6
kerning first=1057 second=1095 amount=-1
kerning first=1059 second=1096 amount=-6
kerning first=1059 second=1097 amount=-6
kerning first=1073 second=1098 amount=-2
kerning first=1043 second=1099 amount=-5
kerning first=902 second=932 amount=-8
kerning first=1086 second=1101 amount=1
kerning first=76 second=84 amount=-7
kerning first=1043 second=1103 amount=-5
kerning first=84 second=121 amount=-5
kerning first=89 second=59 amount=-7
kerning first=950 second=948 amount=-3
kerning first=70 second=44 amount=-6
kerning first=902 second=920 amount=-3
kerning first=913 second=967 amount=-5
kerning first=80 second=46 amount=-8
kerning first=908 second=916 amount=-2
kerning first=1058 second=1103 amount=-3
kerning first=929 second=46 amount=-8
kerning first=76 second=121 amount=-4
kerning first=1091 second=1083 amount=-3
kerning first=933 second=927 amount=-6
kerning first=902 second=934 amount=-3
kerning first=1046 second=1073 amount=-4
kerning first=1089 second=1092 amount=1
kerning first=1089 second=1073 amount=1
kerning first=1101 second=1084 amount=-1
kerning first=939 second=945 amount=-7
kerning first=1050 second=1077 amount=-3
kerning first=1086 second=1076 amount=-2
kerning first=160 second=923 amount=-4
kerning first=1043 second=1084 amount=-3
kerning first=1059 second=59 amount=-3
kerning first=1059 second=1060 amount=-5
kerning first=933 second=934 amount=-8
kerning first=87 second=121 amount=-4
kerning first=1075 second=44 amount=-8
kerning first=1040 second=8217 amount=-6
kerning first=1077 second=1093 amount=-1
kerning first=1059 second=8212 amount=-2
kerning first=913 second=933 amount=-11
kerning first=1042 second=1091 amount=-1
kerning first=160 second=902 amount=-4
kerning first=1057 second=1073 amount=1
kerning first=1072 second=1087 amount=-1
kerning first=1075 second=1077 amount=-1
kerning first=1043 second=1047 amount=2
kerning first=86 second=45 amount=-7
kerning first=1077 second=1089 amount=2
kerning first=1054 second=1059 amount=-4
kerning first=1056 second=1071 amount=-5
kerning first=916 second=927 amount=-1
kerning first=160 second=89 amount=-3
kerning first=1040 second=1069 amount=-2
kerning first=1054 second=1063 amount=-2
kerning first=929 second=916 amount=-6
kerning first=1058 second=187 amount=-2
kerning first=1060 second=1058 amount=-2
kerning first=84 second=59 amount=-4
kerning first=1041 second=1083 amount=-1
kerning first=1056 second=1054 amount=1
kerning first=950 second=959 amount=-3
kerning first=65 second=8217 amount=-8
kerning first=933 second=45 amount=-8
kerning first=1077 second=1072 amount=1
kerning first=1059 second=1044 amount=-7
kerning first=1086 second=1089 amount=2
kerning first=1041 second=1046 amount=-2
kerning first=967 second=948 amount=-2
kerning first=1082 second=1079 amount=-1
kerning first=84 second=117 amount=-3
kerning first=950 second=966 amount=-3
kerning first=1059 second=1102 amount=-6
kerning first=932 second=923 amount=-8
kerning first=1056 second=1076 amount=-3
kerning first=1047 second=1076 amount=-2
kerning first=1046 second=1047 amount=-2
kerning first=84 second=111 amount=-5
kerning first=89 second=45 amount=-8
kerning first=1088 second=1083 amount=-1
kerning first=1074 second=1078 amount=-2
kerning first=1058 second=1088 amount=-3
kerning first=1070 second=1044 amount=-5
kerning first=1059 second=171 amount=-6
kerning first=902 second=939 amount=-11
kerning first=1043 second=1100 amount=-5
kerning first=1042 second=1071 amount=-4
kerning first=1044 second=1077 amount=1
kerning first=1075 second=1103 amount=-2
kerning first=1068 second=1063 amount=-8
kerning first=1168 second=58 amount=-2
kerning first=1058 second=46 amount=-7
kerning first=1027 second=171 amount=-5
kerning first=933 second=953 amount=-4
kerning first=1090 second=1089 amount=1
kerning first=8222 second=1026 amount=-7
kerning first=1074 second=1073 amount=-1
kerning first=1069 second=1051 amount=-5
kerning first=950 second=954 amount=-2
kerning first=1056 second=1044 amount=-5
kerning first=910 second=966 amount=-7
kerning first=1050 second=1072 amount=-1
kerning first=1070 second=1054 amount=1
kerning first=8218 second=1066 amount=-7
kerning first=950 second=945 amount=-3
kerning first=1091 second=1072 amount=-1
kerning first=1079 second=1095 amount=-1
kerning first=939 second=940 amount=-7
kerning first=1059 second=44 amount=-12
kerning first=913 second=934 amount=-3
kerning first=939 second=954 amount=-6
kerning first=1076 second=1101 amount=2
kerning first=1056 second=1086 amount=-2
kerning first=1073 second=1091 amount=-3
kerning first=1057 second=1059 amount=-1
kerning first=1086 second=1103 amount=-1
kerning first=950 second=969 amount=-3
kerning first=1057 second=1063 amount=-2
kerning first=967 second=962 amount=-2
kerning first=1091 second=46 amount=-7
kerning first=1078 second=1077 amount=-1
kerning first=932 second=949 amount=-5
kerning first=1090 second=1079 amount=1
kerning first=939 second=959 amount=-7
kerning first=933 second=972 amount=-7
kerning first=950 second=974 amount=-3
kerning first=87 second=160 amount=-1
kerning first=1042 second=1076 amount=-2
kerning first=160 second=84 amount=-1
kerning first=1043 second=1076 amount=-5
kerning first=936 second=945 amount=-5
kerning first=939 second=916 amount=-9
kerning first=1102 second=1083 amount=-2
kerning first=1040 second=1090 amount=-4
kerning first=936 second=974 amount=-5
kerning first=1068 second=1058 amount=-5
kerning first=89 second=65 amount=-8
kerning first=1101 second=1076 amount=-4
kerning first=1058 second=1093 amount=-4
kerning first=934 second=913 amount=-3
kerning first=927 second=913 amount=-3
kerning first=1042 second=1061 amount=-2
kerning first=902 second=933 amount=-11
kerning first=87 second=111 amount=-6
kerning first=1043 second=1074 amount=-3
kerning first=1027 second=46 amount=-10
kerning first=1042 second=1044 amount=-3
kerning first=1072 second=1090 amount=-2
kerning first=913 second=939 amount=-11
kerning first=1102 second=1095 amount=-3
kerning first=1060 second=1059 amount=-5
kerning first=939 second=913 amount=-12
kerning first=1069 second=1046 amount=-2
kerning first=1059 second=1069 amount=-1
kerning first=1074 second=1092 amount=-1
kerning first=86 second=44 amount=-9
kerning first=1043 second=1086 amount=-6
kerning first=86 second=160 amount=-1
kerning first=84 second=101 amount=-5
kerning first=1091 second=1076 amount=-5
kerning first=1078 second=1095 amount=-2
kerning first=1078 second=1098 amount=-1
kerning first=939 second=920 amount=-6
kerning first=1061 second=1060 amount=-6
kerning first=910 second=913 amount=-12
kerning first=82 second=121 amount=-3
kerning first=84 second=160 amount=-1
kerning first=954 second=974 amount=-1
kerning first=920 second=939 amount=-4
kerning first=1082 second=1089 amount=-2
kerning first=8222 second=1063 amount=-14
kerning first=923 second=920 amount=-3
kerning first=86 second=59 amount=-5
kerning first=1102 second=1084 amount=-1
kerning first=1059 second=1080 amount=-6
kerning first=939 second=927 amount=-6
kerning first=1042 second=1063 amount=-4
kerning first=1078 second=1086 amount=-2
kerning first=933 second=942 amount=-4
kerning first=114 second=46 amount=-4
kerning first=1059 second=46 amount=-12
kerning first=1056 second=1047 amount=1
kerning first=915 second=44 amount=-9
kerning first=955 second=942 amount=-1
kerning first=1102 second=1076 amount=-4
kerning first=1059 second=187 amount=-5
kerning first=1074 second=1103 amount=-1
kerning first=933 second=59 amount=-7
kerning first=1082 second=1077 amount=-2
kerning first=910 second=920 amount=-6
kerning first=1042 second=1058 amount=-1
kerning first=1060 second=1040 amount=-5
kerning first=1086 second=1090 amount=-1
kerning first=933 second=940 amount=-7
kerning first=1059 second=58 amount=-3
kerning first=1046 second=1058 amount=-1
kerning first=1047 second=1046 amount=-1
kerning first=89 second=46 amount=-9
kerning first=65 second=118 amount=-5
kerning first=86 second=111 amount=-9
kerning first=937 second=933 amount=-4
kerning first=1040 second=1091 amount=-4
kerning first=1082 second=1086 amount=-4
kerning first=1091 second=1073 amount=-1
kerning first=1041 second=1051 amount=-2
kerning first=1069 second=1054 amount=1
kerning first=923 second=932 amount=-8
kerning first=1058 second=1072 amount=-2
kerning first=910 second=959 amount=-7
kerning first=1056 second=1058 amount=1
kerning first=1074 second=1084 amount=-1
kerning first=954 second=959 amount=-2
kerning first=1090 second=1072 amount=1
kerning first=1059 second=1077 amount=-9
kerning first=1077 second=1076 amount=-1
kerning first=1059 second=1047 amount=-1
kerning first=87 second=101 amount=-6
kerning first=1101 second=1083 amount=-1
kerning first=920 second=923 amount=-3
kerning first=1094 second=1079 amount=1
kerning first=936 second=940 amount=-5
kerning first=1058 second=1087 amount=-3
kerning first=1056 second=1060 amount=-1
kerning first=1050 second=1101 amount=-1
kerning first=920 second=913 amount=-3
kerning first=1056 second=187 amount=2
kerning first=1084 second=1101 amount=1
kerning first=1091 second=59 amount=-1
kerning first=160 second=65 amount=-4
kerning first=1043 second=1072 amount=-2
kerning first=1168 second=44 amount=-7
kerning first=1086 second=1077 amount=1
kerning first=1051 second=1091 amount=-2
kerning first=1100 second=1090 amount=-3
kerning first=939 second=953 amount=-4
kerning first=916 second=160 amount=-4
kerning first=967 second=966 amount=-2
kerning first=922 second=966 amount=-3
kerning first=1088 second=1076 amount=-1
kerning first=1058 second=1054 amount=-1
kerning first=1047 second=1071 amount=-3
kerning first=1091 second=1078 amount=-1
kerning first=939 second=923 amount=-12
kerning first=1051 second=1086 amount=-2
kerning first=8217 second=160 amount=-5
kerning first=1091 second=1092 amount=-2
kerning first=1059 second=1071 amount=-8
kerning first=84 second=44 amount=-5
kerning first=1090 second=1091 amount=-1
kerning first=967 second=945 amount=-2
kerning first=76 second=89 amount=-7
kerning first=70 second=65 amount=-5
kerning first=1059 second=1085 amount=-6
kerning first=1090 second=1078 amount=1
kerning first=1068 second=1069 amount=-1
kerning first=923 second=939 amount=-11
kerning first=911 second=933 amount=-4
kerning first=1089 second=1101 amount=1
kerning first=1058 second=1071 amount=-3
kerning first=1027 second=8212 amount=-2
kerning first=1056 second=1051 amount=-5
kerning first=1118 second=44 amount=-7
kerning first=8222 second=1035 amount=-7
kerning first=967 second=969 amount=-2
kerning first=1077 second=1079 amount=1
kerning first=920 second=933 amount=-4
kerning first=1072 second=1083 amount=1
kerning first=86 second=117 amount=-4
kerning first=1092 second=1076 amount=-2
kerning first=1070 second=1061 amount=-7
kerning first=929 second=913 amount=-7
kerning first=1088 second=1095 amount=-2
kerning first=1090 second=46 amount=-5
kerning first=933 second=951 amount=-4
kerning first=1044 second=1079 amount=2
kerning first=1040 second=1086 amount=-4
kerning first=1070 second=1063 amount=-3
kerning first=1091 second=1103 amount=-2
kerning first=955 second=957 amount=-1
kerning first=954 second=940 amount=-1
kerning first=932 second=916 amount=-6
kerning first=1065 second=1091 amount=1
kerning first=1047 second=1044 amount=-4
kerning first=935 second=969 amount=-2
kerning first=1093 second=1072 amount=-1
kerning first=8218 second=1058 amount=-7
kerning first=933 second=959 amount=-7
kerning first=936 second=948 amount=-5
kerning first=1101 second=1078 amount=-3
kerning first=1092 second=1091 amount=-2
kerning first=920 second=916 amount=-2
kerning first=1050 second=1079 amount=-1
kerning first=939 second=966 amount=-7
kerning first=86 second=46 amount=-9
kerning first=1074 second=1095 amount=-3
kerning first=1069 second=1071 amount=-4
kerning first=1056 second=59 amount=3
kerning first=1089 second=1077 amount=1
kerning first=1077 second=1092 amount=1
kerning first=1057 second=1051 amount=-2
kerning first=1079 second=1079 amount=1
kerning first=1043 second=1102 amount=-4
kerning first=1074 second=1083 amount=-1
kerning first=84 second=65 amount=-6
kerning first=1060 second=1051 amount=-5
kerning first=950 second=953 amount=-4
kerning first=1042 second=1093 amount=-1
kerning first=1043 second=44 amount=-8
kerning first=89 second=160 amount=-3
kerning first=1061 second=1054 amount=-4
kerning first=913 second=932 amount=-8
kerning first=1091 second=1084 amount=-1
kerning first=1040 second=1089 amount=-2
kerning first=1040 second=1047 amount=-2
kerning first=1052 second=1095 amount=-3
kerning first=1082 second=1072 amount=-1
kerning first=1079 second=1084 amount=-1
kerning first=1046 second=1072 amount=-2
kerning first=939 second=948 amount=-6
kerning first=1061 second=1086 amount=-5
kerning first=1082 second=1095 amount=-3
kerning first=913 second=920 amount=-3
kerning first=87 second=44 amount=-7
kerning first=1056 second=1061 amount=-5
kerning first=927 second=933 amount=-4
kerning first=1057 second=1091 amount=-2
kerning first=934 second=933 amount=-5
kerning first=932 second=945 amount=-5
kerning first=1089 second=1093 amount=-1
kerning first=1056 second=44 amount=-9
kerning first=1043 second=1091 amount=-3
kerning first=1079 second=1091 amount=-2
kerning first=1077 second=1095 amount=-2
kerning first=1059 second=1074 amount=-8
kerning first=1061 second=1057 amount=-3
kerning first=933 second=46 amount=-9
kerning first=1079 second=1078 amount=-1
kerning first=1078 second=1089 amount=-1
kerning first=160 second=916 amount=-4
kerning first=1043 second=1083 amount=-5
kerning first=1090 second=44 amount=-5
kerning first=1069 second=1076 amount=-2
kerning first=1050 second=1054 amount=-2
kerning first=1050 second=1060 amount=-3
kerning first=950 second=972 amount=-3
kerning first=1091 second=58 amount=-1
kerning first=1058 second=1060 amount=-2
kerning first=910 second=948 amount=-6
kerning first=1059 second=1086 amount=-8
kerning first=1074 second=1098 amount=-2
kerning first=932 second=912 amount=3
kerning first=908 second=923 amount=-3
kerning first=1090 second=1086 amount=-1
kerning first=1066 second=8217 amount=-5
kerning first=967 second=963 amount=-2
kerning first=922 second=963 amount=-3
kerning first=8217 second=115 amount=-4
kerning first=933 second=954 amount=-6
kerning first=1066 second=1071 amount=-4
kerning first=1088 second=1101 amount=2
kerning first=935 second=974 amount=-2
kerning first=76 second=87 amount=-5
kerning first=1069 second=1044 amount=-6
kerning first=1075 second=1084 amount=-1
kerning first=913 second=8217 amount=-8
kerning first=102 second=8217 amount=4
kerning first=1086 second=1084 amount=-1
kerning first=932 second=953 amount=-3
kerning first=932 second=972 amount=-5
kerning first=1050 second=1069 amount=1
kerning first=1034 second=8217 amount=-4
kerning first=1052 second=1086 amount=-2
kerning first=1090 second=1103 amount=-1
kerning first=1091 second=44 amount=-7
kerning first=87 second=65 amount=-8
kerning first=89 second=97 amount=-7
kerning first=1058 second=1044 amount=-5
kerning first=1092 second=1095 amount=-2
kerning first=1088 second=1090 amount=-1
kerning first=955 second=973 amount=-1
kerning first=1074 second=1090 amount=-2
kerning first=1073 second=1078 amount=-2
kerning first=119 second=46 amount=-5
kerning first=1093 second=1089 amount=-2
kerning first=1052 second=1060 amount=-1
kerning first=1043 second=1077 amount=-5
kerning first=967 second=974 amount=-2
kerning first=922 second=974 amount=-3
kerning first=932 second=45 amount=-7
kerning first=160 second=939 amount=-3
kerning first=932 second=957 amount=-3
kerning first=1054 second=1076 amount=-1
kerning first=1061 second=1069 amount=-1
kerning first=87 second=58 amount=-3
kerning first=87 second=46 amount=-7
kerning first=931 second=964 amount=-1
kerning first=82 second=86 amount=-6
kerning first=950 second=947 amount=-3
kerning first=913 second=160 amount=-4
kerning first=121 second=44 amount=-5
kerning first=933 second=923 amount=-12
kerning first=1101 second=1103 amount=-1
kerning first=1073 second=1093 amount=-3
kerning first=1074 second=1072 amount=-1
kerning first=1046 second=1091 amount=-4
kerning first=916 second=939 amount=-7
kerning first=1077 second=101 amount=1
kerning first=1058 second=1040 amount=-4
kerning first=1078 second=1079 amount=1
kerning first=908 second=933 amount=-4
kerning first=939 second=963 amount=-8
kerning first=1047 second=1059 amount=-2
kerning first=1056 second=1046 amount=-3
kerning first=910 second=942 amount=-4
kerning first=1043 second=46 amount=-8
kerning first=1091 second=1086 amount=-2
kerning first=1102 second=1090 amount=-1
kerning first=1043 second=187 amount=-2
kerning first=1058 second=1074 amount=-4
kerning first=1068 second=1051 amount=-3
kerning first=1060 second=1054 amount=1
kerning first=8222 second=1066 amount=-7
kerning first=1059 second=1082 amount=-6
kerning first=939 second=937 amount=-6
kerning first=967 second=959 amount=-2
kerning first=902 second=967 amount=-5
kerning first=910 second=956 amount=-6
kerning first=1089 second=1095 amount=-1
kerning first=910 second=945 amount=-7
kerning first=1058 second=1100 amount=-5
kerning first=1092 second=1083 amount=-2
kerning first=1041 second=1060 amount=-1
kerning first=936 second=972 amount=-5
kerning first=160 second=86 amount=-1
kerning first=1079 second=1076 amount=-1
kerning first=1082 second=1091 amount=-1
kerning first=1047 second=1063 amount=-3
kerning first=910 second=963 amount=-8
kerning first=1093 second=1098 amount=-3
kerning first=1054 second=1051 amount=-4
kerning first=1043 second=1051 amount=-5
kerning first=121 second=46 amount=-5
kerning first=1047 second=1051 amount=-3
kerning first=160 second=913 amount=-4
kerning first=1090 second=1088 amount=1
kerning first=1057 second=1077 amount=1
kerning first=1061 second=1047 amount=-2
kerning first=1059 second=1089 amount=-9
kerning first=954 second=966 amount=-1
kerning first=954 second=948 amount=-2
kerning first=1042 second=1095 amount=-2
kerning first=939 second=160 amount=-3
kerning first=927 second=916 amount=-2
kerning first=1070 second=1046 amount=-5
kerning first=1082 second=1092 amount=-2
kerning first=902 second=160 amount=-4
kerning first=954 second=945 amount=-1
kerning first=967 second=972 amount=-2
kerning first=910 second=951 amount=-4
kerning first=1100 second=1095 amount=-5
kerning first=933 second=948 amount=-6
kerning first=932 second=913 amount=-6
kerning first=1101 second=1093 amount=-3
kerning first=1059 second=1083 amount=-8
kerning first=1057 second=1066 amount=-1
kerning first=933 second=970 amount=-4
kerning first=936 second=963 amount=-5
kerning first=89 second=105 amount=-4
kerning first=954 second=969 amount=-1
kerning first=84 second=46 amount=-5
kerning first=1041 second=1044 amount=-3
kerning first=80 second=160 amount=-3
kerning first=1073 second=1077 amount=-1
kerning first=1168 second=171 amount=-6
kerning first=922 second=940 amount=-3
kerning first=1078 second=1073 amount=-1
kerning first=1093 second=1092 amount=-3
kerning first=958 second=958 amount=-3
kerning first=1079 second=1098 amount=-1
kerning first=1089 second=1079 amount=2
kerning first=1074 second=1076 amount=-2
kerning first=87 second=114 amount=-3
kerning first=933 second=160 amount=-3
kerning first=1092 second=1103 amount=-1
kerning first=1074 second=1091 amount=-2
kerning first=1072 second=1095 amount=-3
kerning first=1070 second=1083 amount=-1
kerning first=1043 second=1080 amount=-3
kerning first=1068 second=1040 amount=-3
kerning first=916 second=932 amount=-5
kerning first=1075 second=1076 amount=-4
kerning first=119 second=44 amount=-5
kerning first=1118 second=187 amount=1
kerning first=932 second=959 amount=-5
kerning first=950 second=963 amount=-3
kerning first=1073 second=1095 amount=-3
kerning first=1046 second=1066 amount=-1
kerning first=84 second=119 amount=-5
kerning first=950 second=952 amount=-3
kerning first=1041 second=1059 amount=-3
kerning first=1060 second=1071 amount=-6
kerning first=1093 second=1090 amount=-2
kerning first=1068 second=1061 amount=-5
kerning first=1093 second=1079 amount=-1
kerning first=1050 second=1063 amount=-1
kerning first=933 second=963 amount=-8
kerning first=922 second=945 amount=-3
kerning first=939 second=956 amount=-6
kerning first=955 second=953 amount=-1
kerning first=922 second=927 amount=-5
kerning first=915 second=46 amount=-9
kerning first=1043 second=1040 amount=-8
kerning first=1043 second=171 amount=-5
kerning first=1040 second=1077 amount=-2
kerning first=76 second=160 amount=-3
kerning first=1059 second=1054 amount=-4
kerning first=1054 second=1040 amount=-4
kerning first=1082 second=1073 amount=-2
kerning first=1075 second=1086 amount=-2
kerning first=915 second=953 amount=-3
kerning first=86 second=121 amount=-8
kerning first=910 second=937 amount=-6
kerning first=70 second=46 amount=-6
kerning first=1056 second=1057 amount=1
kerning first=1052 second=1091 amount=-2
kerning first=1088 second=1091 amount=-1
kerning first=1086 second=1095 amount=-2
kerning first=1091 second=187 amount=2
kerning first=1046 second=1086 amount=-4
kerning first=1042 second=1066 amount=-4
kerning first=1070 second=1078 amount=1
kerning first=87 second=45 amount=-4
kerning first=939 second=951 amount=-4
kerning first=1046 second=1057 amount=-2
kerning first=922 second=952 amount=-3
kerning first=927 second=923 amount=-3
kerning first=932 second=44 amount=-5
kerning first=1044 second=1059 amount=1
kerning first=118 second=44 amount=-5
kerning first=1086 second=1093 amount=-2
kerning first=1054 second=1061 amount=-6
kerning first=910 second=943 amount=-4
kerning first=910 second=934 amount=-8
kerning first=922 second=934 amount=-5
kerning first=87 second=117 amount=-3
kerning first=86 second=105 amount=-4
kerning first=1077 second=1091 amount=-2
kerning first=932 second=963 amount=-5
kerning first=160 second=87 amount=-1
  `,
  {
    'timesnewroman1.png': timesnewroman1,
    'timesnewroman2.png': timesnewroman2,
  },
  {
    normal: 0.5,
    bold: 0.2,
    bolder: 0.05,
    lighter: 0.9,
  }
);
