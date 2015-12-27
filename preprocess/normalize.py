import sys
#data = '../static/data/pr_nonregister.csv'
data = sys.argv[1]
print data

with open(data, 'r') as _in:
    output = '%s/%s%s'%('/'.join(data.split('/')[:-1]) , data.split('/')[-1].split('.')[0] , '_out.csv')
    print output
    with open(output, 'w') as _out:
        _out.write('node,new_score\n')
        lines = _in.readlines()
        for i, line in enumerate(lines):
            line1 = [ a.strip() for a in line.split(',')]
            if i == 0:
                continue
            if line1[2] == '-1':
                print line.strip()
            else:
                _out.write('%s,%d\n'%(line1[0],int(float(line1[1]))))
