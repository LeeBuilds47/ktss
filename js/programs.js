const box=$('#plist'),q=$('#q');
renderPrograms(box,'');q.oninput=()=>renderPrograms(box,q.value);