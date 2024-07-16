import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import MapSchemaCell from './MapSchemaCell';
import { PencilSimple, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import useKeySelectModal from '@/app/hooks/useKeySelectModal';

interface MapSchemaTableProps {
  tableMappedDataRows: string[][];
  isLoading: boolean;
}

const MapSchemaTable = ({ tableMappedDataRows, isLoading }: MapSchemaTableProps) => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const keySelectModal = useKeySelectModal();
  const [keyMap, setKeyMap] = useState<{ [key: string]: string }>({});

  const handleDeleteClick = (thisKey: string) => {
    if (selectedFile) {
      const currentKeys = keyMap;
      delete currentKeys[thisKey];
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentKeys);
      const currentTableData = selectedFile.tableMappedDataRows;
      if (selectedFile.tableMappedDataRows === undefined) return;
      const keyIndex = currentTableData[0].indexOf(thisKey);
      const newMappedData = currentTableData.map((innerArray) => innerArray.filter((_, index) => index !== keyIndex));
      updateFileAtIndex(selectedFileIndex, 'tableMappedDataRows', newMappedData);
    }
  };
  const handleMappedDeleteClick = (thisKey: string) => {
    if (selectedFile) {
      const currentKeys = selectedFile.keyMap;
      currentKeys[thisKey] = '';
      const currentTableData = selectedFile.tableMappedDataRows;
      const keyIndex = currentTableData[0].indexOf(thisKey);
      const newMappedData = currentTableData.map((innerArray, rowIndex) =>
        innerArray.map((val, index) => {
          if (index !== keyIndex || rowIndex === 0) return val;
          return '';
        })
      );
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentKeys);
      updateFileAtIndex(selectedFileIndex, 'tableMappedDataRows', newMappedData);
    }
  };
  const handleEditClick = (thisKey: string) => {
    if (selectedFile) {
      const allTables = selectedFile.tableMdExtractResult;
      const selectedTables = allTables.filter((table, i) => selectedFile.tableMapIndices.has(i));
      keySelectModal.setInputKey(thisKey);
      keySelectModal.setTableData(selectedTables);
      keySelectModal.onOpen();
    }
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
      setKeyMap(thisFile.keyMap);
      console.log('selectedFile', thisFile, thisFile.keyMap);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);
  const inputKeys = Object.keys(keyMap);
  const mappedKeys = Object.values(keyMap);
  return (
    <div className="w-full h-full">
      <table className="mapped-table">
        <thead>
          <tr>
            <th>Input Key</th>
            {Object.keys(keyMap).length > 0 &&
              inputKeys.map((inputKey, i) => (
                <th key={`${inputKey}_${i}`}>
                  <MapSchemaCell
                    text={inputKey}
                    handleIconClick={() => handleDeleteClick(inputKey)}
                    icon={X}
                    isLoading={isLoading}
                    bold
                  />
                </th>
              ))}
          </tr>
          <tr>
            <th>Mapped Key</th>
            {Object.keys(keyMap).length > 0 &&
              mappedKeys.map((mappedKey, i) => (
                <th key={`${mappedKey}_${i}`}>
                  <MapSchemaCell
                    text={mappedKey || ''}
                    handleIconClick={() => handleEditClick(inputKeys[i])}
                    icon={PencilSimple}
                    secondIcon={X}
                    handleSecondIconClick={() => handleMappedDeleteClick(inputKeys[i])}
                    isLoading={isLoading}
                  />
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableMappedDataRows &&
            tableMappedDataRows.length > 0 &&
            tableMappedDataRows.slice(1).map((tableRow, rowIndex) => (
              <tr key={rowIndex}>
                {rowIndex === 0 ? <th>Mapped Values</th> : <th></th>}
                {tableRow.map((tableData, cellIndex) => (
                  <td key={cellIndex}>
                    <MapSchemaCell text={tableData || ''} isLoading={isLoading} />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MapSchemaTable;
