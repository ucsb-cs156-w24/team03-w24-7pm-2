import OurTable, { ButtonColumn } from "main/components/OurTable";

import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/RecommendationRequestUtils";
import { hasRole } from "main/utils/currentUser";
import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router-dom";

export default function RecommendationRequestTable({ recommendations, currentUser, testIdPrefix = "RecommendationRequestTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/recommendationrequests/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/recommendationrequests/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'RequesterEmail',
            accessor: 'requesterEmail',
        },
        {
            Header: 'ProfessorEmail',
            accessor: 'professorEmail',
        },
        {
            Header: 'Explanation',
            accessor: 'explanation',
        },
        {
            Header: 'DateRequested',
            accessor: 'dateRequested',
        },
        {
            Header: 'DateNeeded',
            accessor: 'dateNeeded',
        },
        {
            Header: 'Done',
            accessor: (row,_rowIndex) => String(row.done)
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    } 

    return <OurTable
        data={recommendations}
        columns={columns}
        testid={testIdPrefix}
    />;
};